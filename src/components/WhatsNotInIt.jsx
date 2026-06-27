import React from 'react';

const ingredients = ["Ammonia", "PPD", "Peroxide", "Parabens", "Sulphates"];

const WhatsNotInIt = () => {
  return (
    <section className="bg-[#0b2619] py-10 px-4">
      <div className="custom-container mx-auto text-center">
        {/* Subtitle */}
        <h3 className="text-[#a8a8a8] text-xs uppercase tracking-[0.2em] font-semibold mb-8">
          What's not in it
        </h3>

        {/* Ingredients List */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {ingredients.map((item) => (
            <div key={item} className="relative">
              <span className="text-white text-xl md:text-2xl font-serif">
                {item}
              </span>[]
              {/* Strike-through line */}
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[#d4af37] transform -translate-y-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatsNotInIt;