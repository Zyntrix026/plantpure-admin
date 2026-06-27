import React, { useEffect, useState } from "react";
import { getAllBannersForAdmin, deleteHeroBanner } from "../lib/HeroBanner"; 
import DeleteModal from "../components/Category/DeleteModal"; 
import HeroBannerForm from "../components/hero banner/HeroBannerForm"; // Naya form component
import { toast } from "react-hot-toast";
import { Plus, Edit2, Trash2, Image as ImageIcon, LayoutDashboard } from "lucide-react";

const HeroBanner = () => {
  // --- States ---
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal/Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null); // Edit aur Delete dono ke liye
  const [deleteLoading, setDeleteLoading] = useState(false);

  // --- 1. Fetch Banners ---
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await getAllBannersForAdmin();
      if (data.success) {
        setBanners(data.banners);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // --- 2. Action Handlers ---

  // Create Button Click
  const handleAddNew = () => {
    setSelectedBanner(null); // Ensure form is empty
    setIsFormOpen(true);
  };

  // Edit Button Click
  const handleEdit = (banner) => {
    setSelectedBanner(banner); // Pass existing data to form
    setIsFormOpen(true);
  };

  // Delete Icon Click
  const openDeleteModal = (banner) => {
    setSelectedBanner(banner);
    setIsDeleteModalOpen(true);
  };

  // Final Delete Confirmation
  const confirmDelete = async () => {
    if (!selectedBanner?._id) return;
    
    try {
      setDeleteLoading(true);
      const response = await deleteHeroBanner(selectedBanner._id);
      
      if (response.success) {
        setBanners((prev) => prev.filter((b) => b._id !== selectedBanner._id));
        setIsDeleteModalOpen(false);
        setSelectedBanner(null);
      }
    } catch (error) {
      console.error("Delete Error:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className=" bg-slate-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <LayoutDashboard size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Hero Banners</h1>
            <p className="text-slate-500 text-sm font-medium">Configure homepage promotions and sliders</p>
          </div>
        </div>
        
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 font-bold text-sm"
        >
          <Plus size={20} /> Create New Banner
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="p-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Preview</th>
                <th className="p-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Banner Content</th>
                <th className="p-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Linked Category</th>
                <th className="p-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Priority</th>
                <th className="p-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Visibility</th>
                <th className="p-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                       <p className="text-slate-400 font-medium animate-pulse">Syncing data...</p>
                    </div>
                  </td>
                </tr>
              ) : banners.length > 0 ? (
                banners.map((banner) => (
                  <tr key={banner._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-5">
                      <div className="relative w-32 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group-hover:shadow-md transition-shadow">
                        {banner.bannerImage ? (
                          <img src={banner.bannerImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon size={24} /></div>
                        )}
                      </div>
                    </td>
                    <td className="p-5">
                      <h4 className="font-bold text-slate-800 text-[15px]">{banner.title || "Untitled"}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-1 font-medium">{banner.subtitle}</p>
                    </td>
                    <td className="p-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                        {banner.category?.name || "Global"}
                      </span>
                    </td>
                    <td className="p-5 text-center font-mono font-black text-slate-600">
                      {banner.priority}
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                        banner.status === "Active" 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                        : "bg-rose-50 text-rose-500 border-rose-100"
                      }`}>
                        {banner.status}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2  transition-opacity">
                        <button 
                          onClick={() => handleEdit(banner)}
                          className="p-2.5 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(banner)}
                          className="p-2.5 text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                         <ImageIcon size={40} />
                      </div>
                      <p className="text-slate-400 font-bold">No banners available to display</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Modals Section --- */}

      {/* Add/Update Form Modal */}
      <HeroBannerForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        fetchBanners={fetchBanners} 
        editData={selectedBanner} 
      />

      {/* Common Delete Modal */}
      <DeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedBanner(null);
        }} 
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
};

export default HeroBanner;