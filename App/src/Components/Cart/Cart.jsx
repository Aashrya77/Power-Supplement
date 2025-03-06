import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './Cart.css';
import BASE_URL from '../../config';

const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart, clearCart, applyCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    updateCartItem(productId, quantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    applyCoupon(couponCode);
    setCouponCode('');
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (!cart.items.length) {
    return (
      <div className="cart-empty">
        <FiShoppingBag size={48} className="empty-cart-icon" />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any products to your cart yet.</p>
        <Link to="/shop-all" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart ({cart.items.length} items)</h1>
      </div>
      
      <div className="cart-content">
        <div className="cart-items-container">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.product._id} className="cart-item">
                <div className="item-image-container">
                  <img 
                    src={`${BASE_URL}${item.product.images[0]}`} 
                    alt={item.product.name} 
                    className="cart-item-image"
                    onError={(e) => {
                      e.target.src = "/placeholder-product.jpg";
                    }}
                  />
                </div>
                <div className="cart-item-details">
                  <div className="item-info">
                    <h3>{item.product.name}</h3>
                    <p className="item-price">Rs. {item.product.price.toFixed(2)}</p>
                    {item.product.discount && (
                      <span className="discount-badge">
                        {item.product.discount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="quantity-btn"
                      >
                        <FiMinus size={16} />
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>
                    <button 
                      className="remove-item-btn"
                      onClick={() => handleRemoveItem(item.product._id)}
                    >
                      <FiTrash2 size={16} />
                      <span>Remove</span>
                    </button>
                  </div>
                  <p className="item-subtotal">
                    Subtotal: <span>Rs. {(item.product.price * item.quantity).toFixed(2)}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs. {calculateTotal().toFixed(2)}</span>
            </div>
            {cart.discount && (
              <div className="summary-row discount">
                <span>Discount</span>
                <span>Rs. -{(calculateTotal() * (cart.discount / 100)).toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Total</span>
              <span>Rs. {(calculateTotal() * (1 - (cart.discount || 0) / 100)).toFixed(2)}</span>
            </div>
          </div>

          <div className="coupon-section">
            <form onSubmit={handleApplyCoupon}>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="coupon-input"
              />
              <button type="submit" className="apply-coupon-btn">
                Apply
              </button>
            </form>
          </div>

          <div className="cart-actions">
            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>
            <Link to="/checkout" className="checkout-btn">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
