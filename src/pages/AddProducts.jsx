import React, { useState, useEffect } from "react";
import { ChevronLeft, LayoutDashboard, FileText, Send, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ProductContentAdd from "../components/product/ProductContentAdd";
import ProductSidebarAdd from "../components/product/ProductSidebarAdd";
import { getCategoriesFormatted } from "../lib/categories";
import { uploadImage, createProduct } from "../lib/product";

const AddProduct = () => {
  const navigate = useNavigate();

  const generateSKU = (title = "") => {
    const word = title.trim().split(/\s+/).find(w => w.length > 1)?.replace(/[^\w]/g, '').toUpperCase().slice(0, 6) || 'PROD';
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `PLANTPURE-${word}-${rand}`;
  };
  const [images, setImages] = useState([null, null, null, null, null]);
  const [categories, setCategories] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    sku: "PLANTPURE-",
    slug: "",
    brand: "Generic",
    stock: 0,
    excerpt: "",
    basePrice: "",
    discountPrice: "",
    vatPercentage: 0,
    discountPercentage: "",
    productOverview: "",
    status: "Active",
    category: [],
    // shipping_category: "SP",
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    hasVariants: false,
    variants: [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getCategoriesFormatted();
        setCategories(data?.categoryList || []);
      } catch (err) {
        toast.error("Could not fetch categories");
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!formData.title) return;

    const generatedSlug = formData.title
      .toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");

    const generatedSKU = generateSKU(formData.title);

    let discountPercent = "";
    if (formData.basePrice && formData.discountPrice) {
      const bPrice = parseFloat(formData.basePrice);
      const dPrice = parseFloat(formData.discountPrice);
      if (bPrice > dPrice) {
        discountPercent = Math.round(((bPrice - dPrice) / bPrice) * 100) + "% Off";
      }
    }

    setFormData((prev) => ({
      ...prev,
      slug: generatedSlug,
      sku: prev.sku && prev.sku !== 'PLANTPURE-' ? prev.sku : generatedSKU,
      discountPercentage: discountPercent,
    }));
  }, [formData.title, formData.basePrice, formData.discountPrice]);

  const handleImageUpload = async (file, index) => {
    const toastId = toast.loading(`Uploading...`);
    try {
      const uploaded = await uploadImage(file, "products/images");
      setImages((prev) => {
        const next = [...prev];
        next[index] = { ...uploaded, preview: URL.createObjectURL(file) };
        return next;
      });
      toast.success("Uploaded!", { id: toastId });
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

  const handleSaveProduct = async (targetStatus) => {
    if (!formData.title || !formData.category.length) {
      toast.error("Title and Category are required");
      return;
    }

    if (!formData.hasVariants && formData.discountPrice && Number(formData.discountPrice) >= Number(formData.basePrice)) {
      toast.error("Sale price must be less than base price");
      return;
    }

    if (formData.hasVariants && (!formData.variants || formData.variants.length === 0)) {
      toast.error("Add at least one variant");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving...");

    try {
      const finalImages = images.filter(Boolean).map((img) => ({
        url: img.url, fileId: img.fileId, alt: formData.title, size: img.size,
      }));

      const payload = {
        ...formData,
        status: targetStatus,
        vatPercentage: Number(formData.vatPercentage),
        images: finalImages,
        hasVariants: formData.hasVariants,
        ...(formData.hasVariants
          ? {
              variants: formData.variants.map((v) => ({
                label: v.label,
                price: Number(v.price),
                discountPrice: v.discountPrice ? Number(v.discountPrice) : null,
                stock: Number(v.stock) || 0,
                sku: v.sku || null,
              })),
              basePrice: null,
              discountPrice: null,
              stock: 0,
            }
          : {
              basePrice: Number(formData.basePrice),
              discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
              stock: Number(formData.stock),
              variants: [],
            }),
      };

      await createProduct(payload);
      toast.success("Product Created!", { id: toastId });
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (err) {
      toast.error(err.message || "Failed to save", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 mb-8">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-5">
            <button onClick={() => navigate(-1)} className="p-2.5 border rounded-xl hover:bg-slate-50 transition-all text-slate-600">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <LayoutDashboard style={{ color: "var(--color-primary)" }} size={24} /> Add Product
            </h1>
          </div>
          <div className="flex gap-3">
            <button onClick={() => handleSaveProduct("Draft")} disabled={isSaving} className="flex items-center gap-2 border px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 transition-all hover:bg-slate-50">
              <FileText size={18} /> Save Draft
            </button>
            <button 
              onClick={() => handleSaveProduct("Active")} 
              disabled={isSaving} 
              style={{ backgroundColor: "var(--color-secondary)" }}
              className="flex items-center gap-2 text-white px-7 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 shadow-lg shadow-slate-100"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              Publish Product
            </button>
          </div>
        </div>
      </header>

      <main className=" max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <ProductContentAdd formData={formData} setFormData={setFormData} images={images} setImages={setImages} onImageUpload={handleImageUpload} errors={errors} onRegenerateSKU={() => setFormData(p => ({...p, sku: generateSKU(p.title)}))} />
          </div>
          <div className="lg:col-span-4">
            <ProductSidebarAdd formData={formData} setFormData={setFormData} categories={categories} errors={errors} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProduct;