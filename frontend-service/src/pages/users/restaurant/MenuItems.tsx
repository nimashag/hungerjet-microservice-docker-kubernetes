import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./RestaurantAdminLayout";
import { Pencil, Trash2, PlusCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image?: string;
}

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  image?: string;
  available: boolean;
}

const apiBase = import.meta.env.VITE_API_BASE;

const MenuItems = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<{
    name: string;
    description: string;
    category: string;
    price: number;
    imageFile?: File;
  }>({
    name: "",
    description: "",
    category: "",
    price: 0,
  });

  const navigate = useNavigate();

  const fetchRestaurant = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${apiBase}/api/restaurants/my`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRestaurant(response.data[0]);
    } catch (error) {
      console.error("Error fetching restaurant:", error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${apiBase}/api/restaurants/my/menu-items`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMenuItems(response.data);
      setFilteredItems(response.data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurant();
    fetchMenuItems();
  }, []);

  useEffect(() => {
    const filtered = menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        !filterCategory || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredItems(filtered);
  }, [search, filterCategory, menuItems]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(e.target.value);
  };

  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  );

  const handleCreateSubmit = async () => {
    // Validation
    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.category.trim()
    ) {
      Swal.fire("Validation Error", "All fields are required.", "warning");
      return;
    }

    if (!form.imageFile) {
      Swal.fire("Validation Error", "Image is required.", "warning");
      return;
    }

    if (isNaN(form.price) || form.price <= 0) {
      Swal.fire(
        "Validation Error",
        "Price must be a valid positive number.",
        "warning"
      );
      return;
    }

    // Check if restaurant is available
    if (!restaurant) {
      Swal.fire("Error", "Restaurant information is not available.", "error");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("price", form.price.toString());
    formData.append("image", form.imageFile);

    try {
      const res = await axios.post(
        `${apiBase}/api/restaurants/${restaurant._id}/menu-items`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await fetchMenuItems();
      Swal.fire("Success!", "Menu item created successfully!", "success");
      setShowCreateModal(false);
      setForm({ name: "", category: "", description: "", price: 0 });
    } catch (err) {
      console.error("Create error:", err);
      Swal.fire("Error", "Failed to create menu item", "error");
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await MySwal.fire({
      title: "Are you sure?",
      text: "This item will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${apiBase}/api/restaurants/my/menu-items/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMenuItems(menuItems.filter((item) => item._id !== id));
        Swal.fire("Deleted!", "Menu item has been deleted.", "success");
      } catch (err) {
        console.error("Error deleting item:", err);
        Swal.fire("Error", "Could not delete item.", "error");
      }
    }
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
    });
  };

  const handleEditSubmit = async () => {
    if (!editingItem) return;

    // Basic validation
    if (!form.name.trim()) {
      Swal.fire("Validation Error", "Name is required.", "warning");
      return;
    }
    if (!form.description.trim()) {
      Swal.fire("Validation Error", "Description is required.", "warning");
      return;
    }
    if (!form.category.trim()) {
      Swal.fire("Validation Error", "Category is required.", "warning");
      return;
    }
    if (isNaN(form.price) || form.price <= 0) {
      Swal.fire(
        "Validation Error",
        "Price must be a positive number.",
        "warning"
      );
      return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("price", form.price.toString());

    if (form.imageFile) {
      formData.append("image", form.imageFile);
    }

    try {
      await axios.put(
        `${apiBase}/api/restaurants/my/menu-items/${editingItem._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMenuItems((prev) =>
        prev.map((item) =>
          item._id === editingItem._id ? { ...item, ...form } : item
        )
      );

      await fetchMenuItems();
      Swal.fire("Updated!", "Menu item has been updated.", "success");
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating item:", error);
      Swal.fire("Error", "Could not update item.", "error");
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) return <div>Loading menu items...</div>;

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Restaurant Menu-Items
        </h1>
        <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-primary text-green-600 px-6 py-3 text-lg rounded-xl hover:bg-primary/90 transition whitespace-nowrap"
          >
            <PlusCircle size={18} />
            Create Menu Item
          </button>

          <div className="flex items-center gap-4">
            {/* Search input with icon */}
            <div className="relative w-[220px]">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-10 p-2 border border-neutral-300 rounded-xl focus:outline-none"
              />
            </div>

            {/* Filter select */}
            <select
              value={filterCategory}
              onChange={handleCategoryFilter}
              className="p-2 border border-neutral-300 rounded-xl min-w-[160px]"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-3">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-600">
                  Image
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-600">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-600">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-600">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-600">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredItems.map((item) => (
                <tr key={item._id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    {item.image ? (
                      <img
                        src={`${apiBase}/uploads/${item.image}`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-neutral-200 rounded"></div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-neutral-800">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {item.category}
                  </td>
                  <td className="px-4 py-3 text-neutral-600 ">
                    {item.description}
                  </td>
                  <td className="px-4 py-3 font-medium text-primary">
                    ${item.price}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {menuItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-neutral-500">
                    No menu items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-semibold mb-4">Edit Menu Item</h2>

              <div className="mb-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleFormChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      imageFile: e.target.files ? e.target.files[0] : undefined,
                    }))
                  }
                  className="w-full"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingItem(null)}
                  className="bg-neutral-300 px-4 py-2 rounded hover:bg-neutral-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-semibold mb-4">Create Menu Item</h2>

              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleFormChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      imageFile: e.target.files ? e.target.files[0] : undefined,
                    }))
                  }
                  className="w-full"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="bg-neutral-300 px-4 py-2 rounded hover:bg-neutral-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSubmit}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MenuItems;
