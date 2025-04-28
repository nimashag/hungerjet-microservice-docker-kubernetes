import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiBase, userUrl, restaurantUrl, orderUrl, deliveryUrl } from "../api";

interface CheckoutFormProps {
  clientSecret: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const orderId = localStorage.getItem("latestOrderId");

  // CheckoutForm.tsx
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      alert('Card details not found');
      return;
    }

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        alert(result.error.message);
      } else {
        if (result.paymentIntent?.status === 'succeeded') {
          // Update the order status and payment status after successful payment
          await axios.patch(
            `${orderUrl}/api/orders/${orderId}/mark-paid`,
            {
              paymentMethod: "Stripe",
              transactionId: result.paymentIntent.id,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          alert('Payment successful!');
          navigate('/restaurants');
        }
      }
    } catch (error) {
      console.error('Error during payment confirmation', error);
      alert('Payment failed. Please try again.');
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <CardElement className="p-4 border border-gray-300 rounded" />
      <button 
        type="submit"
        className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        Pay Now
      </button>
    </form>
  );
};

export default CheckoutForm;
