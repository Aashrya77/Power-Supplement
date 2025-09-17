import React from 'react';
import './Skeleton.css';

const Skeleton = ({ variant = 'text', width = '100%', height = '20px', className = '' }) => {
  return (
    <div 
      className={`skeleton skeleton-${variant} ${className}`}
      style={{ width, height }}
    />
  );
};

// Predefined skeleton components for common use cases
export const SkeletonText = ({ lines = 1, className = '' }) => (
  <div className={`skeleton-text-container ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton 
        key={index}
        variant="text" 
        width={index === lines - 1 ? '75%' : '100%'}
        height="16px"
        className="skeleton-text-line"
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className = '' }) => (
  <div className={`skeleton-card ${className}`}>
    <Skeleton variant="rectangular" width="100%" height="200px" className="skeleton-card-image" />
    <div className="skeleton-card-content">
      <Skeleton variant="text" width="80%" height="20px" className="skeleton-card-title" />
      <SkeletonText lines={2} className="skeleton-card-description" />
      <Skeleton variant="rectangular" width="120px" height="36px" className="skeleton-card-button" />
    </div>
  </div>
);

export const SkeletonImage = ({ width = '100%', height = '200px', className = '' }) => (
  <Skeleton 
    variant="rectangular" 
    width={width} 
    height={height} 
    className={`skeleton-image ${className}`}
  />
);

export const PageSkeleton = () => (
  <div className="page-skeleton">
    <div className="skeleton-hero">
      <Skeleton variant="rectangular" width="100%" height="400px" />
    </div>
    <div className="skeleton-content">
      <div className="container">
        <Skeleton variant="text" width="60%" height="32px" className="skeleton-title" />
        <SkeletonText lines={3} className="skeleton-description" />
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Skeleton;
