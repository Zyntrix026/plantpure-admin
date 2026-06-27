import React, { useState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { getAdmins, deleteAdmin, toggleSuspendAdmin } from "../lib/admin";
import AdminTable from "../components/admin/AdminTable";
import AdminModal from "../components/admin/AdminModal";
import ConfirmationModal from "../components/ConfirmationModal";

const Admin = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters — searchInput is live input, filters.search is debounced
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({ search: "", page: 1, limit: 10 });

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // ConfirmationModal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null, // "delete" | "suspend"
    admin: null,
    loading: false,
  });

  // Debounce search — 400ms
  const debounceRef = useRef(null);
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: val, page: 1 }));
    }, 400);
  };

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const res = await getAdmins(filters);
      setAdmins(res.data || []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, [filters]);

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDeleteClick = (admin) => {
    setConfirmModal({ isOpen: true, type: "delete", admin, loading: false });
  };

  const handleDeleteConfirm = async () => {
    setConfirmModal((prev) => ({ ...prev, loading: true }));
    try {
      await deleteAdmin(confirmModal.admin._id);
      loadAdmins();
      setConfirmModal({ isOpen: false, type: null, admin: null, loading: false });
    } catch (error) {
      console.error(error);
      setConfirmModal((prev) => ({ ...prev, loading: false }));
    }
  };

  // ── Suspend / Activate ──────────────────────────────────────────────────────
  const handleSuspendClick = (admin) => {
    setConfirmModal({ isOpen: true, type: "suspend", admin, loading: false });
  };

  const handleSuspendConfirm = async () => {
    setConfirmModal((prev) => ({ ...prev, loading: true }));
    try {
      await toggleSuspendAdmin(confirmModal.admin._id);
      loadAdmins();
      setConfirmModal({ isOpen: false, type: null, admin: null, loading: false });
    } catch (error) {
      console.error(error);
      setConfirmModal((prev) => ({ ...prev, loading: false }));
    }
  };

  // ── Form Modal ──────────────────────────────────────────────────────────────
  const openCreateModal = () => {
    setSelectedAdmin(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setIsFormModalOpen(true);
  };

  // ── Confirm modal dynamic config ────────────────────────────────────────────
  const getConfirmConfig = () => {
    const { type, admin } = confirmModal;
    if (type === "delete") {
      return {
        title: "Delete Admin",
        description: `Are you sure you want to permanently delete "${admin?.name}"? This action cannot be undone.`,
        confirmText: "Delete",
        variant: "danger",
        onConfirm: handleDeleteConfirm,
      };
    }
    const isSuspending = admin?.isActive;
    return {
      title: isSuspending ? "Suspend Admin" : "Activate Admin",
      description: isSuspending
        ? `Are you sure you want to suspend "${admin?.name}"? They will lose access immediately.`
        : `Are you sure you want to reactivate "${admin?.name}"?`,
      confirmText: isSuspending ? "Suspend" : "Activate",
      variant: isSuspending ? "warning" : "success",
      onConfirm: handleSuspendConfirm,
    };
  };

  const confirmConfig = getConfirmConfig();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Management</h1>
          <p className="text-gray-500">Create and manage admin accounts — {total} total admins</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium shadow transition-colors"
        >
          <Plus size={20} /> Create Admin
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72"
          value={searchInput}
          onChange={handleSearchChange}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading admins...</div>
        ) : (
          <AdminTable
            admins={admins}
            filters={filters}
            setFilters={setFilters}
            totalPages={totalPages}
            onEdit={openEditModal}
            onDelete={handleDeleteClick}
            onToggleSuspend={handleSuspendClick}
          />
        )}
      </div>

      {/* Create / Edit Modal */}
      <AdminModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        adminData={selectedAdmin}
        refreshData={loadAdmins}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null, admin: null, loading: false })}
        onConfirm={confirmConfig.onConfirm}
        loading={confirmModal.loading}
        title={confirmConfig.title}
        description={confirmConfig.description}
        confirmText={confirmConfig.confirmText}
        variant={confirmConfig.variant}
      />
    </div>
  );
};

export default Admin;
