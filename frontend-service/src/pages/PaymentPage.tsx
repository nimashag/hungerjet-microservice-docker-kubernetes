import React from 'react';
import { useLocation } from 'react-router-dom';
import StripePayment from '../components/StripePayment';
import Navbar from "../components/Navbar";

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const { clientSecret } = location.state || {};

  if (!clientSecret) {
    return <div>No Payment Information.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Complete Your Payment</h1>
        <StripePayment clientSecret={clientSecret} />
      </div>
    </>
  );
};

export default PaymentPage;
