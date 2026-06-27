import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Search,
  Save,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Star,
} from "lucide-react";
import {
  getAdminPopularProducts,
  saveOrUpdatePopularProducts,
} from "../lib/popularProducts";
import { getProductsForSelection } from "../lib/product";

const PopularProductsManager = () => {
  const [formData, setFormData] = useState({
    title: "Popular Products",
    products: [], // selected products array
    isActive: true,
  });

  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Independent states for pagination to avoid re-render conflicts
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 1. Fetch Current Settings (Run only once on Mount)
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const res = await getAdminPopularProducts();
        if (res?.success && res.data) {
          setFormData({
            title: res.data.title || "Popular Products",
            products: res.data.products?.map((p) => p._id) || [],
            isActive: res.data.isActive ?? true,
          });
        }
      } catch (err) {
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // 2. Fetch Inventory Products (Triggers on Page or Search change)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProductsForSelection({
          page: page,
          search: searchTerm,
          limit: 12, // Limit matches your API logic
        });
        if (res.success) {
          setAllProducts(res.data || []);
          setTotalPages(res.totalPages || 1);
        }
      } catch (err) {
        console.error("Error fetching selection products:", err);
      }
    };

    fetchProducts();
  }, [page, searchTerm]);

  const toggleProduct = (id) => {
    setFormData((p) => ({
      ...p,
      products: p.products.includes(id)
        ? p.products.filter((i) => i !== id)
        : [...p.products, id],
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (formData.products.length === 0) {
      return toast.error("Please select at least one product");
    }

    setIsLoading(true); 

    try {
      const res = await saveOrUpdatePopularProducts(formData);
      if (res.success) {
        toast.success("Popular Products Updated Successfully!");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="min-h-screen text-[#253D4E] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#253D4E] p-3 rounded-2xl shadow-lg">
              <Star className="text-white w-7 h-7 fill-current" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Popular Products
              </h1>
              <p className="text-base text-gray-500 font-medium">
                Curate the trending items for your homepage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-3 px-5 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Visibility
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
              {formData.isActive ? "● Live on Site" : "● Hidden"}
            </button>
          </div>
        </header>

        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left Side Card */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-xl font-bold border-b border-gray-50 pb-4">
                Section Heading
              </h2>

              <div>
                <label className="text-sm font-bold mb-2 block text-gray-700">
                  Display Title
                </label>
                <input
                  className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-2xl text-base font-medium focus:bg-white focus:border-[#253D4E] focus:ring-4 focus:ring-[#253D4E]/5 outline-none transition-all"
                  placeholder="e.g. Trending Now"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#253D4E] text-white py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-3 hover:bg-[#1a2b37] transition-all shadow-xl shadow-[#253d4e33] disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Updating System...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Selection</span>
                  </>
                )}
              </button>
            </div>
          </aside>

          {/* Right Side: Product Grid */}
          <main className="lg:col-span-8 space-y-6">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="px-2">
                <h2 className="text-lg font-bold">Choose Products</h2>
                <p className="text-sm font-semibold text-[#3BB77E]">
                  {formData.products.length} Products Selected
                </p>
              </div>
              <div className="relative w-full md:w-80">
                <input
                  placeholder="Search products..."
                  className="w-full bg-gray-50 border-gray-100 py-3.5 pl-12 pr-4 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:ring-4 focus:ring-[#253D4E]/5 focus:border-[#253D4E] transition-all"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1); // Reset page to 1 when search term changes
                  }}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
              {allProducts.map((p) => {
                const active = formData.products.includes(p._id);
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
                      {p.thumbnail ? (
                        <img
                          src={p.thumbnail}
                          className="max-h-full transition-transform duration-500 group-hover:scale-110 object-contain"
                          alt={p.title}
                        />
                      ) : (
                        <div className="text-xs text-gray-400">No Image</div>
                      )}
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
              {allProducts.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-400 font-medium">
                  No products found.
                </div>
              )}
            </div>

            {/* Fixed Pagination Controls */}
            <div className="flex items-center justify-center gap-6 pt-6">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 disabled:opacity-20 transition-all shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="bg-white px-6 py-2 rounded-2xl border border-gray-100 font-bold">
                {page} / {totalPages}
              </div>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 disabled:opacity-20 transition-all shadow-sm"
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

export default PopularProductsManager;