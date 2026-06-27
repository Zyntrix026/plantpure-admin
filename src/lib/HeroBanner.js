import { api } from "./api.js";
import { toast } from "react-hot-toast";

// --- PUBLIC FETCHING (For Website/App Home Page) ---

/**
 * Fetch only active banners for the hero section (Sorted by priority)
 */
export const getActiveBanners = async () => {
  try {
    const { data } = await api.get("/banner/active");
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch banners");
  }
};

// --- ADMIN ACTIONS (For Dashboard) ---

/**
 * Get all banners for Admin (Active + Inactive)
 */
export const getAllBannersForAdmin = async () => {
  try {
    const { data } = await api.get("/banner/admin");
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch admin banners");
  }
};

/**
 * Create a new Hero Banner
 */
export const createHeroBanner = async (bannerData) => {
  try {
    const { data } = await api.post("/banner/admin/add", bannerData);
    toast.success("Banner created successfully!");
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to create banner";
    toast.error(message);
    throw new Error(message);
  }
};

/**
 * Update an existing Hero Banner
 */
export const updateHeroBanner = async (id, updateData) => {
  try {
    const { data } = await api.put(`/banner/admin/update/${id}`, updateData);
    toast.success("Banner updated successfully!");
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update banner";
    toast.error(message);
    throw new Error(message);
  }
};

/**
 * Delete a Hero Banner
 */
export const deleteHeroBanner = async (id) => {
  try {
    const { data } = await api.delete(`/banner/admin/delete/${id}`);
    toast.success("Banner deleted successfully");
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to delete banner";
    toast.error(message);
    throw new Error(message);
  }
};

/**
 * Get a single banner by ID for the "Edit" form
 */
export const getBannerById = async (id) => {
  try {
    const { data } = await api.get(`/banner/admin/${id}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch banner details");
  }
};