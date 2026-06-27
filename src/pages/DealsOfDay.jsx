import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Search,
  Upload,
  Save,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  LayoutDashboard,
} from "lucide-react";
import { getAdminDeals, saveOrUpdateDeals } from "../lib/DealsOfDay";
import { getProductsForSelection, uploadImage } from "../lib/product";
import { getCategoriesFormatted } from "../lib/categories";

const DealsManager = () => {
  const [formData, setFormData] = useState({
    title: "Deals Of The Day",
    bannerImage: { url: "", alt: "Deals Banner" },
    buttonText: "View All",
    linkedCategory: "",
    selectedProducts: [],
    isActive: true,
  });

  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [meta, setMeta] = useState({
    loading: false,
    uploading: false,
    page: 1,
    totalPages: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");


  // Flatten nested categories for a clean dropdown list
  const flatten = (list, prefix = "") =>
    list.reduce((acc, cat) => {
      const name = prefix ? `${prefix} > ${cat.name}` : cat.name;
      acc.push({ _id: cat._id, name });
      if (cat.children?.length) acc.push(...flatten(cat.children, name));
      return acc;
    }, []);

  useEffect(() => {
    (async () => {
      setMeta((p) => ({ ...p, loading: true }));
      try {
        const [dealRes, catRes] = await Promise.all([
          getAdminDeals(),
          getCategoriesFormatted(),
        ]);
        if (dealRes?.success && dealRes.data) {
          setFormData({
            ...dealRes.data,
            linkedCategory: dealRes.data.linkedCategory?._id || "",
            selectedProducts:
              dealRes.data.selectedProducts?.map((p) => p._id) || [],
          });
        }
        if (catRes?.success) setCategories(flatten(catRes.categoryList));
      } catch (err) {
        toast.error("Initialization failed");
      }
      setMeta((p) => ({ ...p, loading: false }));
    })();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProductsForSelection({
          page: meta.page,
          search: searchTerm,
          limit: 12,
        });
        if (res.success) {
          setAllProducts(res.data);
          setMeta((p) => ({ ...p, totalPages: res.totalPages || 1 }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [meta.page, searchTerm]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMeta((p) => ({ ...p, uploading: true }));
    try {
      const res = await uploadImage(file, "deals/banners");
      setFormData((p) => ({
        ...p,
        bannerImage: { url: res.url, alt: p.title },
      }));
      toast.success("Banner image updated");
    } catch {
      toast.error("Upload failed");
    }
    setMeta((p) => ({ ...p, uploading: false }));
  };

  const toggleProduct = (id) => {
    setFormData((p) => ({
      ...p,
      selectedProducts: p.selectedProducts.includes(id)
        ? p.selectedProducts.filter((i) => i !== id)
        : [...p.selectedProducts, id],
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.bannerImage.url || !formData.linkedCategory) {
      return toast.error("Please upload a banner and select a category");
    }

    setMeta((p) => ({ ...p, loading: true })); // Start Loading

    try {
      const res = await saveOrUpdateDeals(formData);
      if (res.success) {
        // toast.success("Deals Saved Successfully!");
        // Thoda wait karke reload karein taaki user success message dekh sake
        // setTimeout(() => window.location.reload(), 1200);
      }
    } catch (err) {
      // Error message display karein (catch block handle karega API errors ko)
      toast.error(err.message || "Failed to update deals");
    } finally {
      // Agar success ho gaya tab toh page reload ho jayega,
      // lekin agar error aaya toh button ko wapas normal state mein lana zaroori hai
      setMeta((p) => ({ ...p, loading: false }));
    }
  };

  return (
    <div className="min-h-screen  text-[#253D4E]">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#253D4E] p-3 rounded-2xl shadow-lg">
              <LayoutDashboard className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Deals Management
              </h1>
              <p className="text-base text-gray-500 font-medium">
                Manage daily promotional activities and banners
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-3 px-5 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Current Status
            </span>
            <button
              type="button"
              onClick={() =>
                setFormData((p) => ({ ...p, isActive: !p.isActive }))
              }
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all duration-300 ${
                formData.isActive
                  ? "bg-[#DEF9EC] text-[#3BB77E] border border-[#3BB77E]/20"
                  : "bg-[#FDE3E3] text-[#F74B81] border border-[#F74B81]/20"
              }`}
            >
              {formData.isActive ? "● Active" : "● Inactive"}
            </button>
          </div>
        </header>

        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left: Configuration Card */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-xl font-bold border-b border-gray-50 pb-4">
                Banner Configuration
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-bold mb-2 block text-gray-700">
                    Section Title
                  </label>
                  <input
                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-2xl text-base font-medium focus:bg-white focus:border-[#253D4E] focus:ring-4 focus:ring-[#253D4E]/5 outline-none transition-all"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-bold mb-2 block text-gray-700">
                    Button Text
                  </label>
                  <input
                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-2xl text-base font-medium focus:bg-white focus:border-[#253D4E] focus:ring-4 focus:ring-[#253D4E]/5 outline-none transition-all"
                    value={formData.buttonText}
                    onChange={(e) =>
                      setFormData({ ...formData, buttonText: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-bold mb-2 block text-gray-700">
                    Linked Category
                  </label>
                  <select
                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-2xl text-base font-medium focus:bg-white focus:border-[#253D4E] outline-none cursor-pointer appearance-none transition-all"
                    value={formData.linkedCategory}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        linkedCategory: e.target.value,
                      })
                    }
                    style={{
                      backgroundImage:
                        'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724%27 height=%2724%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23253D4E%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpolyline points=%276 9 12 15 18 9%27%3E%3C/polyline%3E%3C/svg%3E")',
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1.2em",
                    }}
                  >
                    <option value="">Choose a category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold mb-3 block text-gray-700">
                    Promotion Banner Image
                  </label>
                  <div className="relative aspect-[16/8] rounded-[1.5rem] border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden flex flex-col items-center justify-center group hover:border-[#253D4E] hover:bg-white transition-all duration-300">
                    {formData.bannerImage.url ? (
                      <img
                        src={formData.bannerImage.url}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        alt="banner"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                        <Upload className="w-8 h-8" />
                        <span className="text-xs font-bold uppercase tracking-widest">
                          Upload Banner
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={handleUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    {meta.uploading && (
                      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center text-sm font-bold animate-pulse">
                        Processing Upload...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={meta.loading}
                className="w-full bg-[#253D4E] text-white py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-3 hover:bg-[#1a2b37] transition-all shadow-xl shadow-[#253d4e33] disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {meta.loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Updating System...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Configuration</span>
                  </>
                )}
              </button>
            </div>
          </aside>

          {/* Right: Product Grid */}
          <main className="lg:col-span-8 space-y-6">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="px-2">
                <h2 className="text-lg font-bold">Product Selection</h2>
                <p className="text-sm font-semibold text-[#3BB77E]">
                  {formData.selectedProducts.length} Items carefully picked
                </p>
              </div>
              <div className="relative w-full md:w-80">
                <input
                  placeholder="Search across inventory..."
                  className="w-full bg-gray-50 border-gray-100 py-3.5 pl-12 pr-4 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:ring-4 focus:ring-[#253D4E]/5 focus:border-[#253D4E] transition-all"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setMeta((p) => ({ ...p, page: 1 }));
                  }}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
              {allProducts.map((p) => {
                const active = formData.selectedProducts.includes(p._id);
                return (
                  <div
                    key={p._id}
                    onClick={() => toggleProduct(p._id)}
                    className={`group cursor-pointer rounded-[1.5rem] p-4 border-2 transition-all duration-300 relative ${
                      active
                        ? "border-[#253D4E] bg-white shadow-md ring-4 ring-[#253D4E]/5"
                        : "border-transparent bg-white hover:border-gray-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="relative aspect-square mb-4 bg-[#F8FAFB] rounded-2xl p-3 flex items-center justify-center overflow-hidden">
                      <img
                        src={p.thumbnail}
                        className="max-h-full transition-transform duration-500 group-hover:scale-110"
                        alt={p.title}
                      />
                      {active && (
                        <div className="absolute top-2 right-2 bg-[#253D4E] text-white p-1 rounded-full shadow-lg">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-bold text-[#253D4E] line-clamp-2 leading-snug h-9 px-1 group-hover:text-[#3BB77E] transition-colors">
                      {p.title}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Modern Pagination */}
            <div className="flex items-center justify-center gap-6 pt-6">
              <button
                type="button"
                disabled={meta.page === 1}
                onClick={() => setMeta((p) => ({ ...p, page: p.page - 1 }))}
                className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-[#253D4E] disabled:opacity-20 disabled:pointer-events-none transition-all shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center bg-white px-6 py-2.5 rounded-2xl border border-gray-100 shadow-sm">
                <span className="text-sm font-bold text-gray-400 mr-2">
                  PAGE
                </span>
                <span className="text-lg font-black">{meta.page}</span>
                <span className="mx-2 text-gray-300">/</span>
                <span className="text-sm font-bold text-gray-400">
                  {meta.totalPages}
                </span>
              </div>

              <button
                type="button"
                disabled={meta.page >= meta.totalPages}
                onClick={() => setMeta((p) => ({ ...p, page: p.page + 1 }))}
                className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-[#253D4E] disabled:opacity-20 disabled:pointer-events-none transition-all shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </main>
        </form>
      </div>
    </div>
  );
};

export default DealsManager;
