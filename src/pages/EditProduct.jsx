import React, { useState, useEffect } from 'react';
import { ChevronLeft, LayoutDashboard, Send, Loader2, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ProductContentEdit from '../components/product/ProductContentEdit';
import ProductSidebarEdit from '../components/product/ProductSidebarEdit';
import { getCategoriesFormatted } from '../lib/categories';
import { getProductById, updateProduct } from '../lib/product';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const generateSKU = (title = "") => {
    const word = title.trim().split(/\s+/).find(w => w.length > 1)?.replace(/[^\w]/g, '').toUpperCase().slice(0, 6) || 'PROD';
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `SID-${word}-${rand}`;
  };

  const [images, setImages] = useState([null, null, null, null, null]);
  const [categories, setCategories] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: '', sku: '', slug: '', brand: 'Generic', stock: 0,
    excerpt: '', basePrice: '', discountPrice: '', vatPercentage: 0,
    discountPercentage: '', productOverview: '', status: 'Active', category: [],
    metaTitle: '', metaDescription: '', keywords: [],
  });

  // Core Data Hydration Effect
  useEffect(() => {
    const loadData = async () => {
      try {
        const [catData, productData] = await Promise.all([
          getCategoriesFormatted(),
          getProductById(id),
        ]);
        
        setCategories(catData?.categoryList || []);
        const p = productData?.data || productData;

        const existingImages = Array.isArray(p.images) ? p.images : [];
        const imageSlots = [null, null, null, null, null];
        existingImages.slice(0, 5).forEach((img, i) => {
          imageSlots[i] = { url: img.url, fileId: img.fileId, size: img.size };
        });
        setImages(imageSlots);

        let normalizedCats = [];
        if (Array.isArray(p.category)) {
          normalizedCats = p.category.map(c => c._id || c);
        } else if (p.category) {
          normalizedCats = [p.category._id || p.category];
        }

        setFormData({
          title: p.title || '',
          sku: p.sku || '',
          slug: p.slug || '',
          brand: p.brand || 'Generic',
          stock: p.stock || 0,
          excerpt: p.excerpt || '',
          basePrice: p.basePrice?.toString() || '',
          discountPrice: p.discountPrice?.toString() || '',
          vatPercentage: p.vatPercentage || 0,
          discountPercentage: p.discountPercentage || '0% Off',
          productOverview: p.productOverview || '',
          status: p.status || 'Active',
          category: normalizedCats,
          // shipping_category: p.shipping_category || 'SP',
          metaTitle: p.metaTitle || '',
          metaDescription: p.metaDescription || '',
          keywords: Array.isArray(p.keywords) ? p.keywords : [],
          hasVariants: p.hasVariants || false,
          variants: Array.isArray(p.variants) && p.variants.length > 0
            ? p.variants.map((v) => ({
                _id: v._id,
                label: v.label || '',
                price: v.price?.toString() || '',
                discountPrice: v.discountPrice?.toString() || '',
                stock: v.stock || 0,
                sku: v.sku || '',
              }))
            : [],
        });
      } catch (err) {
        toast.error('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  // Isolated Functional Logic to prevent Multi-Render State Traps
  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      const newSlug = formData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      let discountPercent = '0% Off';
      const b = parseFloat(formData.basePrice);
      const d = parseFloat(formData.discountPrice);

      if (b > 0 && d > 0 && b > d) {
        discountPercent = Math.round(((b - d) / b) * 100) + '% Off';
      }

      // Exact functional keys structural match update
      setFormData(prev => {
        if (prev.slug === newSlug && prev.discountPercentage === discountPercent) {
          return prev; 
        }
        return { 
          ...prev, 
          slug: newSlug, 
          discountPercentage: discountPercent 
        };
      });
    }, 400); // Debounce added to prevent cursor skipping on rapid keystrokes

    return () => clearTimeout(timer);
  }, [formData.title, formData.basePrice, formData.discountPrice, isLoading]);

  const handleUpdate = async (targetStatus) => {
    if (!formData.title || formData.category.length === 0) {
      toast.error("Title and Category are required");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Updating...");
    
    const finalImages = images.filter(Boolean).map(img => ({ 
      url: img.url, fileId: img.fileId, alt: formData.title, size: img.size 
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
              ...(v._id ? { _id: v._id } : {}),
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

    try {
      await updateProduct(id, payload);
      toast.success('Updated successfully!', { id: toastId });
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message || 'Update failed', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 mb-8">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-5">
            <button onClick={() => navigate(-1)} className="p-2.5 border rounded-xl hover:bg-slate-50 transition-all">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <LayoutDashboard className="text-indigo-600" size={24} /> Edit Product
            </h1>
          </div>
          <div className="flex gap-3">
            <button onClick={() => handleUpdate('Draft')} disabled={isSaving} className="flex items-center gap-2 border px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600">
              <FileText size={18} /> Save Draft
            </button>
            <button onClick={() => handleUpdate('Active')} disabled={isSaving} className="flex items-center gap-2 bg-slate-900 text-white px-7 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-200 transition-all">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />} Update Product
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto ">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <ProductContentEdit 
               formData={formData} 
               setFormData={setFormData} 
               images={images} 
               setImages={setImages} 
               onImageUpload={handleUpdate}
               errors={errors}
               onRegenerateSKU={() => setFormData(p => ({...p, sku: generateSKU(p.title)}))}
            />
          </div>
          <div className="lg:col-span-4">
            <ProductSidebarEdit formData={formData} setFormData={setFormData} categories={categories} errors={errors} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProduct;