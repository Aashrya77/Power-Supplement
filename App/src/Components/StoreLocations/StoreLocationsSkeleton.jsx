import React from "react";
import "./StoreLocationsSkeleton.css";

const StoreLocationsSkeleton = () => {
  return (
    <div className="store-locations-skeleton">
      <div className="store-locations-skeleton-header">
        <div className="skeleton-title shimmer"></div>
        <div className="skeleton-subtitle shimmer"></div>
      </div>

      <div className="stores-skeleton-grid">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div className="store-skeleton-card" key={item}>
            <div className="store-skeleton-header">
              <div className="skeleton-store-name shimmer"></div>
            </div>
            
            <div className="store-skeleton-details">
              <div className="store-skeleton-item">
                <div className="skeleton-icon shimmer"></div>
                <div className="skeleton-text-block">
                  <div className="skeleton-label shimmer"></div>
                  <div className="skeleton-value shimmer"></div>
                </div>
              </div>

              <div className="store-skeleton-item">
                <div className="skeleton-icon shimmer"></div>
                <div className="skeleton-text-block">
                  <div className="skeleton-label shimmer"></div>
                  <div className="skeleton-value shimmer"></div>
                </div>
              </div>

              <div className="store-skeleton-item">
                <div className="skeleton-icon shimmer"></div>
                <div className="skeleton-text-block">
                  <div className="skeleton-label shimmer"></div>
                  <div className="skeleton-value shimmer"></div>
                </div>
              </div>
            </div>

            <div className="skeleton-button shimmer"></div>
          </div>
        ))}
      </div>

      <div className="store-locations-skeleton-cta">
        <div className="skeleton-cta-title shimmer"></div>
        <div className="skeleton-cta-text shimmer"></div>
        <div className="skeleton-cta-button shimmer"></div>
      </div>
    </div>
  );
};

export default StoreLocationsSkeleton;
