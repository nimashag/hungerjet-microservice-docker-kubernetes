import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

type Restaurant = {
  _id: string;
  name: string;
  description?: string;
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
      <div className="text-center text-gray-700 mt-10">
        Loading restaurants...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Our Restaurants
        </h1>

        {restaurants.length === 0 ? (
          <p className="text-center text-gray-600">No restaurants found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={`http://localhost:3001/uploads/${restaurant.image}`}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {restaurant.name}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {restaurant.description || "No description available."}
                  </p>
                  <p className="text-gray-500 mt-1">
                    {restaurant.address || "Address not provided."}
                  </p>
                  <a
                    href={`/restaurants/${restaurant._id}`}
                    className="inline-block mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    View Menu &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default RestaurantList;
