import React, { useState, useEffect } from "react";
import {
  Search,
  Trash2,
  ExternalLink,
  X,
  ShoppingBag,
  DollarSign,
  Ban,
  ShieldCheck,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  getAdminCustomers,
  suspendCustomer,
  deleteCustomer,
} from "../lib/customer";
import ConfirmationModal from "../components/ConfirmationModal";

const Customers = () => {
  // --- STATE MANAGEMENT ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const limit = 10;

  // --- MODAL STATE FOR REUSE ---
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "", // "delete" ya "status"
    userId: null,
    isActiveCurrent: true, // target user ka current status
    actionLoading: false,
  });

  // --- 1. SEARCH DEBOUNCE EFFECT ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // --- 2. FETCH CUSTOMERS FROM API ---
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await getAdminCustomers({
        search: debouncedSearch,
        page: currentPage,
        limit,
      });

      if (response?.success) {
        setUsers(response.data || []);
        setTotalPages(response.totalPages || 1);
        setTotalCustomers(response.total || 0);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [debouncedSearch, currentPage]);

  // --- 3. PREVENT BACKGROUND SCROLL ---
  useEffect(() => {
    if (selectedUser || modalConfig.isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [selectedUser, modalConfig.isOpen]);

  // --- OPEN MODAL HANDLERS ---
  const triggerStatusModal = (userId, isActive) => {
    setModalConfig({
      isOpen: true,
      type: "status",
      userId,
      isActiveCurrent: isActive,
      actionLoading: false,
    });
  };

  const triggerDeleteModal = (userId) => {
    setModalConfig({
      isOpen: true,
      type: "delete",
      userId,
      isActiveCurrent: true,
      actionLoading: false,
    });
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // --- 4. TOGGLE SUSPEND / ACTIVE STATUS ---
  const handleToggleStatus = async () => {
    const { userId } = modalConfig;
    setModalConfig((prev) => ({ ...prev, actionLoading: true }));
    try {
      const response = await suspendCustomer(userId);
      if (response?.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, isActive: !u.isActive } : u,
          ),
        );

        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser((prev) => ({ ...prev, isActive: !prev.isActive }));
        }
        closeModal();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModalConfig((prev) => ({ ...prev, actionLoading: false }));
    }
  };

  // --- 5. DELETE CUSTOMER PROFILE ---
  const handleDeleteCustomer = async () => {
    const { userId } = modalConfig;
    setModalConfig((prev) => ({ ...prev, actionLoading: true }));
    try {
      const response = await deleteCustomer(userId);
      if (response?.success) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        setSelectedUser(null);
        setTotalCustomers((prev) => prev - 1);
        closeModal();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModalConfig((prev) => ({ ...prev, actionLoading: false }));
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans antialiased text-slate-800 ">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Customers
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage user profiles and track purchase behavior analytics (
            {totalCustomers} total).
          </p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200/60 mb-6 flex items-center focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
        <Search className="ml-3 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search by name, email or phone number..."
          className="w-full px-3 py-2 bg-transparent border-0 outline-none text-sm text-slate-800 placeholder-slate-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {loading && (
          <Loader2 className="animate-spin text-blue-500 mr-3" size={18} />
        )}
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/60">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center w-16">
                  #
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                  Orders
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                  Total Spent
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="p-8 text-center text-sm text-slate-400 font-medium"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2 py-4">
                        <Loader2
                          className="animate-spin text-blue-500"
                          size={20}
                        />
                        <span>Loading customer repository...</span>
                      </div>
                    ) : (
                      "No matching customers discovered."
                    )}
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr
                    key={user._id}
                    className="group hover:bg-slate-50/70 transition-all cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="p-4 text-center text-xs font-semibold text-slate-400">
                      {(currentPage - 1) * limit + idx + 1}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user.avatar ||
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          }
                          alt={user.name}
                          className={`w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-100 ${!user.isActive ? "grayscale opacity-60" : ""}`}
                        />
                        <div>
                          <span
                            className={`text-sm font-semibold block ${!user.isActive ? "text-slate-400 line-through" : "text-slate-900"}`}
                          >
                            {user.name}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {user._id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600 font-medium">
                      {user.email}
                    </td>
                    <td className="p-4 text-sm text-slate-500 font-mono">
                      {user.phone || "N/A"}
                    </td>
                    <td className="p-4 text-center text-sm text-slate-600 font-semibold">
                      {user.totalOrders}
                    </td>
                    <td className="p-4 text-center text-sm font-semibold text-slate-900">
                      ₹{user.totalSpent ? user.totalSpent.toFixed(2) : "0.00"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${
                          user.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.isActive ? "bg-emerald-500" : "bg-rose-500"}`}
                        ></span>
                        {user.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td
                      className="p-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all"
                        >
                          <ExternalLink size={16} />
                        </button>
                        <button
                          onClick={() => triggerDeleteModal(user._id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- FRONTEND PAGINATION FOOTER CONTROLS --- */}
        {totalPages > 1 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Page <strong>{currentPage}</strong> of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || loading}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- USER DETAILS DRAWER --- */}
      {selectedUser && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 transition-opacity"
            onClick={() => setSelectedUser(null)}
          ></div>

          {/* Side Drawer Body */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col border-l border-slate-100 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-800">
                <UserCheck size={18} className="text-blue-600" />
                <h2 className="text-base font-bold tracking-tight">
                  Overview Profile
                </h2>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Profile Card Summary Header */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <img
                  src={
                    selectedUser.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt={selectedUser.name}
                  className={`w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm ${!selectedUser.isActive ? "grayscale" : ""}`}
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {selectedUser.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Joined{" "}
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-slate-200/70 text-slate-600 font-mono rounded text-[10px] font-bold tracking-wide">
                      {selectedUser._id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        selectedUser.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {selectedUser.isActive ? "Active Member" : "Restricted"}
                    </span>
                  </div>
                </div>
              </div>

              {/* METRICS CARDS */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Activity Metrics
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {/* Amount Metric Box */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-500">
                        Total Spent
                      </span>
                      <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                        <DollarSign size={14} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 tracking-tight">
                      ₹
                      {selectedUser.totalSpent
                        ? selectedUser.totalSpent.toFixed(2)
                        : "0.00"}
                    </p>
                  </div>

                  {/* Total Orders Box */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-500">
                        Total Orders
                      </span>
                      <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                        <ShoppingBag size={14} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 tracking-tight">
                      {selectedUser.totalOrders}
                    </p>
                  </div>
                </div>
              </div>

              {/* Structural Meta Details */}
              <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Primary Email:</span>
                  <span className="font-medium text-slate-700">
                    {selectedUser.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mobile Extension:</span>
                  <span className="font-mono font-medium text-slate-700">
                    {selectedUser.phone || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons Footer Controls */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 space-y-2.5">
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    triggerStatusModal(selectedUser._id, selectedUser.isActive)
                  }
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border ${
                    selectedUser.isActive
                      ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  }`}
                >
                  {selectedUser.isActive ? (
                    <>
                      <Ban size={14} /> Suspend Access
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={14} /> Unlock Account
                    </>
                  )}
                </button>

                <button
                  onClick={() => triggerDeleteModal(selectedUser._id)}
                  className="py-2.5 px-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold hover:bg-rose-100 border border-rose-200 transition-all flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* --- REUSABLE DYNAMIC MODAL INTEGRATION --- */}
      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={
          modalConfig.type === "delete"
            ? handleDeleteCustomer
            : handleToggleStatus
        }
        loading={modalConfig.actionLoading}
        title={
          modalConfig.type === "delete"
            ? "Confirm Delete"
            : modalConfig.isActiveCurrent
              ? "Suspend Account"
              : "Activate Account"
        }
        description={
          modalConfig.type === "delete"
            ? "Are you sure you want to permanently delete this customer profile? This action cannot be undone."
            : modalConfig.isActiveCurrent
              ? "Are you sure you want to suspend this customer? They won't be able to log in or place orders."
              : "Are you sure you want to reactivate this customer account?"
        }
        confirmText={
          modalConfig.type === "delete"
            ? "Yes, Delete"
            : modalConfig.isActiveCurrent
              ? "Yes, Suspend"
              : "Yes, Activate"
        }
        variant={
          modalConfig.type === "delete"
            ? "danger"
            : modalConfig.isActiveCurrent
              ? "warning"
              : "success"
        }
      />
    </div>
  );
};

export default Customers;
