import React from 'react';
import Plant1 from '../assets/Plant1.png';
const IngredientsSection = () => {
  const benefits = [
    "Natural Grey Coverage",
    "No Ammonia, PPD & Peroxide",
    "Supports Healthy Hair Growth",
    "Rich Natural Color",
    "Adds Shine & Softness",
    "Gentle On Hair & Scalp"
  ];

  return (
    <section className="py-12 bg-[#f7f9f2]">
      <div className="custom-container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* Left: Image */}
          <div className="flex-1 w-full">
            <div className="rounded-3xl overflow-hidden shadow-lg aspect-[5/4] bg-gray-300 relative">
              <img
                src={Plant1}
                alt="Botanical Ingredients"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Updated Content */}
          <div className="flex-1 space-y-6">
            <div>
              <h4 className="text-[#2d6a4f] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                PlantPure
              </h4>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a3c26] leading-tight">
                Why Women Love PlantPure
              </h2>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 bg-[#1a3c26] w-6 h-6 rounded-full flex items-center justify-center">
                    <span className="text-[10px] text-white">✓</span>
                  </div>
                  <span className="text-sm font-semibold text-[#1a3c26]">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Optional Description Text */}
            <p className="text-gray-600 text-sm leading-relaxed max-w-md pt-2 border-t border-gray-200 mt-4">
              Experience the goodness of Ayurveda with PlantPure's Natural Hair Coloring Kit. Carefully crafted with
              herbal ingredients that help cover greys naturally while nourishing your scalp and improving overall
              hair health.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IngredientsSection;