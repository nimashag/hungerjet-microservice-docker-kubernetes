import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { FaShoppingCart } from "react-icons/fa";

type MenuItem = {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
};

const apiBase = import.meta.env.VITE_API_BASE;

const RestaurantMenu: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(
          `${apiBase}/api/restaurants/${restaurantId}/menu-items`
        );
        const items: MenuItem[] = response.data;
        setMenuItems(items);
        setFilteredItems(items);

        const uniqueCategories = Array.from(
          new Set(items.map((item) => item.category))
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) fetchMenuItems();
  }, [restaurantId]);

  useEffect(() => {
    filterMenuItems();
  }, [searchTerm, selectedCategories, menuItems]);

  const filterMenuItems = () => {
    let filtered = [...menuItems];

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.category)
      );
    }

    setFilteredItems(filtered);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleAddToCart = (item: MenuItem) => {
    alert(`🛒 ${item.name} added to cart!`);
  };

  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
            🍽️ Our Menu
          </h1>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar */}
            <div className="lg:w-1/4 w-full">
              <div className="border border-gray-200 rounded-xl p-5 shadow-sm bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Filters
                </h2>
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center space-x-2 text-sm text-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="form-checkbox text-blue-600"
                      />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Menu List */}
            <div className="lg:w-3/4 w-full">
              {loading ? (
                <p className="text-center text-gray-500 text-lg">
                  Loading menu...
                </p>
              ) : filteredItems.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">
                  No items found.
                </p>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 font-[Inter] text-[#2E2E2E]">
                  {filteredItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                    >
                      <img
                        src={`${apiBase}/uploads/${item.image}`}
                        alt={item.name}
                        className="w-full h-52 object-cover rounded-t-2xl"
                      />
                      <div className="p-5 flex flex-col justify-between space-y-4">
                        <div>
                          <h2 className="text-xl text-center font-semibold text-[#222] mb-1">
                            {item.name}
                          </h2>
                          <hr className="border-t border-gray-200 mb-3" />
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <span className="text-sm text-gray-400 italic">
                            {item.category}
                          </span>
                          <span className="text-base font-bold text-amber-800">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>

                        <div className="pt-3 flex justify-end">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400"
                          >
                            <span className="relative px-6 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent flex items-center gap-2">
                              <FaShoppingCart /> Add to Cart
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RestaurantMenu;
