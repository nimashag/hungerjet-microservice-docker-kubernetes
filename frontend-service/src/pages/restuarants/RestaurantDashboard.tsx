import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./RestaurantAdminLayout";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { Dialog } from "@headlessui/react";

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
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", address: "", image: null as File | null });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/restaurants/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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

  const openEditModal = () => {
    if (!restaurant) return;
    setEditForm({ name: restaurant.name, address: restaurant.address, image: null });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant) return;

    const formData = new FormData();
    formData.append("name", editForm.name);
    formData.append("address", editForm.address);
    if (editForm.image) {
      formData.append("image", editForm.image);
    }

    try {
      const res = await axios.put(`${API_BASE}/api/restaurants/${restaurant._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setRestaurant(res.data);
      setIsEditOpen(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient from-gray-50 to-gray-200 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-10 space-y-6">
          <div className="flex items-center justify-between flex-wrap">
            <h1 className="text-3xl font-bold text-gray-800">
              🍽️ Restaurant Details
            </h1>
            <div className="flex gap-4 mt-4 md:mt-0">
              <button
                onClick={openEditModal}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-2 rounded-full shadow-sm transition flex items-center justify-center text-xl"
                title="Edit"
              >
                <LuPencil />
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded-full shadow-sm transition flex items-center justify-center text-xl"
                title="Delete"
              >
                <LuTrash2 />
              </button>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            {restaurant ? (
              <div className="space-y-4">
                {/* <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  🍴 Restaurant Details
                </h2> */}
                {restaurant.image && (
                  <img
                    src={`http://localhost:3001/uploads/${restaurant.image}`}
                    alt="restaurant"
                    className="rounded-2xl w-full max-w-full object-cover shadow-md"
                  />
                )}

                <div className="text-center text-gray-800 space-y-4">
                  <div>
                    {/* <span className="block text-base text-gray-500 font-medium">
                      Name
                    </span> */}
                    <h2 className="text-4xl font-bold text-blue-800 tracking-wide">
                      {restaurant.name}
                    </h2>
                  </div>

                  <div>
                    {/* <span className="block text-base text-gray-500 font-medium">
                      Address
                    </span> */}
                    <p className="text-xl font-bold text-blue-800 italic">
                      {restaurant.address}
                    </p>
                  </div>

                  <div>
                    {/* <span className="block text-base text-gray-500 font-medium">
                      Status
                    </span> */}
                    {restaurant.available ? (
                      <span className="inline-block bg-green-100 text-green-700 font-semibold px-4 py-1 rounded-full text-lg shadow-sm animate-pulse">
                        ✅ Open
                      </span>
                    ) : (
                      <span className="inline-block bg-red-100 text-red-600 font-semibold px-4 py-1 rounded-full text-lg shadow-sm animate-pulse">
                        ❌ Closed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 italic">No restaurant created yet.</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {!restaurant && (
              <button
                onClick={() => navigate("/create-restaurant")}
                className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl transition shadow-md"
              >
                ➕ Create Restaurant
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 space-y-4">
            <Dialog.Title className="text-xl font-bold">Edit Restaurant</Dialog.Title>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block font-medium">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Address</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.files?.[0] || null })}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 bg-gray-300 rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Save
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminDashboard;
