import React from 'react';

const steps = [
  {
    number: "01",
    title: "Prepare The Henna Paste",
    description: "Mix 100gm Henna Powder with water to create a smooth, lump-free paste. Add PlantPure Hibiscus Oil to the mixture for enhanced nourishment and conditioning."
  },
  {
    number: "02",
    title: "Apply To Hair",
    description: "Apply PlantPure Hibiscus Oil to your hair and scalp. Then evenly apply the Henna paste from roots to ends, ensuring full coverage."
  },
  {
    number: "03",
    title: "Rinse & Prepare",
    description: "Rinse the Henna application thoroughly with water and gently dry your hair. This step helps condition the hair and prepares it for natural color enhancement."
  },
  {
    number: "04",
    title: "Prepare The Indigo Paste",
    description: "Mix Indigo Powder with water or Henna paste to create a smooth consistency. Blend well until the mixture is ready for application."
  },
  {
    number: "05",
    title: "Apply For Color",
    description: "Apply the Indigo mixture to the areas where grey coverage is required. Once completed, rinse thoroughly to reveal naturally rich, healthy-looking hair."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-12 bg-[#f7f9f2]">
      <div className="custom-container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h4 className="text-[#2d6a4f] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
            HOW IT WORKS
          </h4>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a3c26]">
            Salon-Like Results At Home
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col transition-transform hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl font-bold text-[#d8e2dc]">
                  {step.number}
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#1a3c26] mb-3">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-grow">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;