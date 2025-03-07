const CryptoJS = require('crypto-js');
const { v4: uuidv4 } = require('uuid');
// Secret key for eSewa (this should be in your .env file in production)
const ESEWA_SECRET_KEY = '8gBm/:&EnhH.1/q(';
const ESEWA_PRODUCT_CODE = 'EPAYTEST';

// Generate a unique transaction ID
const generateTransactionId = () => uuidv4();
// Generate HMAC signature for eSewa


// Initiate eSewa payment
const initiatePayment = async (req, res) => {
  try {
    const { amount, productName } = req.body;
    
    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    // Calculate total amount
    const taxAmount = 0;
    const serviceCharge = 0;
    const deliveryCharge = 0;
    const totalAmount = parseFloat(amount) + taxAmount + serviceCharge + deliveryCharge;

    // Generate unique transaction ID
    const transactionUuid = generateTransactionId();

    // Define signed fields
    const signedFieldNames = 'total_amount,transaction_uuid,product_code';
    const signedFieldString = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${ESEWA_PRODUCT_CODE}`;

    console.log("Signed String:", signedFieldString);

    // Generate signature using Base64 encoding
    const hash = CryptoJS.HmacSHA256(signedFieldString, ESEWA_SECRET_KEY);
    const signature = CryptoJS.enc.Base64.stringify(hash);

    console.log('Generated Signature:', signature);

    // Create payment data
    const paymentData = {
      amount: totalAmount.toString(),
      tax_amount: taxAmount.toString(),
      product_service_charge: serviceCharge.toString(),
      product_delivery_charge: deliveryCharge.toString(),
      total_amount: totalAmount.toString(),
      transaction_uuid: transactionUuid,
      product_code: ESEWA_PRODUCT_CODE,
      signed_field_names: signedFieldNames,
      signature: signature,
      success_url: process.env.ESEWA_SUCCESS_URL,
      failure_url: process.env.ESEWA_FAILURE_URL,
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
