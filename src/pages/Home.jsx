import React, { useState } from 'react';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WhatsNotInIt from '../components/WhatsNotInIt';
import Features from '../components/Features';
import IngredientsSection from '../components/IngredientsSection';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import ShopRange from '../components/ShopRange';
import FinalOffer from '../components/FinalOffer';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import FormSection from '../components/FormSection';

const Home = () => {
  const [selectedProduct, setSelectedProduct] = useState('');

  return (
    <div>
      <Navbar />
      <Hero />
      <WhatsNotInIt />
      <Features />
      <IngredientsSection />
      <HowItWorks />
      <Testimonials />

      {/* Product Section */}
      <ShopRange
        setSelectedProduct={setSelectedProduct}
      />

      <FinalOffer />

      {/* Form Section */}
      <FormSection
        selectedProduct={selectedProduct}
      />

      <FAQ />
      <Footer />
    </div>
  );
};

export default Home;