import { useEffect, useState } from 'react';
import axios from 'axios';
import OrderCard from '../../../components/OrderCard';

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  restaurantId: string;
  restaurantName?: string; // Optional if coming from backend
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

  const handlePayClick = (orderId: string) => {
    // Logic to initiate payment (e.g., redirect to a payment gateway)
    console.log(`Initiating payment for order: ${orderId}`);
  };

  if (loading) return <div className="text-center mt-10">Loading orders...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="flex space-x-6 mb-6">
              <div className="flex-1">
                <OrderCard
                  order={{
                    id: order._id,
                    items: order.items,
                    totalAmount: order.totalAmount,
                    restaurantName: order.restaurantName || 'Restaurant',
                  }}
                />
              </div>
              <div className="flex-none w-64 p-4 bg-gray-100 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Amount</span>
                    <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Payment Status</span>
                    <span
                      className={`font-semibold ${order.paymentStatus === 'Paid' ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="text-center">
                    {order.paymentStatus !== 'Paid' && (
                      <button
                        className="w-full py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        onClick={() => handlePayClick(order._id)}
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
