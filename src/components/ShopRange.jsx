import React from 'react';
import product from '../assets/product.png';

const products = [
  {
    id: 1,
    name: "Natural Hair Coloring Kit",
    category: "HAIR COLOR",
    price: "₹900",
    badge: "BESTSELLER",
    image: "https://plantpure.in/wp-content/uploads/2025/10/IMG20251027142920-compressed.png",
    ingredients: "Henna Powder, Indigo Powder, Hibiscus Oil"
  },
  {
    id: 2,
    name: "Cleansing & Nourishing Hair Cleanser",
    category: "HAIR CLEANSER",
    price: "₹340",
    oldPrice: "₹680",
    badge: "50% OFF",
    image: "https://plantpure.in/wp-content/uploads/2025/10/pp_0000_hair-shampoo-cleansing.jpg",
    ingredients: "Rosemary, Saw Palmetto, Hibiscus"
  },
  {
    id: 3,
    name: "Color Secure Hair Cleanser",
    category: "HAIR CLEANSER",
    price: "₹340",
    oldPrice: "₹680",
    badge: "50% OFF",
    image: "https://plantpure.in/wp-content/uploads/2025/10/pp_0001_hair-shampoo-color-protect-600x740.jpg",
    ingredients: "Rosemary, Saw Palmetto, Hibiscus"
  },
  {
    id: 4,
    name: "Hibiscus Flower Oil",
    category: "HAIR SERUM & OIL",
    price: "₹680",
    image: product,
    ingredients:
      "Hibiscus Flower Extract, Black Sesame Seed Oil, Fenugreek Seed Extract, Rose Oil"
  },
  {
    id: 5,
    name: "Organic Cold-Pressed Jojoba Seed Oil",
    category: "SKIN CARE",
    price: "₹375",
    image: "https://plantpure.in/wp-content/uploads/2025/10/jojoba-oil-front-3.jpg",
    ingredients: "100% Pure Cold-Pressed Jojoba Oil"
  },
  {
    id: 6,
    name: "Moringa Oil",
    category: "SKIN CARE",
    price: "₹350",
    image: "https://plantpure.in/wp-content/uploads/2025/10/skin-care-moringa-oil-1.jpg",
    ingredients: "Cold-Pressed Moringa Oil"
  }
];

const ProductCard = ({ product, setSelectedProduct }) => {
  const handleShopClick = () => {
    setSelectedProduct(product.name);

    document.getElementById("contact-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="group bg-white rounded-3xl p-4 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {product.badge && (
          <span className="absolute top-3 left-3 bg-[#1a3c26] text-white text-[10px] font-bold px-2 py-1 rounded-md tracking-wider">
            {product.badge}
          </span>
        )}
      </div>

      <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">
        {product.category}
      </p>

      <h3 className="font-bold text-[#1a3c26] mb-1 leading-snug">
        {product.name}
      </h3>

      <p className="text-[11px] text-[#2d6a4f] mb-4 italic font-medium">
        {product.ingredients}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-[#1a3c26]">
            {product.price}
          </span>

          {product.oldPrice && (
            <span className="text-[11px] text-gray-400 line-through">
              {product.oldPrice}
            </span>
          )}
        </div>

        <button
          onClick={handleShopClick}
          className="text-sm font-semibold text-[#2d6a4f] hover:underline"
        >
          Shop →
        </button>
      </div>
    </div>
  );
};

const ShopRange = ({ setSelectedProduct }) => {
  return (
    <section className="py-16 bg-[#f7f9f2]">
      <div className="custom-container mx-auto px-4">
        <div className="text-center mb-12">
          <h4 className="text-[#2d6a4f] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
            Shop the range
          </h4>

          <h2 className="text-3xl md:text-4xl font-bold text-[#1a3c26]">
            The full PlantPure collection.
          </h2>

          <p className="text-gray-500 mt-2 text-sm">
            Hair color, cleansers, serums and skin oils — all 100% natural,
            all chemical-free.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              setSelectedProduct={setSelectedProduct}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopRange;