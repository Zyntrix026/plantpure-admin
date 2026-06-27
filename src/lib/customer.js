import { api } from "./api.js";
import { toast } from "react-hot-toast";

/**
 * 1. Get All Customers with Filters and Pagination (Admin Only)
 * Route: GET /user/admin/customers?search=...&page=...&limit=...
 */
export const getAdminCustomers = async ({ search = "", page = 1, limit = 10 } = {}) => {
  try {
    const { data } = await api.get("/users/admin/customers", {
      params: { search, page, limit } // Yeh queries automatic standard formats me inject karega
    });
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch customers list";
    toast.error(message);
    throw new Error(message);
  }
};

/**
 * 2. Suspend / Reactivate Customer
 * Route: PATCH /user/admin/customers/:id/suspend
 */
export const suspendCustomer = async (customerId) => {
  try {
    const { data } = await api.patch(`/users/admin/customers/${customerId}/suspend`);
    toast.success(data.message || "Customer account status updated successfully!");
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to change customer status";
    toast.error(message);
    throw new Error(message);
  }
};

/**
 * 3. Delete Customer Profile
 * Route: DELETE /user/admin/customers/:id
 */
export const deleteCustomer = async (customerId) => {
  try {
    const { data } = await api.delete(`/users/admin/customers/${customerId}`);
    toast.success(data.message || "Customer deleted successfully!");
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to delete customer";
    toast.error(message);
    throw new Error(message);
  }
};