import { api } from "./api.js";
import { toast } from "react-hot-toast";

// --- PUBLIC API (For Home Page) ---
export const getPublicDeals = async () => {
  try {
    const { data } = await api.get("/deals/get-deals");
    return data;
  } catch (error) {
    console.error("Public Deals Fetch Error:", error);
    return null; // Silent failure for public UI
  }
};

// --- ADMIN APIs ---

// 1. Get current settings for Admin Form
export const getAdminDeals = async () => {
  try {
    const { data } = await api.get("/deals/admin/get-deals");
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch admin deals";
    toast.error(message);
    throw new Error(message);
  }
};

// 2. Save or Update Deals Section
export const saveOrUpdateDeals = async (dealsData) => {
  try {
    const { data } = await api.post("/deals/admin/save-deals", dealsData);
    toast.success(data.message || "Deals updated successfully!");
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to save deals";
    toast.error(message);
    throw new Error(message);
  }
};

// 3. Reset/Delete Deals Section
export const deleteDealsSection = async () => {
  try {
    const { data } = await api.delete("/deals/admin/delete-deals");
    toast.success(data.message || "Deals section reset successfully");
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to reset deals";
    toast.error(message);
    throw new Error(message);
  }
};

