import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

type Restaurant = {
  _id: string;
  name: string;
  address?: string;
  image?: string;
  available: boolean;
};

const RestaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/restaurants"
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

          {restaurants.length === 0 ? (
            <p className="text-center text-gray-500">No restaurants found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 font-sans">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <img
                    src={`http://localhost:3001/uploads/${restaurant.image}`}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5 text-gray-700 flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-800 tracking-tight">
                        {restaurant.name}
                      </h2>
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${
                          restaurant.available
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-500"
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
