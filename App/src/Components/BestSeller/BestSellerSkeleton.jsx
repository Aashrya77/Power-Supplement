import React from 'react';
import './BestSellerSkeleton.css';

const BestSellerSkeleton = () => {
  return (
    <div className="BestSeller">
      <h1>BEST SELLERS</h1>
      <div className="BestSeller-products">
        {[...Array(4)].map((_, index) => (
          <div className="BestSeller-product skeleton-product" key={index}>
            <div className="skeleton-product-link">
              <div className="BestSellerImg skeleton-image">
                <div className="skeleton-img"></div>
              </div>
              <div className="BestSeller-texts">
                <div className="skeleton-title"></div>
                <div className="BestSeller-rating">
                  <div className="skeleton-stars"></div>
                  <div className="skeleton-reviews"></div>
                </div>
                <div className="BestSeller-price-container">
                  <div className="skeleton-price"></div>
                </div>
              </div>
            </div>
            <div className="skeleton-button"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellerSkeleton;
