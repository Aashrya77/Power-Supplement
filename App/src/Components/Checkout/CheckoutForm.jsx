import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import EsewaPayment from '../../Components/EsewaPayment';
import CouponInput from '../Coupon/CouponInput';
import { createOrder } from '../../services/orderService';
import './CheckoutForm.css';

const CheckoutForm = () => {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
    const { isLoggedIn } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [shippingAddress, setShippingAddress] = useState({
        street: '',
        city: '',
        state: '',
        postal_code: '',
        phone: '',
        country: 'Nepal'
    });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);


    // Check if user is logged in
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login?redirect=checkout');
        }
    }, [isLoggedIn, navigate]);

    // Calculate amounts
    const cartItems = cart?.items || [];
    const subtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const delivery_charge = 0; // Example delivery charge
    const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
    const total_amount = Math.round(subtotal - discountAmount + delivery_charge);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        
        // Validate form
        if (!shippingAddress.street || !shippingAddress.city || 
            !shippingAddress.state || !shippingAddress.postal_code || !shippingAddress.phone) {
            setError('Please fill in all shipping address fields');
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            
            // Create order in the backend
            const orderData = {
                items: cartItems.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity
                })),
                totalAmount: total_amount,
                subtotal: subtotal,
                shippingAddress,
                paymentMethod: 'esewa',
                couponCode: appliedCoupon ? appliedCoupon.code : null
            };

            console.log('Cart items being sent:', orderData)
            
            const response = await createOrder(orderData);
            if (response.success) {
                setOrderId(response.order._id)
               
                // Set form as submitted to show payment button
                setFormSubmitted(true);
            } else {
                throw new Error(response.message || 'Failed to create order');
            }
            
        } catch (error) {
            console.error('Order creation error:', error);
            setError(error.message || 'Failed to create order');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentInitiated = (paymentData) => {
        // Store order ID in local storage for reference after payment
        if (orderId) {
            localStorage.setItem('currentOrderId', orderId);
            console.log('Payment initiated with data:', paymentData);
        }
    };

    // If cart is empty or loading, show appropriate message
    if (cartItems.length === 0) {
        return (
            <div className="checkout-form">
                <h2>Checkout</h2>
                <div className="empty-cart-message">
                    <p>Your cart is empty. Please add items to your cart before checkout.</p>
                    <button 
                        onClick={() => navigate('/products')}
                        className="continue-shopping-button"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-form">
            <h2>Checkout</h2>
            
            <div className="order-summary">
                <h3>Order Summary</h3>
                {cartItems.map((item) => (
                    <div key={item.product._id} className="order-item">
                        <span>{item.product.name} x {item.quantity}</span>
                        <span>Rs. {item.product.price * item.quantity}</span>
                    </div>
                ))}
                <div className="charges">
                    <div className="charge-item">
                        <span>Subtotal</span>
                        <span>Rs. {subtotal}</span>
                    </div>
                    {appliedCoupon && (
                        <div className="charge-item discount-item">
                            <span>Discount ({appliedCoupon.code})</span>
                            <span className="discount-amount">- Rs. {discountAmount}</span>
                        </div>
                    )}
                    <div className="charge-item">
                        <span>Delivery Charge</span>
                        <span>Rs. {delivery_charge}</span>
                    </div>
                </div>
                <div className="total">
                    <strong>Total</strong>
                    <strong>Rs. {total_amount}</strong>
                </div>
            </div>

            <CouponInput 
                onApplyCoupon={setAppliedCoupon}
                appliedCoupon={appliedCoupon}
                onRemoveCoupon={() => setAppliedCoupon(null)}
                subtotal={subtotal}
            />

            {!formSubmitted ? (
                <form onSubmit={handleSubmit} className="shipping-form">
                    <h3>Shipping Address</h3>
                    
                    <div className="form-group">
                        <label htmlFor="street">Street Address</label>
                        <input
                            type="text"
                            id="street"
                            name="street"
                            value={shippingAddress.street}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={shippingAddress.city}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="state">State</label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={shippingAddress.state}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="postal_code">Postal Code</label>
                            <input
                                type="text"
                                id="postal_code"
                                name="postal_code"
                                value={shippingAddress.postal_code}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={shippingAddress.phone}
                            onChange={handleInputChange}
                            placeholder="e.g., 9841234567"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="continue-button"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Continue to Payment'}
                    </button>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                </form>
            ) : (
                <div className="payment-section">
                    <h3>Payment Method</h3>
                    <div className="shipping-summary">
                        <h4>Shipping to:</h4>
                        <p>{shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}, {shippingAddress.country}</p>
                        <p><strong>Phone:</strong> {shippingAddress.phone}</p>
                        <button 
                            className="edit-button"
                            onClick={() => setFormSubmitted(false)}
                        >
                            Edit
                        </button>
                    </div>
                    
                    <div className="payment-options">
                    <EsewaPayment 
                        items={cartItems} 
                        orderId={orderId}
                        onPaymentInitiated={handlePaymentInitiated} 
                    />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutForm;
