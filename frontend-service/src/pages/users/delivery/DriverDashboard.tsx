import DriverLayout from "./DriverLayout.tsx";
import { useEffect, useState } from "react";
import axios from "axios";

const DriverDashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);

  const API_BASE = 'http://localhost:3000';

  useEffect(() => {
    const fetchAssignedOrders = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/delivery/assigned-orders`);
        setOrders(res.data);
      } catch (error) {
        console.error('Error fetching orders', error);
      }
    };
    fetchAssignedOrders();
  }, []);

  const handleResponse = async (orderId: string, action: 'accept' | 'decline') => {
    try {
      await axios.post(`${API_BASE}/api/delivery/respond`, { orderId, action });
      setOrders((prev) => prev.filter((order) => order.orderId !== orderId));
    } catch (error) {
      console.error('Error responding to assignment', error);
    }
  };

  return (
    <DriverLayout>
      <h2 className="text-2xl font-bold mb-4">Assigned Orders</h2>
      {orders.length === 0 ? (
        <p>No assigned orders.</p>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded shadow">
              <p><strong>Restaurant:</strong> {order.restaurantLocation}</p>
              <p><strong>Delivery:</strong> {order.deliveryLocation}</p>
              <p><strong>Status:</strong> {order.status}</p>

              <div className="flex gap-4 mt-4">
                <button onClick={() => handleResponse(order.orderId, 'accept')} className="bg-green-500 text-white p-2 rounded">Accept</button>
                <button onClick={() => handleResponse(order.orderId, 'decline')} className="bg-red-500 text-white p-2 rounded">Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DriverLayout>
  );
};

export default DriverDashboard;
