import { api } from "../lib/api"; 

export const getCategoryStats = async () => {
  try {
    const { data } = await api.get("/categories/admin/stats");
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Stats fetch failed");
  }
};

export const getCategories = async (params = {}) => {
  try {
    const { data } = await api.get("/categories", { params });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch categories");
  }
};

export const getCategoriesFormatted = async (params = {}) => {
  try {
    const { data } = await api.get("/categories/getallsub", { params });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch categories");
  }
};

export const addCategory = async (categoryData) => {
  try {
    const { data } = await api.post("/categories/admin/create", categoryData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create");
  }
};

export const updateCategory = async (id, updateData) => {
  try {
    const { data } = await api.patch(`/categories/admin/update/${id}`, updateData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update");
  }
};

export const deleteCategory = async (id) => {
  try {
    const { data } = await api.delete(`/categories/admin/delete/${id}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete");
  }
};