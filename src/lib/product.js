import { api } from "./api.js"; 
import { toast } from "react-hot-toast"; 

// --- PUBLIC FETCHING ---

/**
 * Uploads an image to the server
 * @param {File} imageFile - The file object from the input
 * @param {string} folder - The destination folder path
 */
export const uploadImage = async (
  imageFile,
  folder = "products/images"
) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("folder", folder);

    const { data } = await api.post("/image/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success(data.message || "Image uploaded successfully");

    // Return the specific image details
    return {
      url: data.image.url,
      fileId: data.image.fileId,
      name: data.image.name,
      size: data.image.size,
    };
  } catch (error) {
    console.error("Image upload error:", error.response || error);
    const message = error.response?.data?.message || "Image upload failed";
    toast.error(message);
    throw new Error(message);
  }
};

/**
 * Get all products (supports pagination, filters, and search via params)
 */
export const getProducts = async (params = {}) => {
  try {
    const { data } = await api.get("/products", { params });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch products");
  }
};

/**
 * Get single product by Slug (for Product Details page)
 */
export const getProductBySlug = async (slug) => {
  try {
    const { data } = await api.get(`/products/details/${slug}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Product not found");
  }
};

// --- ADMIN ACTIONS ---

/**
 * Create a new product (Used in AddProduct.jsx)
 */
export const createProduct = async (productData) => {
  try {
    const { data } = await api.post("/products/admin/create", productData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create product");
  }
};

/**
 * Update an existing product
 */
export const updateProduct = async (id, updateData) => {
  try {
    const { data } = await api.patch(`/products/admin/update/${id}`, updateData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update product");
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (id) => {
  try {
    const { data } = await api.delete(`/products/admin/delete/${id}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete product");
  }
};

/**
 * Quickly toggle Active/Draft status
 */
export const toggleProductStatus = async (id) => {
  try {
    const { data } = await api.patch(`/products/admin/toggle-status/${id}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Status toggle failed");
  }
};

/**
 * Fetch a single product by ID for the "Edit Product" form
 */
export const getProductById = async (id) => {
  try {
    const { data } = await api.get(`/products/admin/${id}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch product data");
  }
};

/**
 * Get all products for selection (e.g., in a dropdown or bulk actions) (supports pagination)
 */
export const getProductsForSelection = async (params = {}) => {
  try {
    const { data } = await api.get("/products/admin/products-selection", { params });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch products");
  }
};

/**
 * Export products within a specific min/max range in CSV or Excel format
 */
export const exportProductsData = async (params = {}) => {
  try {
    const { data } = await api.get("/products/admin/export/products", {
      params,
      responseType: "blob", // CRITICAL: File download/stream handle karne ke liye
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to export products");
  }
};