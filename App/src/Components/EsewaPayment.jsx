import React, { useState } from 'react';
import { initiatePayment, submitEsewaForm } from '../services/paymentService';

const EsewaPayment = ({ amount, productName, onPaymentInitiated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call our backend to initiate payment
      const paymentData = await initiatePayment({
        amount,
        productName
      });
      
      // Notify parent component that payment is initiated
      if (onPaymentInitiated) {
        onPaymentInitiated(paymentData);
      }
      
      // Submit form to eSewa
      submitEsewaForm(paymentData);
      
    } catch (error) {
      console.error('Payment initiation error:', error);
      setError(error.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="esewa-payment">
      <button 
        className="esewa-pay-button"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Pay with eSewa'}
      </button>
      
      {error && (
        <div className="payment-error">
          {error}
        </div>
      )}
    </div>
  );
};

export default EsewaPayment;
