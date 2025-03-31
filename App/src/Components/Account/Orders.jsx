import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Orders.css';
import axios from 'axios';
import BASE_URL from '../../config';

const Orders = () => {
  const [orders, setOrders] = useState([])
  const getUserOrders = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      setOrders(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }



  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    getUserOrders()
  },[])

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
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>Order #{order._id.slice(-6)}</h3>
                <span className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              <div className="order-details">
                <div className="order-info">
                  <p>Ordered on: {formatDate(order.createdAt)}</p>
                  <p>Total Amount: Rs. {order.paymentDetails.amount}</p>
                  <p>Payment Method: {order.paymentMethod}</p>
                  {order.paymentMethod === 'esewa' && (
                    <p>Transaction ID: {order.paymentDetails.transactionId || 'Pending'}</p>
                  )}
                </div>
                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item._id} className="order-item">
                      {item.product && (
                        <>
                          <img src={`${BASE_URL}${item.product.images[0]}`} alt={item.product.name} />
                          <div className="item-details">
                            <h4>{item.product.name}</h4>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: Rs. {item.product.price.toLocaleString()}</p>
                            <p>Total: Rs. {(item.quantity * item.product.price).toLocaleString()}</p>
                          </div>
                        </>
                      )}
                      {!item.product && (
                        <div className="item-details">
                          <p className="product-unavailable">Product no longer available</p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
