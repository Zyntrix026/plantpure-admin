import { api } from "./api";

/**
 * 1. Fetch All Reviews for Admin (With Pagination, Search, and Filters)
 * Route: GET /reviews/admin/all
 */
export const getAllReviewsAdmin = async (params = {}) => {
  try {
    // Expected params: { page, limit, search, rating, status }
    const response = await api.get('/reviews/admin/all', { params });
    return response.data;
  } catch (error) {
    console.error("Error in getAllReviewsAdmin API:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch reviews."
    };
  }
};

/**
 * 2. Get Review Analytics / Stats for Dashboard
 * Route: GET /reviews/admin/stats
 */
export const getReviewStats = async () => {
  try {
    const response = await api.get('/reviews/admin/stats');
    return response.data;
  } catch (error) {
    console.error("Error in getReviewStats API:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch review statistics."
    };
  }
};

/**
 * 3. Toggle Review Status (Approve / Reject / Hide)
 * Route: PATCH /reviews/admin/toggle/:reviewId
 */
export const toggleReviewStatus = async (reviewId) => {
  try {
    // Agar aapko body mein koi specific status bhejna ho, 
    // to aap use string ke roop mein pass kar sakte hain, filhal yeh simple toggle hai.
    const response = await api.patch(`/reviews/admin/toggle/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error("Error in toggleReviewStatus API:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to change review status."
    };
  }
};

/**
 * 4. Permanently Delete Review by Admin
 * Route: DELETE /reviews/admin/delete/:reviewId
 */
export const deleteReviewByAdmin = async (reviewId) => {
  try {
    const response = await api.delete(`/reviews/admin/delete/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error("Error in deleteReviewByAdmin API:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete review."
    };
  }
};