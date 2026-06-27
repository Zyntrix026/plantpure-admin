import React, { useState } from 'react';

const faqData = [
  { q: "Is PlantPure completely natural?", a: "PlantPure uses carefully selected herbal ingredients including Henna Powder, Indigo Powder and Hibiscus Oil." },
  { q: "Does it contain ammonia or peroxide?", a: "No. PlantPure is free from Ammonia, PPD and Peroxide." },
  { q: "Will it help cover grey hair?", a: "Yes. It is designed to provide natural-looking grey coverage." },
  { q: "Is it suitable for sensitive scalp?", a: "The herbal formulation is gentle and free from many harsh chemical ingredients commonly found in synthetic colors, Thus it is suitable for people having skin allergies ." },
  { q: "Can I use it regularly?", a: "Yes. Many customers have been using PlantPure products for years as part of their regular hair care routine." },
  { q: "Do you deliver across India?", a: "Yes. PlantPure products are available for delivery across India." }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-10 bg-[#f7f9f2] px-4">
      <div className="custom-container mx-auto max-w-6xl">
        {/* Header */}
        <h2 className="text-3xl font-bold text-[#1a3c26] text-center mb-10">
          Questions, answered.
        </h2>

        {/* Accordion */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button 
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-[#1a3c26]"
              >
                {item.q}
                <span className={`transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              
              {/* Answer Toggle */}
              {openIndex === index && (
                <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;