import React, { useState, useEffect } from "react";
import {
  Search, Plus, Edit3, Trash2, ChevronLeft, ChevronRight,
  PackageSearch, Download, FileText, FileSpreadsheet, X, Hash,
} from "lucide-react";
import { Link } from "react-router-dom";
// exportProductsData ko product library se import kiya
import { getProducts, deleteProduct, exportProductsData } from "../lib/product";
import toast from "react-hot-toast";
import DeleteModal from "../components/Category/DeleteModal";

// ─── Export Panel ─────────────────────────────────────────────────────────────
const ExportPanel = ({ totalCount }) => {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("");
  const [exporting, setExporting] = useState(null); // "csv" | "excel" | null

  const clamp = (val, lo, hi) => Math.min(hi, Math.max(lo, parseInt(val) || lo));

  const handleExport = async (format) => {
    const parsedMin = clamp(min, 1, totalCount);
    const parsedMax = clamp(max || totalCount, parsedMin, totalCount);

    if (parsedMin > parsedMax) {
      toast.error("Min cannot be greater than Max");
      return;
    }

    setExporting(format);
    try {
      // Axios Instance API Function call kiya params ke sath
      const blobData = await exportProductsData({
        min: parsedMin,
        max: parsedMax,
        format: format
      });

      const ext   = format === "csv" ? "csv" : "xls";
      const fname = `SidTelfers_Products_${parsedMin}-${parsedMax}.${ext}`;
      
      // Blob response ko browser trigger download me process kiya
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement("a");
      link.href = url;
      link.download = fname;
      document.body.appendChild(link);
      
      link.click();
      
      // Memory cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Exported ${parsedMax - parsedMin + 1} products as ${ext.toUpperCase()}`);
    } catch (err) {
      toast.error(err.message || "Export failed");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Range inputs */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm h-[54px]">
        <Hash size={14} className="text-slate-400" />
        <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Range</span>
        <input
          type="number"
          min={1}
          max={totalCount}
          value={min}
          onChange={(e) => setMin(e.target.value)}
          placeholder="Min"
          className="w-16 text-center text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-blue-400"
        />
        <span className="text-slate-300 font-bold">—</span>
        <input
          type="number"
          min={1}
          max={totalCount}
          value={max}
          onChange={(e) => setMax(e.target.value)}
          placeholder={`${totalCount}`}
          className="w-16 text-center text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-blue-400"
        />
      </div>

  

      <button
        onClick={() => handleExport("excel")}
        disabled={!!exporting || totalCount === 0}
        className="flex items-center gap-2 px-5 py-3.5 bg-blue-600 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-md hover:bg-blue-700 disabled:opacity-50 transition-all h-[54px]"
      >
        {exporting === "excel"
          ? <><span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" /> Exporting...</>
          : <><FileSpreadsheet size={14} /> Export Excel</>}
      </button>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const Products = () => {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete]     = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab]   = useState("All Products");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [totalCount, setTotalCount]   = useState(0);

  const getPaginationRange = (current, total) => {
    const range = [];
    const delta = 1;
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }
    return range;
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let statusParam = "";
      if (activeTab === "Published") statusParam = "Published";
      if (activeTab === "Drafts")    statusParam = "Drafts";

      const response = await getProducts({ search: searchTerm, status: statusParam, page: currentPage, limit: 8 });
      if (response.success) {
        setProducts(response.data);
        setTotalPages(response.totalPages);
        setTotalCount(response.totalProducts);
      }
    } catch (err) {
      toast.error(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await deleteProduct(productToDelete._id);
      if (res.success) {
        toast.success("Product deleted successfully");
        setIsDeleteModalOpen(false);
        fetchProducts();
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteLoading(false);
      setProductToDelete(null);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => fetchProducts(), 400);
    return () => clearTimeout(t);
  }, [searchTerm, activeTab, currentPage]);

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="p-7"><div className="flex gap-4 items-center"><div className="w-16 h-16 bg-slate-200 rounded-2xl" /><div className="space-y-2"><div className="h-5 w-48 bg-slate-200 rounded" /><div className="h-4 w-24 bg-slate-100 rounded" /></div></div></td>
      <td className="p-7"><div className="h-7 w-28 bg-slate-100 rounded-lg" /></td>
      <td className="p-7"><div className="h-8 w-20 bg-slate-200 rounded" /></td>
      <td className="p-7"><div className="flex justify-center gap-2"><div className="h-10 w-10 bg-slate-100 rounded-xl" /><div className="h-10 w-10 bg-slate-100 rounded-xl" /></div></td>
    </tr>
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen ">
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />

      <div className="max-w-[1600px] mx-auto">
        {/* ─── Header Fixed Layout ─── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Product Catalog</h1>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
              {totalCount} Total Items
            </p>
          </div>

          {/* Export Panel + Add Button perfectly wrapped */}
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            {/* <ExportPanel totalCount={totalCount} /> */}
            <Link to="/admin/addproducts" className="w-full sm:w-auto">
              <button className="w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all h-[54px] whitespace-nowrap">
                <Plus size={20} /> Add New Product
              </button>
            </Link>
          </div>
        </div>

        {/* ─── Tabs & Search ─── */}
        <div className="bg-white p-3 rounded-[2rem] border border-slate-100 shadow-sm mb-8 flex flex-col lg:flex-row gap-6 items-center">
          <div className="flex p-1.5 bg-slate-50 rounded-2xl w-full lg:w-auto">
            {["All Products", "Published", "Drafts"].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`flex-1 lg:flex-none px-8 py-3 text-sm font-black uppercase tracking-wide rounded-xl transition-all ${activeTab === tab ? "bg-white text-primary shadow-md" : "text-slate-400 hover:text-slate-600"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={22} />
            <input
              type="text"
              placeholder="Search by product name..."
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-base outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-300"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>

        {/* ─── Table ─── */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="p-7 text-xs font-black text-slate-400 uppercase tracking-widest">Product Details</th>
                  <th className="p-7 text-xs font-black text-slate-400 uppercase tracking-widest">Categories</th>
                  <th className="p-7 text-xs font-black text-slate-400 uppercase tracking-widest">Pricing </th>
                  <th className="p-7 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-24 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-20 text-slate-400">
                        <PackageSearch size={80} />
                        <p className="text-2xl font-black uppercase">No Products Found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    let basePrice = 0, discountPrice = null, hasDiscount = false, discountPercentage = 0;

                    if (product.prices) {
                      basePrice     = product.prices.includeVat?.base || 0;
                      discountPrice = product.prices.includeVat?.discount;
                      hasDiscount   = !!discountPrice && discountPrice < basePrice;
                      if (hasDiscount && basePrice > 0)
                        discountPercentage = Math.round(((basePrice - discountPrice) / basePrice) * 100);
                    } else if (product.startingFrom) {
                      basePrice   = product.startingFrom.includeVat || 0;
                      hasDiscount = false;
                    }

                    return (
                      <tr key={product._id} className="group hover:bg-blue-50/30 transition-all">
                        <td className="p-7">
                          <div className="flex gap-5 items-center">
                            <div className="relative">
                              <img
                                src={product.thumbnail || "https://placehold.co/100"}
                                alt={product.title}
                                className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm group-hover:scale-105 transition-transform"
                              />
                              <div className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full border-4 border-white ${product.status === "Active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                            </div>
                            <div>
                              <p className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">{product.title}</p>
                              <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-black uppercase tracking-wider">SKU: {product.sku}</span>
                                <span className="text-xs text-slate-400 font-semibold">Stock: {product.stock}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-7">
                          <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                            {product.category?.map((cat) => (
                              <span key={cat._id} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                                {cat.name}
                              </span>
                            )) || <span className="text-slate-300">N/A</span>}
                          </div>
                        </td>
                        <td className="p-7">
                          <div className="flex flex-col">
                            <span className="text-lg font-black text-slate-900">
                              ₹{(hasDiscount && discountPrice ? discountPrice : basePrice).toFixed(2)}
                            </span>
                            {hasDiscount && (
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-slate-400 line-through font-medium">₹{basePrice.toFixed(2)}</span>
                                <span className="text-[10px] text-emerald-500 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">{discountPercentage}% OFF</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-7">
                          <div className="flex items-center justify-center gap-2">
                            <Link to={`/admin/product/edit/${product._id}`} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-md rounded-2xl transition-all">
                              <Edit3 size={20} />
                            </Link>
                            <button
                              onClick={() => { setProductToDelete(product); setIsDeleteModalOpen(true); }}
                              className="p-3 text-slate-400 hover:text-rose-600 hover:bg-white hover:shadow-md rounded-2xl transition-all"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ─── Pagination ─── */}
          <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">
              Showing {products.length} of {totalCount} Items
            </p>
            <div className="flex items-center gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <div className="flex gap-1.5 items-center">
                {getPaginationRange(currentPage, totalPages).map((page, i) => (
                  <button
                    key={i}
                    disabled={page === "..."}
                    onClick={() => page !== "..." && setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                      currentPage === page ? "bg-primary text-white shadow-lg shadow-blue-100"
                      : page === "..." ? "text-slate-300 cursor-default"
                      : "text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;