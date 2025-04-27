import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { FaSearch } from "react-icons/fa";

type Restaurant = {
  _id: string;
  name: string;
  address?: string;
  image?: string;
  available: boolean;
};

const apiBase = import.meta.env.VITE_API_BASE;

const RestaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          `${apiBase}/api/restaurants`
        );
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredRestaurants(restaurants);
    } else {
      setFilteredRestaurants(
        restaurants.filter((restaurant) =>
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, restaurants]);

  if (loading) {
    return (
      <div className="text-center text-gray-700 mt-10 text-lg font-medium">
        Loading restaurants...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
            🍴 Discover Our Restaurants
          </h1>

          {/* Search Bar */}
          <div className="mb-8 flex justify-end">
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Search restaurants"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <FaSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>

          {filteredRestaurants.length === 0 ? (
            <p className="text-center text-gray-500">No restaurants found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 font-sans">
              {filteredRestaurants.map((restaurant) => (
                <div
                  key={restaurant._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <img
                    src={`${apiBase}/uploads/${restaurant.image}`}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5 text-gray-700 flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-800 tracking-tight">
                        {restaurant.name}
                      </h2>
                      <span
                        className={`text-sm font-medium px-3 py-1 rounded-full ${
                          restaurant.available
                            ? "bg-green-100 text-green-600  animate-bounce"
                            : "bg-red-100 text-red-500 animate-pulse"
                        }`}
                      >
                        {restaurant.available ? "Open" : "Closed"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500">
                      {restaurant.address || "Address not available."}
                    </p>

                    <div className="flex justify-end pt-1">
                      <a
                        href={`/restaurants/${restaurant._id}`}
                        className="text-sm font-medium text-amber-900 hover:text-amber-700 transition-colors duration-200"
                      >
                        View Menu →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RestaurantList;
