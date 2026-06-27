import { api } from "./api";

export const getDashboardStats = async () => {
  try {
    const { data } = await api.get("/dashboard/stats");
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch dashboard stats");
  }
};