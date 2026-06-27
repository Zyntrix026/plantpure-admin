import { api } from "./api.js";
import { toast } from "react-hot-toast";

// ─── 1. Get All Coupons (with search, status, type filter + pagination) ────────
export const getAllCoupons = async ({ search = "", status = "", type = "", page = 1, limit = 10 } = {}) => {
  try {
    const { data } = await api.get("/coupons/admin/all", {
      params: { search, status, type, page, limit },
    });
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch coupons";
    toast.error(message);
    throw new Error(message);
  }
};

// ─── 2. Get Single Coupon by ID ───────────────────────────────────────────────
export const getCouponById = async (id) => {
  try {
    const { data } = await api.get(`/coupons/admin/${id}`);
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch coupon";
    toast.error(message);
    throw new Error(message);
  }
};

// ─── 3. Create Coupon ─────────────────────────────────────────────────────────
export const createCoupon = async (couponData) => {
  try {
    const { data } = await api.post("/coupons/admin/create", couponData);
    toast.success(data.message || "Coupon created successfully!");
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to create coupon";
    toast.error(message);
    throw new Error(message);
  }
};

// ─── 4. Update Coupon ─────────────────────────────────────────────────────────
export const updateCoupon = async (id, updateData) => {
  try {
    const { data } = await api.patch(`/coupons/admin/${id}`, updateData);
    toast.success(data.message || "Coupon updated successfully!");
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update coupon";
    toast.error(message);
    throw new Error(message);
  }
};

// ─── 5. Toggle Coupon Active/Inactive ────────────────────────────────────────
export const toggleCouponStatus = async (id) => {
  try {
    const { data } = await api.patch(`/coupons/admin/${id}/toggle`);
    toast.success(data.message || "Coupon status updated!");
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to toggle coupon status";
    toast.error(message);
    throw new Error(message);
  }
};

// ─── 6. Delete Coupon ─────────────────────────────────────────────────────────
export const deleteCoupon = async (id) => {
  try {
    const { data } = await api.delete(`/coupons/admin/${id}`);
    toast.success(data.message || "Coupon deleted successfully!");
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to delete coupon";
    toast.error(message);
    throw new Error(message);
  }
};

// ─── 7. Get Coupon Usage History ──────────────────────────────────────────────
export const getCouponUsage = async (id, { page = 1, limit = 10 } = {}) => {
  try {
    const { data } = await api.get(`/coupons/admin/${id}/usage`, {
      params: { page, limit },
    });
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch usage history";
    toast.error(message);
    throw new Error(message);
  }
};

// ─── 8. Get Coupon Analytics ──────────────────────────────────────────────────
export const getCouponAnalytics = async () => {
  try {
    const { data } = await api.get("/coupons/admin/analytics");
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch analytics";
    toast.error(message);
    throw new Error(message);
  }
};
