const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const generateTransactionId = () => uuidv4();
const Orders = require("../Models/Order");

const ESEWA_MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE;
const ESEWA_SECRET_KEY = 'NRwSEhNTOBAJFR8AGgAdH183NV4gJEwjOF88NTI8KCAwKCAqNiwuMjg=';
const ESEWA_TEST_URL = process.env.ESEWA_TEST_URL;
const ESEWA_SUCCESS_URL = process.env.ESEWA_SUCCESS_URL;
const ESEWA_FAILURE_URL = process.env.ESEWA_FAILURE_URL;
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

    // Calculate total amount
    const amount = order.totalAmount;
    const taxAmount = 0;
    const serviceCharge = 0;
    const deliveryCharge = 0;
    const totalAmount =
      parseInt(amount) + taxAmount + serviceCharge + deliveryCharge;
    // Generate unique transaction ID
    const transactionUuid = generateTransactionId();
    // Define signed fields
    const signedFieldNames = "total_amount,transaction_uuid,product_code";
    const signedFieldString = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=NP-ES-PS`;

   
    // Generate signature using Base64 encoding

    const hash = crypto
      .createHmac("sha256", 'NRwSEhNTOBAJFR8AGgAdH183NV4gJEwjOF88NTI8KCAwKCAqNiwuMjg=')
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

    // Construct the status check URL
    const statusUrl = process.env.ESEWA_TEST_URL;

    // Make request to eSewa status API
    const response = await fetch(statusUrl);
    const statusData = await response.json();

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
