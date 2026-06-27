import React, { useState, useEffect } from "react";
import { 
  getAllCoupons, 
  deleteCoupon, 
  toggleCouponStatus, 
  getCouponAnalytics 
} from "../lib/coupon"; 
import CouponList from "../components/coupon/CouponList";
import CouponModal from "../components/coupon/CouponModal";
import CouponAnalytics from "../components/coupon/CouponAnalytics";
import { Plus } from "lucide-react";

const Coupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Pagination & Filters State
  const [filters, setFilters] = useState({ search: "", status: "", type: "", page: 1, limit: 10 });
  const [totalPages, setTotalPages] = useState(1);

  // Modal Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  // Fetch Coupons and Analytics
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const couponData = await getAllCoupons(filters);
      setCoupons(couponData.data || []);
      setTotalPages(couponData.totalPages || 1);

      const analyticsData = await getCouponAnalytics();
      setAnalytics(analyticsData.data);
    } catch (error) {
      console.error("Dashboard Loading Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [filters]);

  // Actions
  const handleToggleStatus = async (id) => {
    try {
      await toggleCouponStatus(id);
      loadDashboardData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await deleteCoupon(id);
        loadDashboardData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const openCreateModal = () => {
    setSelectedCoupon(null);
    setIsModalOpen(true);
  };

  const openUpdateModal = (coupon) => {
    setSelectedCoupon(coupon);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Coupon Management</h1>
          <p className="text-gray-500">Create, analyze, and manage customer discount coupons</p>
        </div>
        <button
          onClick={openCreateModal}
          style={{ backgroundColor: "var(--color-secondary)" }}
          className="flex items-center gap-2 text-white px-4 py-2.5 rounded-lg font-medium shadow transition-all hover:opacity-95 active:scale-95"
        >
          <Plus size={20} /> Create Coupon
        </button>
      </div>

      {/* Component 1: Analytics Section */}
      <CouponAnalytics analytics={analytics} />

      {/* Filters Form */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search by code..."
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--color-secondary)] w-full sm:w-64"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
        />
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--color-secondary)] bg-white"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--color-secondary)] bg-white"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
        >
          <option value="">All Types</option>
          <option value="percentage">Percentage</option>
          <option value="flat">Flat (₹)</option>
          <option value="free_shipping">Free Shipping</option>
          <option value="product_specific">Product Specific</option>
        </select>
      </div>

      {/* Component 2: List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading coupons...</div>
        ) : (
          <CouponList
            coupons={coupons}
            onToggleStatus={handleToggleStatus}
            onEdit={openUpdateModal}
            onDelete={handleDelete}
            filters={filters}
            setFilters={setFilters}
            totalPages={totalPages}
          />
        )}
      </div>

      {/* Component 3: Form Modal (Create/Edit) */}
      {isModalOpen && (
        <CouponModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          couponData={selectedCoupon}
          refreshData={loadDashboardData}
        />
      )}
    </div>
  );
};

export default Coupon;