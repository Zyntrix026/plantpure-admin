import React from 'react';

const Hero = () => {
  return (
    <section className="bg-[#f7f9f2] py-12 md:py-15">
      <div className="custom-container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          {/* Left Column: Content */}
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-green-100 shadow-sm">
              <span className="text-sm font-medium text-[#1a3c26]">✨ TRUSTED BY 5000+ WOMEN IN JAPAN</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-[#1a3c26] leading-tight">
              Cover your greys.<br />
              <span className="italic text-[#2d6a4f]">Naturally.</span>
            </h1>
            
            <p className="text-lg text-gray-700 max-w-lg">
              A 100%  chemical-free hair coloring kit made with <strong>Henna, Indigo & Hibiscus Oil</strong>. 
              Rich color, less hair fall, real shine — without ammonia, PPD or peroxide.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button className="bg-[#1a3c26] hover:bg-[#2d6a4f] text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg">
                Order Your Kit — ₹900
              </button>
              <button className="border border-[#1a3c26] text-[#1a3c26] px-8 py-4 rounded-full font-semibold hover:bg-white transition-all">
                How It Works
              </button>
            </div>

            <div className="flex flex-wrap gap-6 text-[#1a3c26] font-medium pt-4">
              <span className="flex items-center gap-2">Henna Powder</span>
              <span className="flex items-center gap-2">Indigo Powder</span>
              <span className="flex items-center gap-2">Hibiscus Oil</span>
            </div>
          </div>

          {/* Right Column: Image & Badge */}
          <div className="flex-1 relative w-full">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {/* Replace with your product image URL */}
              <img 
                src="https://plantpure.in/wp-content/uploads/2025/10/IMG20251027142920-compressed.png" 
                alt="Hair coloring kit" 
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Trust Badge */}
            <div className="absolute -bottom-6 md:-left-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#1a3c26] border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-[#2d6a4f] border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-[#40916c] border-2 border-white"></div>
              </div>
              <div>
                <div className="flex text-yellow-400">★★★★★</div>
                <p className="text-sm font-bold text-gray-800">5000+ happy customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;