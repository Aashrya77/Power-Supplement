import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { verifyPayment, checkPaymentStatus } from '../../services/paymentService';
import { updateOrderStatus } from '../../services/orderService';
import './PaymentResult.css';

const PaymentResult = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { clearCart } = useCart();
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState('');
    const [transactionDetails, setTransactionDetails] = useState(null);

    useEffect(() => {
        const verifyTransaction = async () => {
            try {
                // Check if this is a success or failure page
                const isSuccess = location.pathname.includes('/success');
                const isFailure = location.pathname.includes('/failure');
                
                // Get the current order ID from localStorage
                const orderId = localStorage.getItem('currentOrderId');
                
                if (isFailure) {
                    setStatus('error');
                    setMessage('Payment was not completed or was canceled.');
                    
                    // Update order status to failed if order ID exists
                    if (orderId) {
                        try {
                            await updateOrderStatus(orderId, { 
                                status: 'failed',
                            });
                        } catch (updateError) {
                            console.error('Failed to update order status:', updateError);
                        }
                    }
                    return;
                }
                
                if (!isSuccess) {
                    setStatus('error');
                    setMessage('Invalid payment response.');
                    return;
                }

                // Get response data from URL (eSewa sends base64 encoded data)
                const data = new URLSearchParams(location.search).get('data');
                
                if (!data) {
                    setStatus('error');
                    setMessage('No payment data received from eSewa.');
                    return;
                }

                // Verify payment with our backend
                const response = await verifyPayment(data);
                
                if (response.success) {
                    setStatus('success');
                    setMessage('Payment successful! Thank you for your purchase.');
                    
                    // Parse the decoded data
                    let transactionData;
                    try {
                        const decodedData = JSON.parse(atob(data));
                        transactionData = {
                            transactionCode: decodedData.transaction_code,
                            amount: decodedData.total_amount,
                            transactionId: decodedData.transaction_uuid
                        };
                    } catch (e) {
                        transactionData = {
                            transactionCode: response.data?.transaction_code || 'N/A',
                            amount: response.data?.total_amount || 'N/A',
                            transactionId: response.data?.transaction_uuid || 'N/A'
                        };
                    }
                    
                    setTransactionDetails(transactionData);
                    
                    // Update order status if order ID exists
                    if (orderId) {
                        try {
                            await updateOrderStatus(orderId, { 
                                status: 'paid',
                                paymentDetails: {
                                    transactionId: transactionData.transactionId,
                                    referenceId: transactionData.transactionCode,
                                    amount: transactionData.amount
                                }
                            });
                        } catch (updateError) {
                            console.error('Failed to update order status:', updateError);
                        }
                    }
                    
                    // Clear the cart after successful payment
                    clearCart();
                    
                    // Clear the current order ID from localStorage
                    localStorage.removeItem('currentOrderId');
                    
                    // Redirect to orders page after 5 seconds
                    setTimeout(() => {
                        navigate('/account/orders');
                    }, 5000);
                } else {
                    // If verification failed, check payment status
                    const decodedData = JSON.parse(atob(data));
                    const statusResponse = await checkPaymentStatus(
                        decodedData.transaction_uuid,
                        decodedData.total_amount
                    );
                    
                    if (statusResponse.data?.status === 'COMPLETE') {
                        setStatus('success');
                        setMessage('Payment successful! Thank you for your purchase.');
                        
                        const transactionData = {
                            transactionCode: decodedData.transaction_code,
                            amount: decodedData.total_amount,
                            transactionId: decodedData.transaction_uuid
                        };
                        
                        setTransactionDetails(transactionData);
                        
                        // Update order status if order ID exists
                        if (orderId) {
                            try {
                                await updateOrderStatus(orderId, { 
                                    status: 'paid',
                                    paymentDetails: {
                                        transactionId: transactionData.transactionId,
                                        referenceId: transactionData.transactionCode,
                                        amount: transactionData.amount
                                    }
                                });
                            } catch (updateError) {
                                console.error('Failed to update order status:', updateError);
                            }
                        }
                        
                        clearCart();
                        localStorage.removeItem('currentOrderId');
                        
                        setTimeout(() => {
                            navigate('/account/orders');
                        }, 5000);
                    } else {
                        throw new Error(`Payment ${statusResponse.data?.status?.toLowerCase() || 'failed'}`);
                    }
                }
            } catch (error) {
                console.error('Payment verification error:', error);
                setStatus('error');
                setMessage(error.message || 'Payment verification failed');
                
                // Update order status to failed if order ID exists
                const orderId = localStorage.getItem('currentOrderId');
                if (orderId) {
                    try {
                        await updateOrderStatus(orderId, { 
                            status: 'failed',
                        });
                    } catch (updateError) {
                        console.error('Failed to update order status:', updateError);
                    }
                }
            }
        };

        verifyTransaction();
    }, [location, navigate, clearCart]);

    return (
        <div className="payment-result">
            <div className={`result-container ${status}`}>
                {status === 'processing' && (
                    <>
                        <div className="spinner"></div>
                        <h2>Verifying Payment</h2>
                        <p>Please wait while we verify your payment...</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="success-icon">✓</div>
                        <h2>Payment Successful!</h2>
                        <p>{message}</p>
                        {transactionDetails && (
                            <div className="transaction-details">
                                <p><strong>Transaction ID:</strong> {transactionDetails.transactionCode}</p>
                                <p><strong>Amount:</strong> Rs. {transactionDetails.amount}</p>
                            </div>
                        )}
                        <p className="redirect-message">
                            Redirecting to your orders...
                        </p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="error-icon">✕</div>
                        <h2>Payment Failed</h2>
                        <p>{message}</p>
                        <button 
                            className="retry-button"
                            onClick={() => navigate('/cart')}
                        >
                            Return to Cart
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentResult;
