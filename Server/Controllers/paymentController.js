const CryptoJS = require('crypto-js');
const { v4: uuidv4 } = require('uuid');
const generateTransactionId = () => uuidv4();
const Orders = require('../Models/Order')

const ESEWA_MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY;
const ESEWA_TEST_URL = process.env.ESEWA_TEST_URL
const ESEWA_SUCCESS_URL = process.env.ESEWA_SUCCESS_URL;
const ESEWA_FAILURE_URL = process.env.ESEWA_FAILURE_URL;


// Initiate eSewa payment
const initiatePayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ message: 'OrderId is required' });
    }
    const order = await Orders.findById(orderId) 
        if(!order){
          return res.status(404).json({msg: 'Order not found.'})
        }
      console.log(order)

    // Calculate total amount
    const amount = order.totalAmount
    const taxAmount = 0;
    const serviceCharge = 0;
    const deliveryCharge = 150;
    const totalAmount = parseFloat(amount) + taxAmount + serviceCharge + deliveryCharge;
    // Generate unique transaction ID
    const transactionUuid = generateTransactionId();

    // Define signed fields
    const signedFieldNames = 'total_amount,transaction_uuid,product_code';
    const signedFieldString = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${ESEWA_MERCHANT_CODE}`;

    console.log("Signed String:", signedFieldString);

    // Generate signature using Base64 encoding
    const hash = CryptoJS.HmacSHA256(signedFieldString, ESEWA_SECRET_KEY);
    const signature = CryptoJS.enc.Base64.stringify(hash);

    console.log('Generated Signature:', signature);

    // Create payment data
    const paymentData = {
      amount: amount,
      tax_amount: taxAmount.toString(),
      total_amount: totalAmount.toString(),
      transaction_uuid: transactionUuid,
      product_code: ESEWA_MERCHANT_CODE,
      product_service_charge: serviceCharge.toString(),
      product_delivery_charge: deliveryCharge.toString(),
      success_url: process.env.ESEWA_SUCCESS_URL,
      failure_url: process.env.ESEWA_FAILURE_URL,      
      signed_field_names: signedFieldNames,
      signature: signature,
      formUrl:'https://rc-epay.esewa.com.np/api/epay/main/v2/form'
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

    console.log(paymentResponse)
    
    // Verify signature
    const signedFields = signed_field_names.split(',');
    const signedValues = signedFields.map(field => paymentResponse[field]).join(',');
    const calculatedSignature = generateSignature(signedValues, ESEWA_SECRET_KEY);
    console.log('Expected Signature:', signature);
    console.log('Calculated Signature:', calculatedSignature);

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
    const statusUrl = process.env.ESEWA_TEST_URL
      
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
