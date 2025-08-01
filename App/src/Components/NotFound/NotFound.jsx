import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">
          <span>404</span>
        </div>
        <h1>Page Not Found</h1>
        <p>Sorry, the page you are looking for doesn't exist or has been moved.</p>
        <div className="not-found-actions">
          <Link to="/" className="btn-home">
            Go Back Home
          </Link>
          <Link to="/shop-all" className="btn-shop">
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
