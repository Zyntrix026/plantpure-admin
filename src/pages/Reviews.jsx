import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Star, CheckCircle2, Trash2, MessageSquare, 
  Search, Package, Calendar, Loader2, RefreshCw, AlertTriangle
} from 'lucide-react';
import { 
  getAllReviewsAdmin, 
  getReviewStats, 
  toggleReviewStatus, 
  deleteReviewByAdmin 
} from '../lib/review'; 

// --- MODERN CUSTOM DETACHED MODAL ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 transform transition-all">
        <div className="flex items-center gap-3 text-rose-600 mb-4">
          <div className="p-2 bg-rose-50 rounded-lg">
            <AlertTriangle size={20} />
          </div>
          <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
        </div>
        <p className="text-base text-slate-500 mb-6 leading-relaxed">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 py-2.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors flex items-center gap-2 min-w-[90px] justify-center"
          >
            {isLoading ? <RefreshCw size={15} className="animate-spin" /> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN FRONTEND OPERATIONS PAGE ---
const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ totalReviews: 0, pendingApproval: 0, avgRating: "0.0" });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); 
  
  // Controls & Dynamic States
  const [activeTab, setActiveTab] = useState("All"); 
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, reviewId: null });
  
  // Debounce logic instantiation timer ref
  const debounceTimerRef = useRef(null);

  // --- DEBOUNCING MECHANISM ---
  useEffect(() => {
    // Purane timer ko clear karein
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Naya debounced state value set karein 300ms ke timeout ke baad
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Search query change hone par pehle page par reset karein
    }, 300);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchQuery]);

  // --- CORE CONNECTORS (API INTERFACES) ---
  const fetchReviewsData = useCallback(async () => {
    setLoading(true);
    try {
      const statusParam = activeTab === "Approved" ? "true" : activeTab === "Pending" ? "false" : undefined;
      const response = await getAllReviewsAdmin({
        page: currentPage,
        limit: 10,
        search: debouncedSearchQuery || undefined, // API par ab debounced value jayegi
        status: statusParam
      });

      if (response?.success) {
        setReviews(response.reviews || []);
        setTotalPages(response.totalPages || 1);
        setCurrentPage(response.currentPage || 1);
      }
    } catch (err) {
      console.error("Backend review collection engine fail:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchQuery, activeTab]);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const response = await getReviewStats();
      if (response?.success && response.data) {
        setStats({
          totalReviews: response.data.total || 0,
          pendingApproval: response.data.pending || 0,
          avgRating: response.data.averageRating || "0.0",
        });
      }
    } catch (err) {
      console.error("Stats fetching engine error:", err);
    }
  }, []);

  // Sync content dynamically on standard lifecycle hooks
  useEffect(() => {
    fetchReviewsData();
  }, [fetchReviewsData]);

  useEffect(() => {
    fetchDashboardStats();
  }, [reviews, fetchDashboardStats]);

  // --- INTERACTION LOGIC (MUTATIONS) ---
  const handleToggleStatus = async (reviewId) => {
    setActionLoading(reviewId);
    try {
      const res = await toggleReviewStatus(reviewId);
      if (res?.success) {
        setReviews(prev => 
          prev.map(rev => rev._id === reviewId ? { ...rev, isActive: !rev.isActive } : rev)
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const triggerDeletePrompt = (reviewId) => {
    setDeleteModal({ isOpen: true, reviewId });
  };

  const handleExecuteDelete = async () => {
    const targetId = deleteModal.reviewId;
    if (!targetId) return;

    setActionLoading(targetId);
    try {
      const res = await deleteReviewByAdmin(targetId);
      if (res?.success) {
        setReviews(prev => prev.filter(rev => rev._id !== targetId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
      setDeleteModal({ isOpen: false, reviewId: null });
    }
  };

  const statsCards = useMemo(() => [
    { label: "Total Reviews", value: stats.totalReviews },
    { label: "Pending Approval", value: stats.pendingApproval },
    { label: "Avg. Rating", value: `${stats.avgRating} ★` },
  ], [stats]);

  return (
    <div className=" bg-[#F8FAFC] min-h-screen text-slate-600 antialiased font-sans text-sm">
      
      {/* TOP META CONTROLLER HEADERS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Product Reviews</h1>
          <p className="text-base text-slate-500 mt-1.5">Manage, evaluate, and moderate customer satisfaction pipelines.</p>
        </div>
        
        {/* BACKEND DRIVEN STATS */}
        <div className="grid grid-cols-3 gap-4 w-full lg:w-auto">
          {statsCards.map((s, i) => (
            <div key={i} className="p-5 rounded-xl border border-slate-200/60 shadow-sm bg-white min-w-[130px] md:min-w-[170px]">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{s.label}</p>
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* COMPONENT FILTERS */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm mb-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
          {["All", "Pending", "Approved"].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab ? "bg-white text-slate-800 shadow-sm font-semibold" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search database using product titles, names or text..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-lg text-sm transition-all outline-none focus:bg-white focus:border-slate-200 text-slate-700"
          />
        </div>
      </div>

      {/* CORE GRID ARCHITECTURE TABLE */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-24 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="animate-spin text-slate-400" size={36} />
            <p className="text-sm font-medium">Loading feedback feeds...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/60">
                  <th className="p-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="p-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">User Account</th>
                  <th className="p-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Rating & Response</th>
                  <th className="p-4 text-sm font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                  <th className="p-4 text-sm font-semibold text-slate-500 uppercase tracking-wider text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reviews.length > 0 ? reviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-slate-50/40 transition-colors">
                    
                    {/* Item Context */}
                    <td className="p-4 align-top max-w-[260px]">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-400 mt-0.5 shrink-0">
                          <Package size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700 line-clamp-2 leading-snug">
                            {rev.productId?.title || "Unknown Product"}
                          </p>
                          <p className="text-xs text-slate-400 mt-1 font-mono">
                            ID: {rev.productId?._id?.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* User Profile Context */}
                    <td className="p-4 align-top">
                      <div className="text-sm">
                        <p className="font-semibold text-slate-700">{rev.userId?.name || "Anonymous"}</p>
                        <p className="text-slate-500 font-normal mt-0.5">{rev.userId?.email}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-2">
                          <Calendar size={13}/> {new Date(rev.createdAt).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                    </td>

                    {/* Dynamic Stars Rating */}
                    <td className="p-4 align-top max-w-sm">
                      <div className="flex gap-0.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            fill={i < rev.rating ? "#EAB308" : "none"} 
                            stroke={i < rev.rating ? "#EAB308" : "#CBD5E1"} 
                          />
                        ))}
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed font-normal">
                        "{rev.comment}"
                      </p>
                    </td>

                    {/* Dynamic State Checks */}
                    <td className="p-4 align-top text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                        rev.isActive 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {rev.isActive ? <CheckCircle2 size={13}/> : <Clock size={13}/>}
                        {rev.isActive ? 'Approved' : 'Pending'}
                      </span>
                    </td>

                    {/* Actions Panel */}
                    <td className="p-4 align-top text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button 
                          disabled={actionLoading === rev._id}
                          onClick={() => handleToggleStatus(rev._id)}
                          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                            rev.isActive 
                              ? "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200" 
                              : "bg-slate-800 hover:bg-slate-900 text-white"
                          }`}
                        >
                          {actionLoading === rev._id ? (
                            <RefreshCw className="animate-spin" size={13} />
                          ) : rev.isActive ? 'Hide' : 'Approve'}
                        </button>
                        
                        <button 
                          disabled={actionLoading === rev._id}
                          onClick={() => triggerDeletePrompt(rev._id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>

                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="p-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                          <MessageSquare size={36}/>
                        </div>
                        <h4 className="text-base font-semibold text-slate-700">No data found</h4>
                        <p className="text-sm text-slate-400">There are no reviews matching the criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PAGINATION CONTROL LAYOUT */}
      {!loading && reviews.length > 0 && (
        <div className="flex justify-between items-center mt-5 px-2">
          <p className="text-sm text-slate-400 font-medium">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-4 py-2 text-sm font-medium bg-white border border-slate-200 rounded-lg disabled:opacity-40 text-slate-600 enabled:hover:bg-slate-50 transition-colors"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 text-sm font-medium bg-white border border-slate-200 rounded-lg disabled:opacity-40 text-slate-600 enabled:hover:bg-slate-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* DETACHED DELETION ALERT FRAME */}
      <ConfirmationModal 
        isOpen={deleteModal.isOpen}
        title="Confirm Deletion"
        message="Are you completely sure you want to delete this review? This action will remove this user's submission permanently from the application cluster."
        isLoading={actionLoading === deleteModal.reviewId}
        onClose={() => setDeleteModal({ isOpen: false, reviewId: null })}
        onConfirm={handleExecuteDelete}
      />
    </div>
  );
};

const Clock = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

export default Reviews;