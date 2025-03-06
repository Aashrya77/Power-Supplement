import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { initiatePayment } from '../services/paymentService';

const EsewaPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paymentData = location.state?.paymentData;
    console.log(paymentData);
    
    if (!paymentData) {
      setError('No payment data found. Please try again.');
      setLoading(false);
      return;
    }

    const processPayment = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('Please login to continue with payment.');
          setLoading(false);
          return;
        }

        const response = await initiatePayment(paymentData);
        
        if (!response) {
          throw new Error('Invalid payment response from server');
        }

        // Create a form element
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = response.formUrl;
        form.style.display = 'none';

        // Add fields in the exact order they were received from the server
        const fields = [
          'total_amount',
          'transaction_uuid',
          'product_code',
          'signed_field_names',
          'signature',
          'merchant_id',
          'amount',
          'tax_amount',
          'product_service_charge',
          'product_delivery_charge',
          'success_url',
          'failure_url'
        ];

        // Add all fields from the server response to the form in the correct order
        fields.forEach(key => {
          if (response[key]) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = response[key];
            form.appendChild(input);
          }
        });

        document.body.appendChild(form);
        form.submit();
      } catch (err) {
        console.error('Payment initiation error:', err);
        setError(err.message || 'Failed to process payment. Please try again.');
        setLoading(false);
      }
    };

    processPayment();
  }, [location.state]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Payment Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded transition duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Redirecting to eSewa</h2>
        <p className="text-gray-600 mb-6">Please wait while we redirect you to the eSewa payment gateway...</p>
        {loading && (
          <div className="loader w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        )}
      </div>
    </div>
  );
};

export default EsewaPaymentPage;
