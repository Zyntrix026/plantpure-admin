import React from 'react';

const FormSection = ({ selectedProduct }) => {
  return (
    <section
      id="contact-form"
      className="py-10 bg-[#f7f9f2]"
    >
      <div className="custom-container mx-auto">
        <div className="max-w-6xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#1a3c26] mb-2">
              Get in touch
            </h2>

            <p className="text-gray-500 text-sm">
              Fill in the details below and we will get back to you shortly.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5">

            <div>
              <label className="block text-xs font-bold text-[#1a3c26] uppercase tracking-wider mb-1">
                Name
              </label>

              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1a3c26] uppercase tracking-wider mb-1">
                Email
              </label>

              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1a3c26] uppercase tracking-wider mb-1">
                Phone
              </label>

              <input
                type="tel"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] transition-all"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1a3c26] uppercase tracking-wider mb-1">
                Address
              </label>

              <textarea
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] transition-all"
                placeholder="Enter your delivery address"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1a3c26] text-white py-4 rounded-xl font-bold hover:bg-[#2d6a4f] transition-colors mt-4"
            >
              Submit Details
            </button>

          </form>

        </div>
      </div>
    </section>
  );
};

export default FormSection;