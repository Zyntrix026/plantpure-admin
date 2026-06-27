import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Tag,
  Box,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getProductById } from "../lib/product";

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ================= LOADING =================
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );

  // ================= ERROR =================
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-center max-w-sm w-full">
          <AlertCircle className="mx-auto text-red-500 mb-3" size={32} />
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  // ================= MAIN =================
  return (
    <div className="bg-slate-50 min-h-screen pb-10">
      {/* HEADER */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary"
          >
            <ChevronLeft size={18} />
            Back
          </button>

          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold ${
              product.status === "Active"
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {product.status}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 mt-6 grid lg:grid-cols-2 gap-8">
        {/* LEFT IMAGE SECTION */}
        <div>
          <div className="bg-white rounded-xl border overflow-hidden">
            <img
              src={product.images?.[activeImage]?.url}
              alt="product"
              className="w-full h-[350px] md:h-[450px] object-cover"
            />
          </div>

          {/* THUMBNAILS */}
          <div className="flex gap-3 mt-3 overflow-x-auto">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img.url}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-16 object-cover rounded-lg cursor-pointer border ${
                  activeImage === i
                    ? "border-primary"
                    : "border-transparent opacity-70"
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT INFO */}
        <div className="space-y-6">
          {/* CATEGORY */}
          <p className="text-xs text-primary font-semibold flex items-center gap-1">
            <Tag size={14} />
            {product.category?.name}
          </p>

          {/* TITLE */}
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            {product.title}
          </h1>

          {/* EXCERPT */}
          <p className="text-sm text-slate-500">{product.excerpt}</p>

          {/* PRICE BOX */}
          <div className="bg-white border rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">
                ₹{product.discountPrice}
              </span>
              <span className="line-through text-gray-400">
                ₹{product.basePrice}
              </span>
              <span className="text-xs bg-primary text-white px-2 py-1 rounded">
                {product.discountPercentage}
              </span>
            </div>

            <div className="text-sm text-slate-600 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Box size={16} />
                SKU: <span className="font-medium">{product.sku}</span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                Stock:
                <span
                  className={
                    product.stock > 0
                      ? "text-green-600 font-medium"
                      : "text-red-500 font-medium"
                  }
                >
                  {product.stock > 0
                    ? `${product.stock} Available`
                    : "Out of stock"}
                </span>
              </div>
            </div>
          </div>

          {/* META */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Meta Title</p>
              <p className="text-sm font-medium text-slate-700">
                {product.metaTitle}
              </p>
            </div>

            <div className="bg-white border rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-2">Keywords</p>
              <div className="flex flex-wrap gap-2">
                {product.keywords?.map((k, i) => (
                  <span
                    key={i}
                    className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                  >
                    #{k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        <div className="bg-white border rounded-xl p-6 md:p-10">
          <h2 className="text-xl font-semibold mb-6 text-slate-800">
            Product Details
          </h2>

          <div
            className="prose max-w-none text-slate-600"
            dangerouslySetInnerHTML={{
              __html: product.productOverview,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductView;