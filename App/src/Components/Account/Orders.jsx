import React from 'react';
import { Link } from 'react-router-dom';
import './Orders.css';

const Orders = () => {
  // This would typically come from an API call
  const orders = [];

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>Orders</h2>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No orders yet</p>
          <p>Go to store to place an order.</p>
          <Link to="/shop-all" className="shop-link">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              {/* Order details would go here */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
