import React from 'react';

const offers = [
    "Reduces Hair Fall by strengthening your roots.",
    "Deeply Nourishes the scalp for healthier hair.",

    "CRestores natural shine and softness.",
    "Cleanses gently without harsh chemicals."
];

const FinalOffer = () => {
    return (
        <section className="py-8 bg-[#f7f9f2] px-4">
            <div className="custom-container mx-auto">
                {/* Main Card: Reduced padding from p-16 to p-8 */}
                <div className="bg-gradient-to-br from-[#0b2619] to-[#1a3c26] rounded-[32px] p-6 md:p-12 text-center text-white shadow-xl">

                    {/* Limited Time Badge: Reduced mb */}
                    <div className="inline-block border border-[#d4af37]/30 rounded-full px-4 py-1 mb-6">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#d4af37]">
                            SPECIAL OFFER
                        </span>
                    </div>

                    {/* Heading: Reduced mb */}
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Cleansing & Nourishing Hair Cleanser</h2>

                    {/* Price: Reduced mb */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="text-2xl text-gray-400 line-through font-medium">₹680</span>
                        <span className="text-5xl font-bold text-[#d4af37]">₹340</span>
                    </div>

                    {/* Features List: Compact grid */}
                    <div className="grid grid-cols-1  md:grid-cols-2 gap-2 max-w-2xl mx-auto mb-8 text-left text-sm">
                        {offers.map((offer, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <span className="text-[#d4af37]">✓</span>
                                <span className="text-gray-200">{offer}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA Button: Adjusted padding for normal height */}
                    <button className="bg-[#d4af37] hover:bg-[#b8962c] text-[#0b2619] px-8 py-3 rounded-full font-bold text-base transition-all shadow-lg hover:shadow-xl mb-4">
                        Claim Offer — Order Now
                    </button>

                    {/* Secondary Link */}
                    <p className="text-gray-400 text-xs">
                        Or call <a href="tel:+919810999976" className="text-white hover:underline font-semibold">+91  96259 82035</a> to order
                    </p>
                </div>
            </div>
        </section>
    );
};

export default FinalOffer;