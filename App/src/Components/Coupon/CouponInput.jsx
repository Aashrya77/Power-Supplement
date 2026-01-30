import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../config';
import './CouponInput.css';

const CouponInput = ({ onApplyCoupon, appliedCoupon, onRemoveCoupon, subtotal }) => {
    const [couponCode, setCouponCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setError('Please enter a coupon code');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                setError('Please login to apply coupon codes');
                setLoading(false);
                return;
            }
            
            const response = await axios.post(
                `${BASE_URL}/api/v1/coupons/validate`,
                {
                    code: couponCode.trim(),
                    orderAmount: subtotal
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const data = response.data;
            if (data.status === 'success') {
                onApplyCoupon({
                    code: data.data.code,
                    description: data.data.description,
                    discountType: data.data.discountType,
                    discountValue: data.data.discountValue,
                    discount: data.data.discount,
                    finalAmount: data.data.finalAmount
                });
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
                setCouponCode('');
            } else {
                setError(data.message || 'Invalid coupon code');
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Invalid coupon code');
            } else {
                setError('Failed to validate coupon. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        onRemoveCoupon();
        setCouponCode('');
        setError('');
        setShowSuccess(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleApplyCoupon();
        }
    };

    return (
        <div className="coupon-section">
            <h3 className="coupon-title">
                <span className="coupon-icon">🎫</span>
                Have a Coupon Code?
            </h3>
            
            {!appliedCoupon ? (
                <div className="coupon-input-wrapper">
                    <div className="coupon-input-group">
                        <input
                            type="text"
                            className="coupon-input"
                            placeholder="Enter athlete code (e.g., SAGAR10)"
                            value={couponCode}
                            onChange={(e) => {
                                setCouponCode(e.target.value.toUpperCase());
                                setError('');
                            }}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                        />
                        <button
                            className="apply-coupon-btn"
                            onClick={handleApplyCoupon}
                            disabled={loading || !couponCode.trim()}
                        >
                            {loading ? (
                                <span className="loading-spinner">⟳</span>
                            ) : (
                                'Apply'
                            )}
                        </button>
                    </div>
                    
                    {error && (
                        <div className="coupon-error">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}
                    
                    {showSuccess && (
                        <div className="coupon-success">
                            <span className="success-icon">✓</span>
                            Coupon applied successfully!
                        </div>
                    )}

                    <div className="available-codes-hint">
                        <p>💡 Use athlete codes for 5% off your order</p>
                    </div>
                </div>
            ) : (
                <div className="applied-coupon">
                    <div className="applied-coupon-card">
                        <div className="coupon-details">
                            <div className="coupon-code-display">
                                <span className="coupon-label">Code:</span>
                                <span className="coupon-code-value">{appliedCoupon.code}</span>
                            </div>
                            <div className="coupon-description">
                                {appliedCoupon.description}
                            </div>
                            <div className="coupon-discount-info">
                                <span className="discount-badge">
                                    {appliedCoupon.discountType === 'percentage' 
                                        ? `${appliedCoupon.discountValue}% OFF` 
                                        : `NPR ${appliedCoupon.discountValue} OFF`}
                                </span>
                            </div>
                        </div>
                        <button
                            className="remove-coupon-btn"
                            onClick={handleRemoveCoupon}
                            title="Remove coupon"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="coupon-savings">
                        <span className="savings-icon">🎉</span>
                        You're saving <strong>NPR {appliedCoupon.discount}</strong> on this order!
                    </div>
                </div>
            )}
        </div>
    );
};

export default CouponInput;
