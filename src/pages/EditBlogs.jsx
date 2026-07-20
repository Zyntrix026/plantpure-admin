import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FiArrowLeft, FiCheck, FiLoader, FiPlus, 
  FiAlertCircle, FiEye, FiHash, FiTrash2, FiSettings, FiImage, 
  FiX
} from "react-icons/fi";
import JoditEditor from "../components/editor/JodEditor";
import { uploadImage, getBlog, updateBlog } from "../lib/blogApi";
import { getCategories } from "../lib/categories";
import { toast } from "react-toastify";
import EditBlogSkeleton from "../components/blog/EditBlogSkeleton";

const EditBlogs = () => {
  const navigate = useNavigate();
  const params = useParams();
  const blogId = params.id;

  // --- States ---
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchingCats, setFetchingCats] = useState(true);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    selectedCategories: [],
    status: "draft",
    isFeatured: false,
    imageAlt: "",
    metaTitle: "",
    metaDescription: "",
    imageData: null,
  });

  // --- Load Data ---
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const catRes = await getCategories();
        // Backend response format ke according array set kar rahe hain (catRes.categoryList)
        setCategories(catRes.categoryList || catRes.data || []);
        setFetchingCats(false);

        const response = await getBlog(blogId);
        const blog = response.blog || response;

        const categoryIds = blog.categories?.map((cat) => 
          typeof cat === 'string' ? cat : cat._id
        ) || [];

        setForm({
          title: blog.title || "",
          slug: blog.slug || "",
          excerpt: blog.excerpt || "",
          content: blog.content || "",
          selectedCategories: categoryIds, 
          status: blog.status || "draft",
          isFeatured: blog.isFeatured || false,
          imageAlt: blog.image?.alt || "",
          metaTitle: blog.seo?.metaTitle || "",
          metaDescription: blog.seo?.metaDescription || "",
          imageData: {
            url: blog.image?.url,
            fileId: blog.image?.fileId,
          },
        });

        if (blog.image?.url) setPreview(blog.image.url);
        if (blog.tags) setTags(blog.tags);
        if (blog.seo?.keywords) setKeywords(blog.seo.keywords);

      } catch (err) {
        toast.error("Blog details load nahi ho payi!");
      } finally {
        setLoading(false);
      }
    };

    if (blogId) loadInitialData();
  }, [blogId]);

  const handleTagInput = (val) => {
    if (val.includes(",")) {
      const parts = val.split(",").map(t => t.trim()).filter(t => t && !tags.includes(t));
      setTags(prev => [...prev, ...parts]);
      setTagInput("");
    } else {
      setTagInput(val);
    }
  };

  const handleKeyInput = (val) => {
    if (val.includes(",")) {
      const parts = val.split(",").map(k => k.trim()).filter(k => k && !keywords.includes(k));
      setKeywords(prev => [...prev, ...parts]);
      setKeyInput("");
    } else {
      setKeyInput(val);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) return toast.error("File size 2MB se kam honi chahiye");

    setIsUploading(true);
    try {
      const res = await uploadImage(file, "blogs/thumbnails");
      setForm((prev) => ({ ...prev, imageData: res, imageAlt: form.title }));
      setPreview(URL.createObjectURL(file));
      toast.success("Image updated successfully!");
    } catch (err) {
      toast.error("Upload fail ho gaya");
    } finally {
      setIsUploading(false);
    }
  };

  const toggleCategory = (id) => {
    setForm((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(id)
        ? prev.selectedCategories.filter((c) => c !== id)
        : [...prev.selectedCategories, id],
    }));
  };

  const handleUpdate = async () => {
    // --- Validation Rules ---
    if (!form.title || form.title.trim().length < 3) {
      return toast.warn("Title is required and must be at least 3 characters long");
    }

    if (!form.content || form.content.trim().length < 50) {
      return toast.warn("Content is required and must be at least 50 characters long");
    }

    if (form.content.length > 5000000) {
      return toast.error("Content is too large. Maximum size is 5MB");
    }

    if (!form.selectedCategories || form.selectedCategories.length === 0) {
      return toast.warn("At least one category is required");
    }

    if (!form.imageData || !form.imageData.url) {
      return toast.warn("Image URL is required");
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        categories: form.selectedCategories,
        tags,
        status: form.status,
        isFeatured: form.isFeatured,
        image: {
          url: form.imageData?.url,
          alt: form.imageAlt || form.title,
          fileId: form.imageData?.fileId,
        },
        seo: {
          metaTitle: form.metaTitle || form.title,
          metaDescription: form.metaDescription || form.excerpt,
          keywords: keywords,
          canonicalUrl: `https://plantpure.in/${form.selectedCategories[0]}/${form.slug}`,
        },
      };

      await updateBlog(blogId, payload);
      toast.success("Blog successfully updated!");
      navigate("/admin/blogs");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <EditBlogSkeleton />;

  return (
    <div className="bg-[#fcfdfe] min-h-screen pb-20">
      {/* Premium Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate(-1)} 
              className="group p-2.5 hover:bg-slate-100 rounded-full transition-all border border-transparent hover:border-slate-200"
            >
              <FiArrowLeft size={20} className="text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] mb-0.5">Management</p>
              <h1 className="text-xl font-bold text-slate-900">Edit Post Details</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="hidden md:block bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-50 transition-all cursor-pointer"
            >
              <option value="draft">Draft Mode</option>
              <option value="published">Live/Published</option>
            </select>

            <button
              onClick={handleUpdate}
              disabled={isSubmitting || isUploading}
              className="bg-slate-900 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2.5 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? <FiLoader className="animate-spin" /> : <FiCheck size={18} />}
              {isSubmitting ? "Updating..." : "Update Post"}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-1 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
              <input
                className="w-full px-8 pt-10 pb-4 text-4xl font-bold border-none outline-none placeholder:text-slate-200 text-slate-800"
                placeholder="Story Title..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <div className="px-8 pb-4">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0">Slug</span>
                  <span className="text-slate-300">|</span>
                  <input
                    className="flex-1 bg-transparent outline-none text-xs text-slate-600"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
                    placeholder="enter-slug-manually"
                  />
                </div>
              </div>
              <div className="px-2 pb-2">
                <div className="border-t border-slate-100 mt-2">
                  <JoditEditor 
                    value={form.content} 
                    onChange={(val) => setForm({ ...form, content: val })} 
                  />
                </div>
              </div>
            </div>

            {/* SEO Panel */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><FiSettings /></div>
                <h3 className="font-bold text-slate-800 text-sm">SEO & Metadata Optimization</h3>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Meta Title</label>
                    <input
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3.5 text-sm focus:bg-white focus:ring-4 focus:ring-blue-50/50 outline-none transition-all"
                      placeholder="Title for search engines..."
                      value={form.metaTitle}
                      onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Meta Description</label>
                    <textarea
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3.5 text-sm focus:bg-white focus:ring-4 focus:ring-blue-50/50 outline-none transition-all resize-none"
                      placeholder="Concise summary for SEO..."
                      rows={3}
                      value={form.metaDescription}
                      onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Search Keywords</label>
                  <div className="flex flex-wrap gap-2 p-3 bg-slate-50/50 border border-slate-200 rounded-xl min-h-[54px] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50/50 transition-all">
                    {keywords.map((k, i) => (
                      <span key={i} className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 shadow-sm">
                        {k} 
                        <button onClick={() => setKeywords(keywords.filter((_, idx) => idx !== i))}>
                          <FiTrash2 className="hover:text-red-500 transition-colors" size={12} />
                        </button>
                      </span>
                    ))}
                    <input
                      className="flex-1 bg-transparent border-none outline-none text-sm min-w-[150px]"
                      placeholder="Type and press Enter or comma..."
                      value={keyInput}
                      onChange={(e) => handleKeyInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && keyInput.trim()) {
                          e.preventDefault();
                          if(!keywords.includes(keyInput.trim())) setKeywords([...keywords, keyInput.trim()]);
                          setKeyInput("");
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Feature Image Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-4 block">Feature Image</label>
              
              <div className="relative aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-center overflow-hidden group hover:border-blue-400 transition-all">
                {preview ? (
                  <>
                    <img src={preview} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="p-3 bg-white/90 rounded-full text-blue-600 shadow-xl cursor-pointer hover:scale-110 transition-transform">
                        <FiImage size={20} />
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-500">
                      <FiPlus size={24} />
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Update Cover</p>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}

                {isUploading && (
                  <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-10">
                    <FiLoader className="animate-spin text-blue-600 mb-3" size={32} />
                    <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Uploading...</span>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:bg-white outline-none transition-all"
                  placeholder="Image Alt Text (SEO)"
                  value={form.imageAlt}
                  onChange={(e) => setForm({ ...form, imageAlt: e.target.value })}
                />
              </div>
            </div>

            {/* Categories Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Categories</label>
                <div className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black">
                  {form.selectedCategories.length}
                </div>
              </div>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {fetchingCats ? (
                  <div className="flex justify-center py-10"><FiLoader className="animate-spin text-slate-300" /></div>
                ) : (
                  categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => toggleCategory(cat._id)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border text-xs font-bold transition-all ${
                        form.selectedCategories.includes(cat._id)
                          ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                          : "bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span>{cat.name}</span>
                      {form.selectedCategories.includes(cat._id) && <FiCheck size={16} />}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Tags Section */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <label className="text-[11px] font-bold text-slate-500 uppercase block mb-4">Discovery Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((t, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-bold">
                    <FiHash className="text-slate-400" /> {t}
                    <button onClick={() => setTags(tags.filter((_, idx) => idx !== i))} className="hover:text-red-500">
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:bg-white"
                placeholder="Add tag, press Enter or comma"
                value={tagInput}
                onChange={(e) => handleTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tagInput.trim()) {
                    e.preventDefault();
                    if(!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
                    setTagInput("");
                  }
                }}
              />
            </div>

            {/* Excerpt & Featured Panel */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Short Excerpt</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs outline-none focus:bg-white transition-all resize-none"
                  rows={4}
                  placeholder="Summary for blog cards..."
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-2">
                  <FiAlertCircle className="text-blue-600" />
                  <span className="text-[11px] font-bold text-blue-900 uppercase">Featured</span>
                </div>
                <button
                  onClick={() => setForm({ ...form, isFeatured: !form.isFeatured })}
                  className={`w-12 h-6 rounded-full transition-all relative ${form.isFeatured ? "bg-blue-600" : "bg-slate-300"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${form.isFeatured ? "left-7" : "left-1"}`} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default EditBlogs;