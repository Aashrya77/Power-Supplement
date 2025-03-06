const crypto = require('crypto');

// Secret key for eSewa (this should be in your .env file in production)
const ESEWA_SECRET_KEY = '8gBm/:&EnhH.1/q(';
const ESEWA_PRODUCT_CODE = 'EPAYTEST';

// Generate a unique transaction ID
const generateTransactionId = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = date.getHours().toString().padStart(2, '0') + 
                 date.getMinutes().toString().padStart(2, '0') + 
                 date.getSeconds().toString().padStart(2, '0');
  const randomStr = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${dateStr}-${timeStr}-${randomStr}`;
};

// Generate HMAC signature for eSewa
const generateSignature = (data, secretKey) => {
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(data);
  return hmac.digest('base64');
};

// Initiate eSewa payment
const initiatePayment = async (req, res) => {
  try {
    const { amount, productName } = req.body;
    
    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    // Calculate amounts
    const taxAmount = 0; // Set according to your tax policy
    const serviceCharge = 0; // Set if you have any service charge
    const deliveryCharge = 0; // Set if you have any delivery charge
    const totalAmount = parseFloat(amount) + parseFloat(taxAmount) + parseFloat(serviceCharge) + parseFloat(deliveryCharge);
    
    // Generate unique transaction ID
    const transactionUuid = generateTransactionId();
    
    // Define signed fields
    const signedFieldNames = 'total_amount,transaction_uuid,product_code';
    const signedFieldValues = `${totalAmount},${transactionUuid},${ESEWA_PRODUCT_CODE}`;
    
    // Generate signature
    const signature = generateSignature(signedFieldValues, ESEWA_SECRET_KEY);
    
    // Create payment data
    const paymentData = {
      amount: amount.toString(),
      tax_amount: taxAmount.toString(),
      product_service_charge: serviceCharge.toString(),
      product_delivery_charge: deliveryCharge.toString(),
      total_amount: totalAmount.toString(),
      transaction_uuid: transactionUuid,
      product_code: ESEWA_PRODUCT_CODE,
      signed_field_names: signedFieldNames,
      signature: signature,
      success_url: `${process.env.FRONTEND_URL}/payment/success`,
      failure_url: `${process.env.FRONTEND_URL}/payment/failure`,
      formUrl: process.env.NODE_ENV === 'production' 
        ? 'https://epay.esewa.com.np/api/epay/main/v2/form'
        : 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'
    };
    
    res.status(200).json(paymentData);
  } catch (error) {
    console.error('Error initiating payment:', error);
    res.status(500).json({ message: 'Error initiating payment', error: error.message });
  }
};

// Verify eSewa payment
const verifyPayment = async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ message: 'Payment data is required' });
    }
    
    // Decode the base64 response from eSewa
    const decodedData = Buffer.from(data, 'base64').toString();
    const paymentResponse = JSON.parse(decodedData);
    
    // Extract data from response
    const { 
      transaction_code, 
      status, 
      total_amount, 
      transaction_uuid, 
      product_code,
      signed_field_names,
      signature 
    } = paymentResponse;
    
    // Verify signature
    const signedFields = signed_field_names.split(',');
    const signedValues = signedFields.map(field => paymentResponse[field]).join(',');
    const calculatedSignature = generateSignature(signedValues, ESEWA_SECRET_KEY);
    
    if (signature !== calculatedSignature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }
    
    if (status !== 'COMPLETE') {
      return res.status(400).json({ message: 'Payment not completed', status });
    }
    
    // Here you would update your database with the payment information
    // For example, update order status, create transaction record, etc.
    
    res.status(200).json({ 
      message: 'Payment verified successfully',
      transactionCode: transaction_code,
      amount: total_amount,
      transactionId: transaction_uuid
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
};

// Check payment status
const checkPaymentStatus = async (req, res) => {
  try {
    const { transaction_uuid, total_amount } = req.query;
    
    if (!transaction_uuid || !total_amount) {
      return res.status(400).json({ message: 'Transaction ID and amount are required' });
    }
    
    // Construct the status check URL
    const statusUrl = process.env.NODE_ENV === 'production'
      ? `https://epay.esewa.com.np/api/epay/transaction/status/?product_code=${ESEWA_PRODUCT_CODE}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`
      : `https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${ESEWA_PRODUCT_CODE}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`;
    
    // Make request to eSewa status API
    const response = await fetch(statusUrl);
    const statusData = await response.json();
    
    if (statusData.status === 'COMPLETE') {
      // Update your database with the payment status
      // For example, mark the order as paid
      
      return res.status(200).json({ 
        message: 'Payment completed successfully',
        status: statusData.status,
        refId: statusData.ref_id
      });
    } else {
      return res.status(200).json({
        message: 'Payment not completed',
        status: statusData.status
      });
    }
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({ message: 'Error checking payment status', error: error.message });
  }
};

module.exports = {
  initiatePayment,
  verifyPayment,
  checkPaymentStatus
};
