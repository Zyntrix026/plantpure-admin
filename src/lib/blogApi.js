import { api } from "./api.js";
import { toast } from "react-toastify";

/* =======================
    Blog API Functions
======================= */

// 1. Upload Feature/Thumbnail Image
export const uploadImage = async (imageFile, folder = "blogs/thumbnails") => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("folder", folder);

    const { data } = await api.post("/image/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

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

// 2. Upload Rich Text Editor Content Image
export const uploadContentImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("file", imageFile);

    const { data } = await api.post("/images/upload-content", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data.url;
  } catch (error) {
    console.error("Content image upload error:", error.response || error);
    const message = error.response?.data?.message || "Content image upload failed";
    toast.error(message);
    throw new Error(message);
  }
};

// 3. Create a New Blog
export const createBlog = async (blogData) => {
  try {
    const { data } = await api.post("/blogs", blogData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error) {
    console.error("Create blog API error:", error.response || error);
    const message = error.response?.data?.message || "Failed to create blog";
    toast.error(message);
    throw new Error(message);
  }
};

// 4. Update an Existing Blog
export const updateBlog = async (id, blogData) => {
  try {
    const { data } = await api.put(`/blogs/${id}`, blogData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update blog";
    toast.error(message);
    throw new Error(message);
  }
};

// 5. Delete a Blog
export const deleteBlog = async (id) => {
  try {
    const { data } = await api.delete(`/blogs/${id}`);
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to delete blog";
    toast.error(message);
    throw new Error(message);
  }
};

// 6. Get Blog by ID (General/Public view)
export const getBlog = async (id) => {
  try {
    const { data } = await api.get(`/blogs/${id}`);
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch blog";
    throw new Error(message);
  }
};

// 7. Get Blog by Slug (For Frontend SEO friendly routing)
export const getBlogBySlug = async (slug) => {
  try {
    const { data } = await api.get(`/blogs/slug/${slug}`);
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch blog by slug";
    throw new Error(message);
  }
};

// 8. Get All Blogs with Pagination & Search (Admin dashboard view)
export const getBlogs = async (params) => {
  try {
    const { data } = await api.get("/blogs/admin", { params });
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch blogs";
    throw new Error(message);
  }
};

// 9. Get Blog by ID (Alternative method)
export const getBlogById = async (id) => {
  try {
    const { data } = await api.get(`/blogs/${id}`);
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch blog";
    throw new Error(message);
  }
};