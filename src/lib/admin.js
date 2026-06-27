import { api } from "./api.js";
import { toast } from "react-hot-toast";

// ─── 1. Get All Admins ────────────────────────────────────────────────────────
export const getAdmins = async ({ search = "", page = 1, limit = 10 } = {}) => {
  try {
    const { data } = await api.get("/users/admin/admins", {
      params: { search, page, limit },
    });
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch admins";
    toast.error(message);
    throw new Error(message);
  }
};

// ─── 2. Create Admin ──────────────────────────────────────────────────────────
export const createAdmin = async (adminData) => {
  try {
    const { data } = await api.post("/users/admin/admins", adminData);
    toast.success(data.message || "Admin created successfully!");
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to create admin";
    toast.error(message);
    throw new Error(message);
  }
};

// ─── 3. Update Admin ──────────────────────────────────────────────────────────
export const updateAdmin = async (id, updateData) => {
  try {
    const { data } = await api.patch(`/users/admin/admins/${id}`, updateData);
    toast.success(data.message || "Admin updated successfully!");
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update admin";
    toast.error(message);
    throw new Error(message);
  }
};

// ─── 4. Delete Admin ──────────────────────────────────────────────────────────
export const deleteAdmin = async (id) => {
  try {
    const { data } = await api.delete(`/users/admin/admins/${id}`);
    toast.success(data.message || "Admin deleted successfully!");
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to delete admin";
    toast.error(message);
    throw new Error(message);
  }
};

// ─── 5. Suspend / Activate Admin ─────────────────────────────────────────────
export const toggleSuspendAdmin = async (id) => {
  try {
    const { data } = await api.patch(`/users/admin/admins/${id}/suspend`);
    toast.success(data.message || "Admin status updated!");
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to update admin status";
    toast.error(message);
    throw new Error(message);
  }
};
