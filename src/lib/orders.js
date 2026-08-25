import { api } from "./api.js";

/**
 * Admin: Get all orders with pagination
 */
export const createManualOrder = async (payload) => {
  const response = await api.post("/orders/admin/manual", payload);
  return response.data;
};

export const getAllOrdersAdmin = async (params) => {
  // params example: { page, limit, search, orderStatus, shippingMethod }
  const response = await api.get("/orders/admin/all", { params });
  return response.data; 
};

/**
 * Admin: Get dashboard stats (Total revenue, order counts, etc.)
 */
export const getOrderStatsAdmin = async () => {
  const response = await api.get("/orders/admin/stats");
  return response.data; // { success, data: { totalRevenue, totalOrders, statusCounts: {} } }
};

/**
 * Admin: Update order status (e.g., from 'Processing' to 'Shipped')
 */
export const updateOrderStatusAdmin = async (id, status, note = "", extraData = {}) => {
  const response = await api.patch(`/orders/admin/status/${id}`, { status, note, ...extraData });
  return response.data;
};

export const trackOrderByNumber = async (orderNumber) => {
  const response = await api.get(`/orders/track/${orderNumber}`);
  return response.data;
};

export const trackGuestOrder = async (orderNumber, email) => {
  const response = await api.post(`/orders/track-guest`, { orderNumber, email });
  return response.data;
};

/**
 * Admin: Cancel an order specifically via admin panel
 */
export const cancelOrderAdmin = async (id, reason) => {
  const response = await api.post(`/orders/admin/cancel/${id}`, { reason });
  return response.data; // { success, message, data: { orderId, orderStatus, cancelledBy: 'admin' } }
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const deleteOrder = async (id) => {
  try {
    const response = await api.delete(`/orders/admin/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete order";
  }
};

export const getCancellationRequests = async (params) => {
  const response = await api.get("/orders/admin/cancellation-requests", { params });
  return response.data;
};

export const approveCancellation = async (id) => {
  const response = await api.patch(`/orders/admin/cancellation-requests/${id}/approve`);
  return response.data;
};

export const rejectCancellation = async (id, reason) => {
  const response = await api.patch(`/orders/admin/cancellation-requests/${id}/reject`, { reason });
  return response.data;
};

/**
 * Admin: Create shipment / generate Delhivery AWB
 */
export const createShipmentAdmin = async (orderId, payload) => {
  const response = await api.post(`/orders/admin/${orderId}/create-shipment`, payload);
  return response.data;
};

/**
 * Admin: Get shipping label & packing details
 */
export const getShippingLabelAdmin = async (orderId) => {
  const response = await api.get(`/orders/admin/${orderId}/shipping-label`);
  return response.data;
};

/**
 * Admin: Track live shipment status from Delhivery
 */
export const trackShipmentAdmin = async (orderId) => {
  const response = await api.get(`/orders/admin/${orderId}/track-shipment`);
  return response.data;
};

/**
 * Admin: Cancel shipment with courier
 */
export const cancelShipmentAdmin = async (orderId, reason) => {
  const response = await api.post(`/orders/admin/${orderId}/cancel-shipment`, { reason });
  return response.data;
};