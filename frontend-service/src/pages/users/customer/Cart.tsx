import React, { useState, useEffect } from 'react';
import { useCart } from '../../../contexts/CartContext';
import Navbar from "../../../components/Navbar";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, MapPin, FileText, CreditCard } from 'lucide-react';

const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:31000"
const userUrl = import.meta.env.VITE_USER_URL || "http://localhost:31000";
const restaurantUrl = import.meta.env.VITE_RESTAURANT_URL || "http://localhost:31000";
const orderUrl = import.meta.env.VITE_ORDER_URL || "http://localhost:31000";
const deliveryUrl = import.meta.env.VITE_USER_URL|| " http://localhost:31000";

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
        `${orderUrl}/api/orders`,
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
        localStorage.setItem('latestOrderId', createdOrder._id);
        clearCart();
        navigate(`/order/${createdOrder._id}`);
      } else {
        throw new Error('Invalid order response from server');
      }
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
      navigate(`/restaurants/${restaurantId}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white shadow-sm rounded-lg">
        <div className="flex items-center border-b pb-4 mb-6">
          <ShoppingBag className="text-gray-700 mr-3" size={22} />
          <h1 className="text-2xl font-semibold text-gray-800">Your Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingBag size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 mb-6">Your cart is empty</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Cart Items */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-medium text-gray-700 mb-4">Order Items</h2>
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item, idx) => (
                    <li key={idx} className="py-4 flex justify-between items-center">
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">{item.name}</p>
                        <p className="text-gray-500 text-sm mt-1">${item.price.toFixed(2)} each</p>
                      </div>
                      
                      <div className="flex items-center bg-white border rounded-md overflow-hidden shadow-sm">
                        <button
                          onClick={() => handleDecreaseQuantity(idx)}
                          className="px-2 py-1 text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-3 py-1 text-gray-700 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleIncreaseQuantity(idx)}
                          className="px-2 py-1 text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <div className="ml-6 flex items-center">
                        <span className="font-medium text-gray-800 mr-4">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(idx)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <button
                    onClick={handleAddMoreItems}
                    className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center"
                  >
                    <Plus size={16} className="mr-1" />
                    Add More Items
                  </button>
                  <div className="text-right">
                    <p className="text-gray-500 text-sm">Subtotal</p>
                    <p className="text-gray-800 font-semibold text-xl">${totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              {/* Delivery Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <MapPin size={18} className="text-gray-700 mr-2" />
                  <h2 className="text-lg font-medium text-gray-700">Delivery Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Street Address</label>
                    <input
                      type="text"
                      name="street"
                      value={deliveryAddress.street}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                      placeholder="123 Main St"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={deliveryAddress.city}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                      placeholder="San Francisco"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={deliveryAddress.state}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                      placeholder="CA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={deliveryAddress.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                      placeholder="94103"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={deliveryAddress.country}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                      placeholder="United States"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center mb-1">
                    <FileText size={16} className="text-gray-600 mr-2" />
                    <label className="block text-sm text-gray-600">Special Instructions (optional)</label>
                  </div>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white h-24 resize-none"
                    placeholder="Delivery notes, dietary restrictions, etc."
                  ></textarea>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 sticky top-6">
                <h2 className="text-lg font-medium text-gray-700 flex items-center mb-4">
                  <CreditCard size={18} className="mr-2" />
                  Order Summary
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-800 font-medium">${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="text-gray-800 font-medium">$3.99</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-800 font-medium">${(totalAmount * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 mt-2 flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="text-gray-800 font-bold">${(totalAmount + 3.99 + totalAmount * 0.08).toFixed(2)}</span>
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4 text-sm">
                    {error}
                  </div>
                )}
                
                <button
                  onClick={handleConfirmOrder}
                  disabled={loading || !isFormValid}
                  className={`w-full py-3 rounded-md font-medium transition-colors flex items-center justify-center ${
                    isFormValid && !loading
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Place Order"
                  )}
                </button>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing your order, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;