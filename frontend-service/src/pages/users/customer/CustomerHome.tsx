// src/pages/Home.tsx

import React from "react";
// import { Button } from "@/components/ui/button";
import { FaPizzaSlice, FaUtensils, FaHamburger } from "react-icons/fa";

const Home: React.FC = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-orange-500 text-white px-6 md:px-16 py-12 rounded-b-[60px] relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Enjoy Delicious Meals <br /> with <span className="text-yellow-300">HungerJet</span>
            </h1>
            <p className="text-lg max-w-md">
              Fast, hot and tasty dishes delivered straight to your door.
              Order now and satisfy your hunger in just a few taps!
            </p>
            <button className="bg-white text-orange-500 font-bold px-6 py-3 hover:bg-yellow-300">
              Order Now
            </button>
          </div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3595/3595455.png"
            alt="Food"
            className="w-80 mt-10 md:mt-0"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-6 md:px-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Categories</h2>
        <div className="flex justify-center gap-6 flex-wrap">
          {[
            { icon: <FaHamburger />, label: "Fast Food" },
            { icon: <FaUtensils />, label: "Veg & Non-Veg" },
            { icon: <FaPizzaSlice />, label: "Pizza" },
            { icon: <FaPizzaSlice />, label: "Desserts" },
          ].map((cat, i) => (
            <div
              key={i}
              className="bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-full px-6 py-3 flex items-center gap-2 font-medium text-lg shadow"
            >
              {cat.icon}
              {cat.label}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 px-6 md:px-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {[
            "Choose Restaurant",
            "Select Dish",
            "Pay Online",
            "Enjoy Meal",
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                {i + 1}
              </div>
              <p className="text-lg font-semibold">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-12 px-6 md:px-16">
        <h2 className="text-3xl font-bold text-center mb-10">Popular Dishes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src={`https://source.unsplash.com/400x300/?food,meal,${i}`}
                alt="Dish"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-xl mb-2">Chicken Delight</h3>
                <p className="text-sm text-gray-600 mb-2">From $12.99</p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white w-full">
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Download App */}
      <section className="bg-orange-100 py-12 px-6 md:px-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Get HungerJet App</h2>
        <p className="mb-6 text-gray-700">
          Enjoy faster ordering and delivery experience on your mobile.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button className="bg-black text-white px-6 py-3">App Store</button>
          <button className="bg-green-500 text-white px-6 py-3">Play Store</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; 2025 HungerJet. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <a href="#" className="hover:underline">
              Terms
            </a>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
