import { api } from "./api";

/**
 * 1. Fetch All Public Reviews (With optional filters/pagination)
 * Route: GET /reviews
 */
export const getReviews = async (params = {}) => {
  try {
    const response = await api.get("/google-reviews", { params });
    return response.data;
  } catch (error) {
    console.error(
      "Error in getReviews API:",
      error.response?.data || error.message,
    );
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch reviews.",
    };
  }
};

/**
 * 2. Create a New Review (Admin Only)
 * Route: POST /reviews
 */
export const createReview = async (reviewData) => {
  try {
    const response = await api.post("/google-reviews", reviewData);
    return response.data;
  } catch (error) {
    console.error(
      "Error in createReview API:",
      error.response?.data || error.message,
    );
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create review.",
    };
  }
};

/**
 * 3. Update an Existing Review by ID (Admin Only)
 * Route: PUT /reviews/:id
 */
export const updateReview = async (id, reviewData) => {
  try {
    const response = await api.put(`/google-reviews/${id}`, reviewData);
    return response.data;
  } catch (error) {
    console.error(
      "Error in updateReview API:",
      error.response?.data || error.message,
    );
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update review.",
    };
  }
};

/**
 * 4. Delete a Review by ID (Admin Only)
 * Route: DELETE /reviews/:id
 */
export const deleteReview = async (id) => {
  try {
    const response = await api.delete(`/google-reviews/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error in deleteReview API:",
      error.response?.data || error.message,
    );
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete review.",
    };
  }
};
