const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const generateTransactionId = () => uuidv4();
const Orders = require("../Models/Order");

const ESEWA_MERCHANT_CODE = 'NP-ES-PS';
const ESEWA_SECRET_KEY = 'NRwSEhNTOBAJFR8AGgAdH183NV4gJEwjOF88NTI8KCAwKCAqNiwuMjg=';
const ESEWA_TEST_URL = 'https://epay.esewa.com.np/api/epay/main/v2/form';
const ESEWA_SUCCESS_URL = 'http://powersupplement.net/payment/success';
const ESEWA_FAILURE_URL = 'http://powersupplement.net/payment/failure';
const axios = require("axios");

// Initiate eSewa payment
const initiatePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "OrderId is required" });
    }
    const order = await Orders.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: "Order not found." });
    }

    console.log('Order details:', {
      orderId: order._id,
      subtotal: order.subtotal,
      totalAmount: order.totalAmount,
      couponApplied: order.couponApplied
    });

    // Calculate total amount - round to nearest integer for eSewa
    const amount = Math.round(order.totalAmount);
    const taxAmount = 0;
    const serviceCharge = 0;
    const deliveryCharge = 0;
    const totalAmount = amount + taxAmount + serviceCharge + deliveryCharge;
    
    console.log('Payment amounts:', {
      originalAmount: order.totalAmount,
      roundedAmount: amount,
      totalAmount,
      transactionAmount: totalAmount.toString()
    });
    // Generate unique transaction ID
    const transactionUuid = generateTransactionId();
    // Define signed fields
    const signedFieldNames = "total_amount,transaction_uuid,product_code";
    const signedFieldString = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=NP-ES-PS`;

    console.log('Signature generation:', {
      signedFieldString,
      secretKeyLength: ESEWA_SECRET_KEY.length,
      environment: process.env.NODE_ENV || 'development'
    });
   
    // Generate signature using Base64 encoding
    const hash = crypto
      .createHmac("sha256", ESEWA_SECRET_KEY)
      .update(signedFieldString, "utf8") // Ensure utf8
      .digest("base64"); // Ensure base64

    const signature = hash;

    const paymentData = {
      amount: amount,
      tax_amount: taxAmount.toString(),
      total_amount: totalAmount.toString(),
      transaction_uuid: transactionUuid,
      product_code: 'NP-ES-PS',
      product_service_charge: serviceCharge.toString(),
      product_delivery_charge: deliveryCharge.toString(),
      success_url: ESEWA_SUCCESS_URL,
      failure_url: ESEWA_FAILURE_URL,
      signed_field_names: signedFieldNames,
      signature: signature,
      formUrl: "https://epay.esewa.com.np/api/epay/main/v2/form",
    };

    res.status(200).json(paymentData);
  } catch (error) {
    console.error("Error initiating payment:", error);
    res
      .status(500)
      .json({ message: "Error initiating payment", error: error.message });
  }
};

// Verify eSewa payment
const verifyPayment = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ message: "Payment data is required" });
    }

    // Decode the base64 response from eSewa
    const decodedData = Buffer.from(data, "base64").toString();
    const paymentResponse = JSON.parse(decodedData);

    // Extract data from response
    const { total_amount, transaction_uuid } = paymentResponse;
    let cleanedNumber = total_amount.toString().replace(",", '');
    let actualNumber = parseInt(cleanedNumber)

    const response = await axios.get(
      `https://epay.esewa.com.np/api/epay/transaction/status?transaction_uuid=${transaction_uuid}&total_amount=${actualNumber}&product_code=NP-ES-PS`
    );

    

    const esewaResponse = response.data;
    if (esewaResponse.status === "COMPLETE") {
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        transaction_uuid,
        amount: esewaResponse.total_amount,
        transaction_code: esewaResponse.transaction_code,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
        status: esewaResponse.status,
      });
    }
  } catch (error) {
    
    console.error("Error verifying payment:", error);
    res
      .status(500)
      .json({ message: "Error verifying payment", error: error.message });
  }
};

// Check payment status
const checkPaymentStatus = async (req, res) => {
  try {
    const { transaction_uuid, total_amount } = req.query;

    if (!transaction_uuid || !total_amount) {
      return res
        .status(400)
        .json({ message: "Transaction ID and amount are required" });
    }

    // Construct the status check URL with proper parameters
    const statusUrl = `https://epay.esewa.com.np/api/epay/transaction/status?transaction_uuid=${transaction_uuid}&total_amount=${total_amount}&product_code=NP-ES-PS`;

    // Make request to eSewa status API
    const response = await axios.get(statusUrl);
    const statusData = response.data;

    if (statusData.status === "COMPLETE") {
      // Update your database with the payment status
      // For example, mark the order as paid

      return res.status(200).json({
        message: "Payment completed successfully",
        status: statusData.status,
        refId: statusData.ref_id,
      });
    } else {
      return res.status(200).json({
        message: "Payment not completed",
        status: statusData.status,
      });
    }
  } catch (error) {
    console.error("Error checking payment status:", error);
    res
      .status(500)
      .json({ message: "Error checking payment status", error: error.message });
  }
};

module.exports = {
  initiatePayment,
  verifyPayment,
  checkPaymentStatus,
};
