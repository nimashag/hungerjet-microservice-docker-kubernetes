import React, { useState, useEffect } from 'react';
import { useCart } from '../../../contexts/CartContext';
import Navbar from "../../../components/Navbar";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react'; // For icons

const Cart: React.FC = () => {
  const { cartItems, clearCart, updateItemQuantity, removeItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Form state
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const { street, city, state, zipCode, country } = deliveryAddress;
    setIsFormValid(!!(street && city && state && zipCode && country));
  }, [deliveryAddress]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeliveryAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirmOrder = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Unauthorized. Please log in.');
        return;
      }

      const restaurantId = localStorage.getItem('selectedRestaurantId');
      if (!restaurantId) {
        setError('Invalid restaurant ID.');
        return;
      }

      const totalAmount = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      const res = await axios.post(
        'http://localhost:3002/api/orders',
        {
          restaurantId,
          items: cartItems,
          totalAmount,
          deliveryAddress,
          paymentStatus: 'Pending',
          paymentMethod: 'Stripe',
          specialInstructions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const createdOrder = res.data;

      if (createdOrder && createdOrder._id) {
        localStorage.setItem('latestOrderId', createdOrder._id); // Save the order ID
        clearCart();
        navigate(`/order/${createdOrder._id}`); // Redirect to order page
      } else {
        throw new Error('Invalid order response from server');
      }

      // alert('Order placed successfully!');
      // clearCart();
      // navigate('/');
    } catch (error) {
      console.error('Failed to place order', error);
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleIncreaseQuantity = (index: number) => {
    const item = cartItems[index];
    updateItemQuantity(item.menuItemId, item.quantity + 1);
  };

  const handleDecreaseQuantity = (index: number) => {
    const item = cartItems[index];
    if (item.quantity > 1) {
      updateItemQuantity(item.menuItemId, item.quantity - 1);
    } else {
      // Quantity becomes 0, show bin icon
      updateItemQuantity(item.menuItemId, 0);
    }
  };

  const handleRemoveItem = (index: number) => {
    const item = cartItems[index];
    removeItem(item.menuItemId);
  };

  const handleAddMoreItems = () => {
    const restaurantId = localStorage.getItem('selectedRestaurantId');
    if (restaurantId) {
      navigate(`/restaurants/${restaurantId}`); // Navigate back to restaurant's item page
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">🛒 Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <ul className="space-y-6">
              {cartItems.map((item, idx) => (
                <li key={idx} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => handleDecreaseQuantity(idx)}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleIncreaseQuantity(idx)}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <Plus size={16} />
                      </button>

                      {item.quantity === 0 && (
                        <button
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 ml-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={handleAddMoreItems}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                ➕ Add More Items
              </button>
              <div className="text-right font-bold text-lg">
              Total: ${totalAmount.toFixed(2)}
              </div>
            </div>

            {/* Address Form */}
            <form className="mt-8 space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">📦 Delivery Address</h2>

              <input
                type="text"
                name="street"
                placeholder="Street"
                value={deliveryAddress.street}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={deliveryAddress.city}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={deliveryAddress.state}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="zipCode"
                placeholder="ZIP Code"
                value={deliveryAddress.zipCode}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={deliveryAddress.country}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />

              <textarea
                placeholder="Special Instructions (optional)"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded h-24 resize-none"
              ></textarea>
            </form>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <button
              onClick={handleConfirmOrder}
              disabled={loading || !isFormValid}
              className={`w-full mt-6 py-2 rounded-lg ${
                isFormValid && !loading
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              {loading ? 'Placing Order...' : 'Confirm Order'}
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
