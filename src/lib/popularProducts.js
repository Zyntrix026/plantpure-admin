import { api } from "./api.js";
import { toast } from "react-hot-toast";

// --- PUBLIC API (For Home Page) ---
// Frontend par popular products dikhane ke liye
export const getPublicPopularProducts = async () => {
  try {
    const { data } = await api.get("/popular/get-popular-products");
    return data;
  } catch (error) {
    console.error("Public Popular Products Fetch Error:", error);
    return null; // Frontend UI par error na dikhe, bas data na aaye
  }
};

// --- ADMIN APIs (Dashboard Settings) ---

// 1. Get current settings for Admin Form (To pre-fill the edit form)
export const getAdminPopularProducts = async () => {
  try {
    const { data } = await api.get("/popular/admin/get-popular");
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch popular products settings";
    toast.error(message);
    throw new Error(message);
  }
};

// 2. Save or Update Popular Products Section
export const saveOrUpdatePopularProducts = async (popularData) => {
  try {
    const { data } = await api.post("/popular/admin/save-popular", popularData);
    // Success message controller se aayega
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to save popular products";
    toast.error(message);
    throw new Error(message);
  }
};

// 3. Reset/Delete Popular Products Section
export const deletePopularSection = async () => {
  try {
    const { data } = await api.delete("/popular/admin/delete-popular");
    toast.success(data.message || "Popular products section reset successfully");
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to reset popular products";
    toast.error(message);
    throw new Error(message);
  }
};