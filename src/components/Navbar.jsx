import React from 'react';
import Logo from '../assets/Logo.png';
const Header = () => {
  return (
    <header className="w-full">
      {/* Top Announcement Bar */}
      {/* Container is used here to center text, no horizontal padding */}
      <div className="bg-[#1a3c26] text-white text-xs md:text-sm py-2">
        <div className="custom-container mx-auto text-center">
          🌿 ₹100 OFF for your First Order and Free Delivery
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-[#f7f9f2] py-4">
        {/* Container centers content, horizontal padding removed from the container class */}
        <div className="custom-container mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {/* <div className="bg-[#1a3c26] text-white p-2 rounded-full">
              <span className="text-xl">🌿</span>
            </div> */}
            <img src={Logo} alt="PlantPure Logo" className="h-20 w-20" />
          
          </div>

          {/* Contact and Shop Button */}
          <div className="flex items-center gap-6">
            <a 
              href="tel:+91 96259 82035" 
              className="hidden sm:flex items-center gap-2 text-[#2d6a4f] font-medium hover:text-[#1a3c26] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +91  96259 82035
            </a>
            
            <button className="bg-[#2d6a4f] hover:bg-[#1a3c26] text-white px-6 py-2 rounded-full font-medium transition-all shadow-md">
              Shop Now
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;