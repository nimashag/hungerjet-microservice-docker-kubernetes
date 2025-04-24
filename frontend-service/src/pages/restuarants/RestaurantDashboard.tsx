import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./RestaurantAdminLayout";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { Dialog, Transition } from "@headlessui/react";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";

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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    image: null as File | null,
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    address: "",
    available: false,
    image: null as File | null,
  });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      Swal.fire("Validation Error", "Restaurant name is required.", "warning");
      return;
    }
  
    if (!form.address.trim()) {
      Swal.fire("Validation Error", "Address is required.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("address", form.address);
    if (form.image) formData.append("image", form.image);

    try {
      const res = await axios.post(`${API_BASE}/api/restaurants`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setRestaurant(res.data);
      setIsCreateOpen(false);
      Swal.fire("Success!", "Restaurant created successfully!", "success");
    } catch (err) {
      console.error("Creation failed:", err);
      Swal.fire("Error", "Failed to create restaurant.", "error");
    }
  };

  const openEditModal = () => {
    if (!restaurant) return;
    setEditForm({
      name: restaurant.name,
      address: restaurant.address,
      image: null,
      available: restaurant.available,
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant) return;

    if (!editForm.name.trim()) {
      Swal.fire("Validation Error", "Restaurant name is required.", "warning");
      return;
    }
  
    if (!editForm.address.trim()) {
      Swal.fire("Validation Error", "Address is required.", "warning");
      return;
    }
    
    const formData = new FormData();
    formData.append("name", editForm.name);
    formData.append("address", editForm.address);
    formData.append("available", String(editForm.available));
    if (editForm.image) {
      formData.append("image", editForm.image);
    }

    try {
      const res = await axios.put(
        `${API_BASE}/api/restaurants/${restaurant._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setRestaurant(res.data);
      setIsEditOpen(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDeleteRestaurant = async () => {
    if (!restaurant) return;

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete your restaurant!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_BASE}/api/restaurants/${restaurant._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRestaurant(null);
        Swal.fire("Deleted!", "Your restaurant has been deleted.", "success");
      } catch (err) {
        console.error("Delete failed:", err);
        Swal.fire("Error", "Failed to delete restaurant.", "error");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient from-gray-50 to-gray-200 p-4">
        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-10 space-y-6">
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
                onClick={handleDeleteRestaurant}
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

                  <div className="flex flex-col items-center gap-2">
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

          {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {!restaurant && (
              <button
                onClick={() => setIsCreateOpen(true)}
                className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl transition shadow-md"
              >
                ➕ Create Restaurant
              </button>
            )}
          </div> */}
          <div className="grid  gap-4">
            {!restaurant && (
              <button
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 hover:from-green-500 hover:via-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Create Restaurant
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Create Restaurant Modal */}
      <Transition appear show={isCreateOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsCreateOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-purple-600"
                  >
                    Create New Restaurant
                  </Dialog.Title>
                  <form
                    className="mt-4 space-y-4"
                    onSubmit={handleCreateRestaurant}
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Restaurant Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={form.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Image
                      </label>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 mt-1 text-gray-700"
                      />
                    </div>
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                      >
                        Submit
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCreateOpen(false)}
                        className="ml-3 px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Modal */}
      <Dialog
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 space-y-4">
            <Dialog.Title className="text-xl font-bold">
              Edit Restaurant
            </Dialog.Title>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter restaurant name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm({ ...editForm, address: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter address"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      image: e.target.files?.[0] || null,
                    })
                  }
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.available}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          available: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-green-400 relative transition-all duration-300">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-full"></div>
                    </div>
                    <span className="ml-3 text-sm text-gray-700">
                      {editForm.available ? "Open" : "Closed"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Save Changes
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
