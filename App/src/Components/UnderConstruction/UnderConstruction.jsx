import React from 'react';
import { Link } from 'react-router-dom';
import './UnderConstruction.css';

const UnderConstruction = () => {
  return (
    <div className="under-construction-container">
      <div className="under-construction-content">
        <div className="construction-icon">
          <span>🚧</span>
        </div>
        <h1>Under Construction</h1>
        <p>We're working hard to bring you this page. Check back soon for updates!</p>
        <div className="construction-actions">
          <Link to="/" className="btn-home">
            Go Back Home
          </Link>
          <Link to="/shop-all" className="btn-shop">
            Browse Products
          </Link>
        </div>
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
        <p className="progress-text">Coming Soon...</p>
      </div>
    </div>
  );
};

export default UnderConstruction;
