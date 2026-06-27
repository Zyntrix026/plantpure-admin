import React from 'react';
import Plant2 from '../assets/Plant2.png';
const testimonials = [
  {
    name: "Nuty Ghai",
    text: "I love the Henna Kit with Indigo Powder and Hibiscus Oil. I have been using it for many years and it hashelped with hair growth, texture, shine and overall hair quality improvement."
  },
  {
    name: "Ambika Agarwal",
    text: "My hair look and feel young and bouncy.I have been using Plant Pure for 5 years now. Earlier I experienced hair fall, which stopped after regular use. My hair now look and feel young and bouncy"
  },
  {
    name: "Vinita Jawahar",
    text: "Completely herbal and chemical-free Have been using it for several years. I can confidently say it is herbal and free from chemicals. I am extremely satisfied with both the product and service."
  },
  {
    name: "Palki Jain",
    text: "My hair became black, soft and healthy I tried Henna and Indigo after a lot of hesitation. The results surprised me. My hair became beautifully black, soft and healthy looking."
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-[#f7f9f2]">
      <div className="custom-container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Content & Testimonial Cards */}
          <div className="space-y-8">
            <div>
              <h4 className="text-[#2d6a4f] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                Real Results
              </h4>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1a3c26] leading-tight">
                Loved By Customers Across India
              </h2>
            </div>

            <div className="space-y-4">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <div className="text-yellow-400 mb-2">★★★★★</div>
                  <p className="text-gray-700 italic text-sm mb-3">"{t.text}"</p>
                  <p className="text-[#1a3c26] font-bold text-xs">— {t.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative">
            <div className="aspect-square lg:aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl">
              <img 
                src={Plant2} 
                alt="Happy customer" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Rating Badge */}
            <div className="absolute top-6 right-6 bg-white px-5 py-3 rounded-2xl shadow-lg border border-gray-100">
              <p className="text-xl font-bold text-[#1a3c26]">4.9★</p>
              <p className="text-[10px] text-gray-500 font-medium">on 5000+ reviews</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;