import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./RestaurantAdminLayout";

interface Restaurant {
  _id: string;
  name: string;
}

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  _id: string;
  customerName: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

const RestaurantOrders = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurant = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3001/api/restaurants/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRestaurant(response.data[0]);
    } catch (error) {
      console.error("Error fetching restaurant:", error);
    }
  };

  const fetchOrders = async (restaurantId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3002/api/orders/restaurant/${restaurantId}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchRestaurant();
    };
    init();
  }, []);

  useEffect(() => {
    if (restaurant?._id) {
      fetchOrders(restaurant._id);
    }
  }, [restaurant]);

  const toggleOrderStatus = async (orderId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "Pending" ? "Confirmed" : "Pending";
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3002/api/orders/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update orders state locally
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-center mb-10">
          Customer Orders
        </h1>
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-3">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-neutral-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Order Status
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-neutral-800">
              {orders.map((order) => (
                <tr key={order._id} className="border-t">
                  <td className="px-6 py-4 font-medium text-neutral-800">
                    {order._id}
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-600">
                    {order.items.map((item, index) => (
                      <div key={index}>{item.name}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4  font-medium text-neutral-600">
                    {order.items.map((item, index) => (
                      <div key={index}>{item.quantity}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-600">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-600">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-md font-medium ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-600">
                    <button
                      onClick={() => toggleOrderStatus(order._id, order.status)}
                    //   disabled={order.status === "Confirmed"}
                      className={`flex items-center gap-2 px-4 py-1 rounded-full text-sm font-medium transition duration-300 ${
                        order.status === "Pending"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-200 text-green-800 cursor-default"
                      }`}
                    >
                      {order.status === "Pending" ? (
                        <>
                          ⌛ Pending
                        </>
                      ) : (
                        <>
                          ✅ Confirmed
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="p-6 text-center text-sm text-neutral-500">
              No orders found.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default RestaurantOrders;
