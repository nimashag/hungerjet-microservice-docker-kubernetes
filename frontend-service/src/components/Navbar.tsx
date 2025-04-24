import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBars, FaTimes, FaSearch, FaUser, FaShoppingCart } from "react-icons/fa";

const Navbar: React.FC = () => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [signup, setSignup] = useState<boolean>(false);
  const [login, setLogin] = useState<boolean>(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isUserDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, []);

  const toggleSignup = () => {
    setSignup((prev) => !prev);
    setUserDropdownOpen(false);
  };

  const toggleLogin = () => {
    setLogin((prev) => !prev);
    setUserDropdownOpen(false);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    location.reload();
  };

  return (
    <div className="flex items-center justify-between px-6 sm:px-10 py-3 bg-white shadow-md font-medium relative z-30">
      {/* Logo */}
      <motion.div
        className="text-2xl font-bold text-[#FF5722] cursor-pointer"
        whileHover={{ scale: 1.1 }}
      >
        HungerJet
      </motion.div>

      {/* Desktop Nav Links */}
      <ul className="hidden sm:flex gap-8 text-sm text-[#4E342E]">
        {[
          { to: "/", text: "Home" },
          { to: "/newarrivals", text: "Restaurants" },
          { to: "/about", text: "About Us" },
          { to: "/contactus", text: "Contact Us" },
          { to: "/faqs", text: "FAQs" },
        ].map((item, index) => (
          <motion.li key={index} whileHover={{ scale: 1.1, y: -2 }}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `hover:text-[#FF5722] transition-colors duration-200 ${
                  isActive ? "text-[#FF5722] font-semibold" : ""
                }`
              }
            >
              {item.text}
            </NavLink>
          </motion.li>
        ))}
      </ul>

      {/* Icons */}
      <div className="flex items-center gap-4">
        <motion.button whileHover={{ scale: 1.2 }} className="text-[#4E342E] hover:text-[#FF7043]">
          <FaSearch size={18} />
        </motion.button>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.2 }}
            className="text-[#4E342E] hover:text-[#FF7043]"
            onClick={toggleUserDropdown}
          >
            <FaUser size={18} />
          </motion.button>
          {isUserDropdownOpen && (
            <motion.div
              className="absolute right-0 mt-3 w-44 bg-white shadow-lg rounded-md py-2 px-4 z-40"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {!isLogged ? (
                <div className="flex flex-col gap-2">
                  <p className="cursor-pointer hover:text-[#FF5722]" onClick={toggleSignup}>
                    Signup
                  </p>
                  <p className="cursor-pointer hover:text-[#FF5722]" onClick={toggleLogin}>
                    Login
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/profile" className="hover:text-[#FF5722]">
                    My Profile
                  </Link>
                  <Link to="/order/pendingOrder" className="hover:text-[#FF5722]">
                    My Orders
                  </Link>
                  <p className="cursor-pointer hover:text-[#FF5722]" onClick={logout}>
                    Logout
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        <Link to="/cart">
          <motion.button whileHover={{ scale: 1.2 }} className="text-[#4E342E] hover:text-[#FF7043]">
            <FaShoppingCart size={20} />
          </motion.button>
        </Link>

        {/* Hamburger Icon */}
        <motion.button
          onClick={toggleMobileMenu}
          whileHover={{ scale: 1.2 }}
          className="sm:hidden text-[#4E342E] hover:text-[#FF7043]"
        >
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          className="absolute top-16 left-0 w-full bg-white shadow-md py-5 z-20 sm:hidden"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
        >
          <ul className="flex flex-col items-center gap-4 text-[#4E342E]">
            {[
              { to: "/", text: "Home" },
              { to: "/newarrivals", text: "New Arrivals" },
              { to: "/products", text: "Menu" },
              { to: "/reviews", text: "Reviews" },
              { to: "/about", text: "About Us" },
              { to: "/contactus", text: "Contact Us" },
              { to: "/faqs", text: "FAQs" },
            ].map((item, index) => (
              <li key={index} onClick={() => setMobileMenuOpen(false)}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `hover:text-[#FF5722] ${
                      isActive ? "text-[#FF5722] font-semibold" : ""
                    }`
                  }
                >
                  {item.text}
                </NavLink>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Navbar;
