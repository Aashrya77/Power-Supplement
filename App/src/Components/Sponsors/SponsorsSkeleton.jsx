import React from 'react';
import './SponsorsSkeleton.css';

const SponsorsSkeleton = () => {
  return (
    <div className="Sponsors">
      <h1>OUR SPONSORS</h1>
      <div className="skeleton-subtitle"></div>
      
      <div className="sponsors-grid">
        {[...Array(2)].map((_, index) => (
          <div className="sponsor-card skeleton-sponsor" key={index}>
            <div className="skeleton-sponsor-link">
              <div className="sponsor-logo skeleton-logo">
                <div className="skeleton-logo-img"></div>
              </div>
              <div className="sponsor-info">
                <div className="skeleton-sponsor-title"></div>
                <div className="skeleton-sponsor-description"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="sponsors-cta skeleton-cta">
        <div className="skeleton-cta-title"></div>
        <div className="skeleton-cta-text"></div>
        <div className="skeleton-cta-button"></div>
      </div>
    </div>
  );
};

export default SponsorsSkeleton;
