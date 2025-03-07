import axios from 'axios';
import BASE_URL from '../config';

const API_URL = `${BASE_URL}/api/v1/payments`;

export const initiatePayment = async (orderData) => {
    try {
        const response = await axios.post(`${API_URL}/initiate`, orderData, {
            headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
            
      }
    );
  
console.log(response.data)
    if (response.data) {
        return response.data;
    }
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const verifyPayment = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/verify`, { data });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const checkPaymentStatus = async (transaction_uuid, total_amount) => {
    try {
        const response = await axios.get(`${API_URL}/status`, {
            params: { transaction_uuid, total_amount },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Helper function to submit eSewa form
export const submitEsewaForm = (paymentData) => {
  // Create a form element
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = paymentData.formUrl;
  form.style.display = 'none';
  form.acceptCharset = 'UTF-8'; // Ensure encoding is correct

  // Add all payment data as input fields
  Object.entries(paymentData).forEach(([key, value]) => {
      if (key !== 'formUrl') {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
      }
  });

  // Append form to body
  document.body.appendChild(form);
  
  // Debugging - Check if all fields are correct
  console.log('Esewa Form Data:', form.outerHTML);

  // Submit form
  // form.submit();

    // Remove the form after a delay
  setTimeout(() => {
      document.body.removeChild(form);
  }, 3000);
};
