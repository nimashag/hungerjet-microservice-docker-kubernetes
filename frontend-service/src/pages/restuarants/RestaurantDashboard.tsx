// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:3001";

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  image?: string;
  available: boolean;
}

export const AdminDashboard: React.FC = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  if (token) {
    console.log("Token being sent:", token);
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log(payload);
  } else {
    console.warn("No token found in localStorage");
  }

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/restaurants/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched restaurant(s):", res.data);
        setRestaurant(res.data[0]);
      } catch (err) {
        console.error("No restaurant found or error:", err);
      }
    };

    fetchRestaurant();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login/restaurant");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-4">🍽️ Admin Dashboard</h1>

        <div className="mb-6">
          {restaurant ? (
            <div>
              <h2 className="text-xl font-semibold mb-2">Your Restaurant</h2>
              <p>
                <strong>Name:</strong> {restaurant.name}
              </p>
              <p>
                <strong>Address:</strong> {restaurant.address}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {restaurant.available ? "Open ✅" : "Closed ❌"}
              </p>
              {restaurant.image && (
                <img
                  src={`http://localhost:3001/uploads/${restaurant.image}`}
                  alt="restaurant"
                  className="mt-8 w-70 rounded-lg"
                />
              )}
            </div>
          ) : (
            <p>No restaurant created yet.</p>
          )}
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {!restaurant && (
            <button
              onClick={() => navigate("/create-restaurant")}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl transition"
            >
              ➕ Create Restaurant
            </button>
          )}

          {restaurant && (
            <>
              <button
                onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl transition"
              >
                🛠️ Manage Restaurant
              </button>
              <button
                onClick={() =>
                  navigate(`/restaurant/${restaurant._id}/menu/add`)
                }
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-xl transition"
              >
                🍽️ Add Menu Item
              </button>
              <button
                onClick={() => navigate(`/restaurant/${restaurant._id}/menu`)}
                className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-xl transition"
              >
                📋 View All Menu Items
              </button>
            </>
          )}
        </div>

        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
