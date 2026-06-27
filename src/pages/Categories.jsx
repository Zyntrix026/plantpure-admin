import React, { useState, useEffect } from "react";
import { Plus, RefreshCw } from "lucide-react";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
} from "../lib/categories";
import StatsOverview from "../components/Category/StatsOverview";
import CategoryTable from "../components/Category/CategoryTable";
import CategoryModal from "../components/Category/CategoryModel";
import DeleteModal from "../components/Category/DeleteModal";
import CategoryTableSkeleton from "../components/Category/CategoryTableSkeleton";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Categories = () => {
  const [categories, setCategories] = useState([]); // Nested Tree
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    isEdit: false,
    data: null,
  });
  const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, id: null });

  const loadData = async () => {
    try {
      setLoading(true);
      const [catRes, statsRes] = await Promise.all([
        getCategories(),
        getCategoryStats(),
      ]);
      if (catRes.success) setCategories(catRes.categoryList);
      if (statsRes.success) setStats(statsRes.stats);
    } catch (err) {
      toast.error(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (formData) => {
    try {
      if (modalConfig.isEdit) {
        await updateCategory(modalConfig.data._id, formData);
        toast.success("Category updated!");
      } else {
        await addCategory(formData);
        toast.success("Category created!");
      }
      loadData();
      setModalConfig({ isOpen: false, isEdit: false, data: null });
    } catch (err) {
      toast.error(err.message || "Operation failed");
    }
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteCategory(deleteConfig.id);
      toast.success("Category deleted successfully!");
      loadData();
      setDeleteConfig({ isOpen: false, id: null });
    } catch (err) {
      toast.error(err.message || "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={true} />
      <div className="bg-[#f8fafc] min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Store Categories</h1>
              <p className="text-slate-500 text-sm font-medium">Manage your product hierarchy and status.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={loadData} 
                className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 shadow-sm transition-all group"
              >
                <RefreshCw 
                  size={18} 
                  style={{ color: loading ? "var(--color-primary)" : "inherit" }} 
                  className={loading ? "animate-spin" : "group-hover:text-[var(--color-primary)]"} 
                />
              </button>
              <button
                onClick={() => setModalConfig({ isOpen: true, isEdit: false, data: null })}
                style={{ backgroundColor: "var(--color-secondary)" }}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-100 hover:opacity-90 active:scale-95 transition-all"
              >
                <Plus size={18} /> Add Category
              </button>
            </div>
          </div>

          <StatsOverview stats={stats} loading={loading} />

          <div className="mt-8">
            {loading ? (
              <CategoryTableSkeleton />
            ) : (
              <CategoryTable
                data={categories}
                onEdit={(cat) => setModalConfig({ isOpen: true, isEdit: true, data: cat })}
                onDelete={(id) => setDeleteConfig({ isOpen: true, id })}
              />
            )}
          </div>

          {modalConfig.isOpen && (
            <CategoryModal
              config={modalConfig}
              categories={categories} // Passing nested list
              onClose={() => setModalConfig({ isOpen: false, isEdit: false, data: null })}
              onSave={handleSave}
            />
          )}

          <DeleteModal
            isOpen={deleteConfig.isOpen}
            loading={deleteLoading}
            onClose={() => setDeleteConfig({ isOpen: false, id: null })}
            onConfirm={confirmDelete}
          />
        </div>
      </div>
    </>
  );
};

export default Categories;