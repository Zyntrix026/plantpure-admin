import React from "react";
const features = [
  {
    icon: "✨",
    title: "Henna Powder – 100gm",
    description: (
      <>
 Triple Filtered Henna Powder is a traditional Ayurvedic ingredient that naturally conditions hair, enhances texture and shine, and helps maintain a healthy scalp with its antifungal and antibacterial properties, supporting stronger and healthier hair growth.
      </>
    ),
  },
  {
    icon: "♥",
    title: "Indigo Powder – 100gm",
    description:
      "Helps provide rich natural color and effective grey coverage without chemical dyes. It enhances the appearance of thicker, fuller and more voluminous hair.",
  },
  {
    icon: "🍃",
    title: "Hibiscus Oil – 30ml",
    description:
      "Made with Hibiscus Flower Extract, Black Sesame Seed Oil, Fenugreek Seed Extract and Rose Oil. It deeply nourishes the scalp and hair while improving softness, shine and manageability.",
  },

  // New Cards
];

const Features = () => {
  return (
    <section className="py-12 bg-[#f7f9f2] px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h4 className="text-[#2d6a4f] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
            Why PlantPure
          </h4>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a3c26]">
            More than color. Real hair care.
          </h2>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
            >
              <div className="bg-[#fdf9e7] w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-[#1a3c26] mb-3">
                {feature.title}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;