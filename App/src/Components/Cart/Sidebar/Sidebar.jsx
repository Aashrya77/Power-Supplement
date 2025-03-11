import React from "react";
import "./Sidebar.css";
import { IoMdClose } from "react-icons/io";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import BASE_URL from "../../../config";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { cart, updateCartItem, removeFromCart } = useCart();
  const { user } = useAuth();

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    updateCartItem(productId, quantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const calculateSubtotal = () => {
    return cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  return (
    <div className={`cart-sidebar ${isOpen ? "cart-open" : ""}`}>
      <div className="cart-sidebar-content">
        <div className="cart-header">
          <h2>Shopping Cart {cart.items.length > 0 && `(${cart.items.length})`}</h2>
          <IoMdClose
            className="cart-close-btn"
            onClick={closeSidebar}
            size={24}
          />
        </div>

        {cart.items.length === 0 ? (
          <section className="empty-cart">
            <p className="empty-cart-heading">Your cart is empty</p>
            <button onClick={closeSidebar}>Continue shopping</button>
            {!user && (
              <>
                <h3>
                  <strong>Have an account?</strong>
                </h3>
                <p style={{ margin: "0px" }}>
                  <Link to="/auth" className="login-link">
                    Log in
                  </Link>{" "}
                  to check out faster.
                </p>
              </>
            )}
            <div className="cart-all-products-cta">
              <Link to="/shop-all">
                <img src="\CartImg.jpg" alt="Shop all products" />
                <div className="cart-cta-link">
                  <span>ALL PRODUCTS →</span>
                </div>
              </Link>
            </div>
          </section>
        ) : (
          <>
            <div className="cart-items">
              {cart.items.map((item) => (
                <div key={item.product._id} className="cart-item">
                  <div className="item-info">
                    <div className="item-image-container">
                      <img 
                        src={`${BASE_URL}` + item.product.images[0]} 
                        alt={item.product.name}
                        onError={(e) => {
                          e.target.src = "/placeholder-product.jpg";
                        }}
                      />
                    </div>
                    <div className="item-details">
                      <h4>{item.product.name}</h4>
                      <p className="item-price">Rs. {item.product.price}</p>
                      {item.product.discount && (
                        <span className="coupon-code">
                          {item.product.discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="item-controls">
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item.product._id)}
                    >
                      <FiTrash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-subtotal">
                <span>Subtotal</span>
                <span>Rs. {calculateSubtotal().toFixed(2)}</span>
              </div>
              <Link to="/cart" className="view-cart-btn" onClick={closeSidebar}>
                View Cart
              </Link>
              <Link to="/checkout" className="checkout-btn" onClick={closeSidebar}>
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
