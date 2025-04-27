import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./RestaurantAdminLayout";
import { Bar, Doughnut } from "react-chartjs-2";
import { Utensils, ClipboardList, CheckCircle, Clock } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

type Restaurant = {
  _id: string;
  name: string;
};

type MenuItem = {
  _id: string;
  name: string;
  category: string;
};

type Order = {
  _id: string;
  status: "confirmed" | "pending" | string;
  createdAt: string;
};

const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:31000"
const userUrl = import.meta.env.VITE_USER_URL || "http://localhost:31000";
const restaurantUrl = import.meta.env.VITE_RESTAURANT_URL || "http://localhost:31000";
const orderUrl = import.meta.env.VITE_ORDER_URL || "http://localhost:31000";
const deliveryUrl = import.meta.env.VITE_USER_URL|| " http://localhost:31000";

const RestaurantAnalytics = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        // Fetch restaurant by user ID
        const restaurantRes = await axios.get(`${restaurantUrl}/api/restaurants/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const restaurantData: Restaurant = restaurantRes.data[0];
        setRestaurant(restaurantData);

        // Fetch menu items by user ID
        const menuItemsRes = await axios.get(
          `${restaurantUrl}/api/restaurants/my/menu-items`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const menuItemsData: MenuItem[] = menuItemsRes.data;
        setMenuItems(menuItemsData);

        // Fetch orders by restaurant ID
        const ordersRes = await axios.get(
          `${orderUrl}/api/orders/restaurant/${restaurantData._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const ordersData: Order[] = ordersRes.data;
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate menu items by category
  const menuItemsByCategory = menuItems.reduce(
    (acc: Record<string, number>, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    },
    {}
  );

  // Calculate order statuses
  const confirmedOrders = orders.filter(
    (order) => order.status === "Confirmed"
  ).length;
  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;
  const WaitingForPickup = orders.filter(
    (order) => order.status === "Waiting for Pickup"
  ).length;

  // Calculate orders over time (monthly)
  const ordersByMonth = orders.reduce((acc: Record<string, number>, order) => {
    const month = new Date(order.createdAt).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for charts
  const menuCategoryData = {
    labels: Object.keys(menuItemsByCategory),
    datasets: [
      {
        label: "Menu Items by Category",
        data: Object.values(menuItemsByCategory),
        backgroundColor: [
          "#6366f1",
          "#22c55e",
          "#f97316",
          "#3b82f6",
          "#eab308",
        ],
      },
    ],
  };

  const ordersOverTimeData = {
    labels: Object.keys(ordersByMonth),
    datasets: [
      {
        label: "Orders Over Time",
        data: Object.values(ordersByMonth),
        backgroundColor: "#10b981",
        borderRadius: 6,
      },
    ],
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient from-gray-50 to-gray-200 p-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Restaurant Analytics
        </h1>

        {loading ? (
          <p className="text-gray-600">Loading data...</p>
        ) : (
          <>
            {/* Summary Cards */}
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              {/* Total Menu Items */}
              <div className="p-6 bg-white shadow rounded-xl flex flex-col items-center text-center">
                <div className="bg-blue-100 text-blue-600 rounded-full p-3 mb-4">
                  <Utensils className="w-6 h-6" />
                </div>
                <p className="text-sm text-gray-500">Total Menu Items</p>
                <h3 className="text-2xl font-bold text-blue-600">
                  {menuItems.length}
                </h3>
              </div>

              {/* Total Orders */}
              <div className="p-6 bg-white shadow rounded-xl flex flex-col items-center text-center">
                <div className="bg-indigo-100 text-indigo-600 rounded-full p-3 mb-4">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <h3 className="text-2xl font-bold text-indigo-600">
                  {orders.length}
                </h3>
              </div>

              {/* Confirmed Orders */}
              <div className="p-6 bg-white shadow rounded-xl flex flex-col items-center text-center">
                <div className="bg-green-100 text-green-600 rounded-full p-3 mb-4">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <p className="text-sm text-gray-500">Confirmed Orders</p>
                <h3 className="text-2xl font-bold text-green-600">
                  {confirmedOrders}
                </h3>
              </div>

              {/* Pending Orders */}
              <div className="p-6 bg-white shadow rounded-xl flex flex-col items-center text-center">
                <div className="bg-yellow-100 text-yellow-500 rounded-full p-3 mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <p className="text-sm text-gray-500">Pending Orders</p>
                <h3 className="text-2xl font-bold text-yellow-500">
                  {pendingOrders}
                </h3>
              </div>

              {/* Waiting for Pickup */}
              <div className="p-6 bg-white shadow rounded-xl flex flex-col items-center text-center">
                <div className="bg-yellow-100 text-yellow-500 rounded-full p-3 mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <p className="text-sm text-gray-500">Waiting for Pickup</p>
                <h3 className="text-2xl font-bold text-yellow-500">
                  {WaitingForPickup}
                </h3>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">
                  Menu Items by Category
                </h2>
                <Doughnut data={menuCategoryData} />
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">
                  Orders Over Time
                </h2>
                <Bar data={ordersOverTimeData} />
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default RestaurantAnalytics;
