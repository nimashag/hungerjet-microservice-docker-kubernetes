// src/pages/OrderList.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  restaurantId: string;
  items: OrderItem[];
  status: string;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
};

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('You must be logged in to view your orders.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:3002/api/orders/user/current', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(res.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading orders...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="bg-white shadow-md rounded-xl p-6 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">Order ID: {order._id}</span>
              <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div className="mb-3">
              <p className="text-md font-semibold">Items:</p>
              <ul className="ml-4 list-disc">
                {order.items.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    {item.name} x {item.quantity} — ${item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm">Total: <span className="font-semibold">${order.totalAmount.toFixed(2)}</span></p>
            <p className="text-sm">Payment Method: {order.paymentMethod}</p>
            <p className="text-sm">Payment Status: {order.paymentStatus}</p>
            <p className="text-sm">Order Status: <span className="font-medium text-blue-600">{order.status}</span></p>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderList;
