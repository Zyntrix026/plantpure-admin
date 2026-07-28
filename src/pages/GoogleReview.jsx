import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Star, Search, Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight, AlertCircle, CheckCircle, AlertTriangle 
} from "lucide-react";

// Import API functions
import { getReviews, createReview, updateReview, deleteReview } from "../lib/googleReview.js";

const ITEMS_PER_PAGE = 8;

const GoogleReview = () => {
  // Main Data States
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // Custom Delete Modal State
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State & Validation
  const [formData, setFormData] = useState({ name: "", rating: 5, comment: "", image: "" });
  const [formErrors, setFormErrors] = useState({});

  // Flash Feedback Notification Helper
  const showFeedback = (msg, isError = false) => {
    if (isError) {
      setApiError(msg);
      setTimeout(() => setApiError(""), 5000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  };

  // Helper function to normalize review object properties dynamically
  const normalizeReview = (review) => {
    if (!review || typeof review !== "object") return null;

    const name = review.name || review.userName || review.customerName || review.author || "Anonymous";
    const rating = Number(review.rating ?? review.stars ?? review.score ?? 5);
    const comment = review.comment || review.review || review.message || review.text || review.feedback || "";
    const image = review.image || review.avatar || review.photo || review.profilePic || review.userImage || "";
    const date = review.date || review.createdAt || review.updatedAt || review.timestamp || "";
    const id = review._id || review.id || review.reviewId || Math.random().toString();

    return {
      ...review,
      _id: id,
      id: id,
      name,
      rating,
      comment,
      image,
      date,
    };
  };

  // 1. Fetch Reviews from Backend API
  const fetchReviewsData = useCallback(async () => {
    setIsLoading(true);
    setApiError("");
    try {
      const response = await getReviews();
      let rawData = [];

      if (Array.isArray(response)) {
        rawData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        rawData = response.data;
      } else if (response?.reviews && Array.isArray(response.reviews)) {
        rawData = response.reviews;
      } else if (response?.result && Array.isArray(response.result)) {
        rawData = response.result;
      } else if (response?.success === false) {
        showFeedback(response.message || "Failed to fetch reviews", true);
      }

      const cleanedReviews = rawData.map(normalizeReview).filter(Boolean);
      setReviews(cleanedReviews);
    } catch (err) {
      showFeedback("Failed to load reviews from server.", true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviewsData();
  }, [fetchReviewsData]);

  // Flexible URL Validation
  const isValidImageUrl = (url) => {
    if (!url) return true;
    const cleanUrl = url.trim();
    if (!cleanUrl) return true;

    if (cleanUrl.startsWith("data:image/")) return true;

    try {
      const parsed = new URL(cleanUrl);
      return ["http:", "https:"].includes(parsed.protocol);
    } catch (_) {
      return false;
    }
  };

  // Frontend Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Customer name is required.";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }

    if (!formData.comment.trim()) {
      errors.comment = "Review comment is required.";
    } else if (formData.comment.trim().length < 5) {
      errors.comment = "Comment must be at least 5 characters.";
    }

    if (formData.image.trim() && !isValidImageUrl(formData.image)) {
      errors.image = "Please enter a valid URL (e.g., https://example.com/image).";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open Modal for Add
  const handleOpenAdd = () => {
    setEditingReview(null);
    setFormData({ name: "", rating: 5, comment: "", image: "" });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (review) => {
    const normalized = normalizeReview(review);
    setEditingReview(normalized);
    setFormData({
      name: normalized.name || "",
      rating: normalized.rating || 5,
      comment: normalized.comment || "",
      image: normalized.image || "",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // 2. Custom Delete Trigger & Confirm
  const promptDelete = (id) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);

    try {
      const res = await deleteReview(deleteTargetId);
      if (res?.success === false) {
        showFeedback(res.message || "Failed to delete review", true);
      } else {
        setReviews((prev) => prev.filter((r) => r.id !== deleteTargetId && r._id !== deleteTargetId));
        showFeedback("Review deleted successfully!");
      }
    } catch (error) {
      showFeedback("Something went wrong while deleting.", true);
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  // 3. Submit Handler (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const payload = {
      name: formData.name.trim(),
      rating: Number(formData.rating),
      comment: formData.comment.trim(),
      image: formData.image.trim() || null,
    };

    try {
      if (editingReview) {
        const targetId = editingReview.id || editingReview._id;
        const res = await updateReview(targetId, payload);

        if (res?.success === false) {
          showFeedback(res.message || "Failed to update review", true);
        } else {
          const rawUpdated = res.data || { ...editingReview, ...payload };
          const updatedItem = normalizeReview(rawUpdated);

          setReviews((prev) =>
            prev.map((r) => ((r.id || r._id) === targetId ? updatedItem : r))
          );
          showFeedback("Review updated successfully!");
          setIsModalOpen(false);
        }
      } else {
        const res = await createReview(payload);

        if (res?.success === false) {
          showFeedback(res.message || "Failed to create review", true);
        } else {
          const rawNew = res.data || {
            ...payload,
            id: res.id || res._id || Date.now(),
            date: new Date().toISOString(),
          };
          const newItem = normalizeReview(rawNew);

          setReviews((prev) => [newItem, ...prev]);
          showFeedback("Review added successfully!");
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      showFeedback("An unexpected error occurred. Please try again.", true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Search Filtering
  const filteredReviews = useMemo(() => {
    if (!searchTerm.trim()) return reviews;
    const term = searchTerm.toLowerCase().trim();

    return reviews.filter(
      (r) =>
        (r.name && r.name.toLowerCase().includes(term)) ||
        (r.comment && r.comment.toLowerCase().includes(term)) ||
        (r.rating && r.rating.toString() === term)
    );
  }, [reviews, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE) || 1;
  const currentReviews = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReviews.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredReviews, currentPage]);

  const getInitial = (name) => (name ? name.trim().charAt(0).toUpperCase() : "?");

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const parsedDate = new Date(dateStr);
      return isNaN(parsedDate.getTime()) ? "N/A" : parsedDate.toLocaleDateString();
    } catch (_) {
      return "N/A";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans ">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Global Notifications */}
        {apiError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-3 shadow-sm animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
            <span>{apiError}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm flex items-center gap-3 shadow-sm animate-in fade-in">
            <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Review Management</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Manage and moderate customer reviews. Total ({reviews.length})
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add New Review
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, comment, or exact rating..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-800"
            />
          </div>
        </div>

        {/* Reviews Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Comment</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  // --- SKELETON LOADING ROWS ---
                  [...Array(5)].map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200" />
                          <div className="h-4 w-28 bg-slate-200 rounded" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-4 h-4 rounded bg-slate-200" />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-48 bg-slate-200 rounded mb-1" />
                        <div className="h-3 w-32 bg-slate-100 rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-20 bg-slate-200 rounded" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <div className="w-8 h-8 bg-slate-200 rounded-lg" />
                          <div className="w-8 h-8 bg-slate-200 rounded-lg" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : currentReviews.length > 0 ? (
                  currentReviews.map((review) => {
                    const reviewId = review.id || review._id;
                    return (
                      <tr key={reviewId} className="hover:bg-slate-50/80 transition">
                        
                        {/* Customer Avatar & Name */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {review.image ? (
                              <img
                                src={review.image}
                                alt={review.name}
                                className="w-10 h-10 rounded-full object-cover border border-slate-200"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center">
                                {getInitial(review.name)}
                              </div>
                            )}
                            <span className="font-semibold text-slate-900">{review.name}</span>
                          </div>
                        </td>

                        {/* Star Rating */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? "fill-amber-400" : "fill-slate-100 text-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                        </td>

                        {/* Comment */}
                        <td className="px-6 py-4 max-w-xs md:max-w-md truncate text-slate-700">
                          {review.comment ? `"${review.comment}"` : <span className="text-slate-400 italic">No comment provided</span>}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs">
                          {formatDate(review.date)}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(review)}
                              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => promptDelete(reviewId)}
                              className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-slate-400">
                      No reviews found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
              <span className="text-xs text-slate-500">
                Page {currentPage} of {totalPages}
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- ADD / EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {editingReview ? "Edit Review" : "Add New Review"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, name: e.target.value }));
                    if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: null }));
                  }}
                  className={`w-full px-3.5 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                    formErrors.name
                      ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500"
                      : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                  }`}
                />
                {formErrors.name && (
                  <p className="text-xs text-rose-500 mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                      className="p-1 hover:scale-110 transition focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formData.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-100 text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-slate-500 font-medium ml-2">
                    ({formData.rating} Stars)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Customer Review Comment *
                </label>
                <textarea
                  rows="3"
                  placeholder="Write customer review..."
                  value={formData.comment}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, comment: e.target.value }));
                    if (formErrors.comment) setFormErrors((prev) => ({ ...prev, comment: null }));
                  }}
                  className={`w-full px-3.5 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                    formErrors.comment
                      ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500"
                      : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                  }`}
                ></textarea>
                {formErrors.comment && (
                  <p className="text-xs text-rose-500 mt-1">{formErrors.comment}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Customer Image URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Paste any valid image link..."
                  value={formData.image}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => ({ ...prev, image: value }));
                    if (formErrors.image) setFormErrors((prev) => ({ ...prev, image: null }));
                  }}
                  className={`w-full px-3.5 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                    formErrors.image
                      ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500"
                      : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                  }`}
                />
                {formErrors.image ? (
                  <p className="text-xs text-rose-500 mt-1">{formErrors.image}</p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Accepts any web image link. If left blank, an avatar initial will be used.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingReview ? "Save Changes" : "Create Review"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* --- CUSTOM DELETE CONFIRMATION MODAL --- */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4 text-center">
            
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Confirm Review Deletion</h3>
              <p className="text-sm text-slate-500 mt-1">
                Are you sure you want to delete this review? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition w-1/2 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-sm w-1/2 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Review"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default GoogleReview;