import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-16 text-[#4E342E]">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">
        
        {/* About Section */}
        <div>
          <h2 className="text-2xl font-bold text-[#FF5722] mb-4">HungerJet</h2>
          <p className="text-[#4E342E] leading-relaxed">
            HungerJet brings you the most delicious meals from your favorite restaurants, fast and fresh! Whether you're craving a cheesy pizza, a spicy biryani, or a sweet treat — we've got it delivered, hot and happy!
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-semibold text-[#FF5722] mb-4">Company</h3>
          <ul className="flex flex-col gap-2">
            <li><a href="/" className="hover:text-[#FF7043]">Home</a></li>
            <li><a href="/about" className="hover:text-[#FF7043]">About Us</a></li>
            <li><a href="/faqs" className="hover:text-[#FF7043]">FAQs</a></li>
            <li><a href="/contactus" className="hover:text-[#FF7043]">Contact Us</a></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold text-[#FF5722] mb-4">Get In Touch</h3>
          <ul className="flex flex-col gap-3 text-[#4E342E]">
            <li className="flex items-center gap-2">
              <FaPhone className="text-[#FF7043]" />
              <span>+94-423-987-83</span>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-[#FF7043]" />
              <span>support@hungerjet.com</span>
            </li>
            <li className="flex items-start gap-2">
              <FaMapMarkerAlt className="text-[#FF7043] mt-1" />
              <span>No. 45, High Level Road, Nugegoda, Colombo 10250, Sri Lanka</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider & Bottom Text */}
      <div className="border-t border-gray-200 text-center py-5 text-sm text-[#4E342E] font-medium">
        © 2025 HungerJet. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
