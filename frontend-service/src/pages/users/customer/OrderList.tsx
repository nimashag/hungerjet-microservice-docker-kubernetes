import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../../components/Navbar"; // adjust path if needed
import { useNavigate } from "react-router-dom";

interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  restaurantId: string;
  items: OrderItem[];
  status: string;
  totalAmount: number;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!token) {
          setError("Token missing.");
          return;
        }

        const res = await axios.get("http://localhost:3002/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
        setError("Failed to load orders. Try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-center">Loading orders...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-center text-red-500">{error}</div>
      </>
    );
  }

  if (orders.length === 0) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-center">No orders found.</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">📦 All Orders</h1>

        <div className="grid gap-6">
          {orders.map((order) => (
            <div
            key={order._id}
            className="relative bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === "Cancelled"
                    ? "bg-red-100 text-red-700"
                    : order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </span>
            </div>
          
            <div className="mb-4">
              <p><strong>Restaurant ID:</strong> {order.restaurantId}</p>
              <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
            </div>
          
            <div className="mb-4">
              <h3 className="font-semibold">Items:</h3>
              <ul className="list-disc list-inside ml-4">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} (x{item.quantity}) - ${item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          
            <div className="mb-4">
              <h3 className="font-semibold">Delivery Address:</h3>
              <p>
                {order.deliveryAddress?.street}, {order.deliveryAddress?.city},{" "}
                {order.deliveryAddress?.state} {order.deliveryAddress?.zipCode},{" "}
                {order.deliveryAddress?.country}
              </p>
            </div>
          
            <p className="text-sm text-gray-500">
              Ordered on: {new Date(order.createdAt).toLocaleString()}
            </p>
          
            {/* 🟣 Add Purple Button If Pending */}
            {order.status === "Pending" && (
              <button
                onClick={() => navigate(`/order/${order._id}`)}
                className="absolute bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg transition"
              >
                ➔
              </button>
            )}
          </div>
          
          ))}
        </div>
      </div>
    </>
  );
};

export default OrderList;
