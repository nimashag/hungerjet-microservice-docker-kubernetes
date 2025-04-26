import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../../components/Navbar";
import Swal from "sweetalert2";
import { loadStripe } from "@stripe/stripe-js";

const Order: React.FC = () => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [editingAddress, setEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [editingInstructions, setEditingInstructions] = useState(false);
  const [newInstructions, setNewInstructions] = useState("");

  const orderId = localStorage.getItem("latestOrderId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId || !token) {
          setError("Order ID or Token missing.");
          return;
        }

        const res = await axios.get(
          `http://localhost:3002/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order", err);
        setError("Failed to load order. Try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  const handleUpdateAddress = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:3002/api/orders/${orderId}/delivery-address`,
        { deliveryAddress: newAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrder(res.data);
      setEditingAddress(false);
    } catch (err) {
      console.error("Failed to update address", err);
      alert("Failed to update address.");
    }
  };

  const handleUpdateInstructions = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:3002/api/orders/${orderId}/special-instructions`,
        { specialInstructions: newInstructions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrder(res.data);
      setEditingInstructions(false);
    } catch (err) {
      console.error("Failed to update instructions", err);
      alert("Failed to update instructions.");
    }
  };

  const handleCancelOrder = async () => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "Once cancelled, you cannot recover this order!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });
  
    if (confirmation.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:3002/api/orders/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        Swal.fire("Cancelled!", "Your order has been cancelled.", "success");
  
        // Optionally, redirect or reset the order state
        setOrder(null);
        navigate("/restaurants");
      } catch (err) {
        console.error("Failed to cancel order", err);
        Swal.fire("Error", "Failed to cancel order. Please try again.", "error");
      }
    }
  };

  const handlePayment = async() => {
    const stripe = await loadStripe('pk_test_51RI8Xy4PPi9egRr2BanqZv12aSu1tfCjywj1gbAzSOFvQj4DMUrQBZHY6gWpM6B2nDZgsAyu4wgdumPeBGrnNUwu00IVGTjSKk');
    const body = {
      orders: order.items,
    };
    await axios.post('/api/orders/create-checkout-session', body, { headers: { Authorization: `Bearer ${token}` } })    

    const headers = {
      "Content-Type":"application/json"
    }

    const response = await fetch("http://localhost:3002/api/orders/create-checkout-session", {
      method: "POST",
      headers:headers,
      body:JSON.stringify(body)
    })

    const session =  await response.json();

    const result = stripe?.redirectToCheckout({
      sessionId:session.id
    })
  };
  
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-center">Loading your order...</div>
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

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-center">No order found.</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">📦 Your Order Details</h1>

        <div className="bg-white shadow rounded-lg p-6">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total Amount:</strong> ${order.totalAmount?.toFixed(2)}</p>

          <h2 className="mt-4 font-semibold flex items-center">
            Delivery Address
            <button
              onClick={() => {
                setEditingAddress(true);
                setNewAddress(order.deliveryAddress);
              }}
              className="ml-2 text-blue-500 hover:underline text-sm"
            >
              ✏️ Edit
            </button>
          </h2>

          {!editingAddress ? (
            <>
              <p>{order.deliveryAddress?.street}, {order.deliveryAddress?.city}</p>
              <p>{order.deliveryAddress?.state}, {order.deliveryAddress?.zipCode}, {order.deliveryAddress?.country}</p>
            </>
          ) : (
            <div className="space-y-2 mt-2">
              <input
                className="border p-1 w-full"
                placeholder="Street"
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
              />
              <input
                className="border p-1 w-full"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              />
              <input
                className="border p-1 w-full"
                placeholder="State"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
              />
              <input
                className="border p-1 w-full"
                placeholder="Zip Code"
                value={newAddress.zipCode}
                onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
              />
              <input
                className="border p-1 w-full"
                placeholder="Country"
                value={newAddress.country}
                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
              />
              <div className="flex space-x-2 mt-2">
                <button onClick={handleUpdateAddress} className="bg-blue-500 text-white px-3 py-1 rounded">
                  Save
                </button>
                <button onClick={() => setEditingAddress(false)} className="bg-gray-300 px-3 py-1 rounded">
                  Cancel
                </button>
              </div>
            </div>
          )}

          <h2 className="mt-4 font-semibold flex items-center">
            Special Instructions
            <button
              onClick={() => {
                setEditingInstructions(true);
                setNewInstructions(order.specialInstructions || "");
              }}
              className="ml-2 text-blue-500 hover:underline text-sm"
            >
              ✏️ Edit
            </button>
          </h2>

          {!editingInstructions ? (
            <p>{order.specialInstructions || "No instructions."}</p>
          ) : (
            <div className="mt-2">
              <textarea
                className="border p-1 w-full"
                rows={3}
                placeholder="Enter special instructions..."
                value={newInstructions}
                onChange={(e) => setNewInstructions(e.target.value)}
              />
              <div className="flex space-x-2 mt-2">
                <button onClick={handleUpdateInstructions} className="bg-blue-500 text-white px-3 py-1 rounded">
                  Save
                </button>
                <button onClick={() => setEditingInstructions(false)} className="bg-gray-300 px-3 py-1 rounded">
                  Cancel
                </button>
              </div>
            </div>
          )}
          <div className="mt-6 text-center">
  <button
    onClick={handleCancelOrder}
    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
  >
    ❌ Cancel Order
  </button>
</div>
        </div>
        
{/* Payment Details */}
<div className="bg-white shadow rounded-lg p-6 mt-6">
  <h2 className="text-xl font-semibold mb-4">💳 Payment Details</h2>

  <p><strong>Total Amount:</strong> ${order.totalAmount?.toFixed(2)}</p>
  <p><strong>Payment Status:</strong> {order.paymentStatus || "Pending"}</p>

  <button
    onClick={() => handlePayment()}
    className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
  >
    💰 Pay Here
  </button>
</div>

      </div>
    </>
  );
};

export default Order;
