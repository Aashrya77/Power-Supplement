import React from "react";
import "./BlogsSkeleton.css";

const BlogsSkeleton = () => {
  return (
    <div className="blogs-skeleton-container">
      {/* Header Skeleton */}
      <div className="blogs-skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-subtitle"></div>
      </div>

      {/* Category Filter Skeleton */}
      <div className="skeleton-categories">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="skeleton-category-btn"></div>
        ))}
      </div>

      {/* Blog Grid Skeleton */}
      <div className="skeleton-blogs-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="skeleton-blog-card">
            <div className="skeleton-blog-image"></div>
            <div className="skeleton-blog-content">
              <div className="skeleton-blog-meta">
                <div className="skeleton-meta-item"></div>
                <div className="skeleton-meta-item"></div>
                <div className="skeleton-meta-item"></div>
              </div>
              <div className="skeleton-blog-title"></div>
              <div className="skeleton-blog-excerpt">
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
              </div>
              <div className="skeleton-blog-btn"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter CTA Skeleton */}
      <div className="skeleton-newsletter-cta">
        <div className="skeleton-newsletter-title"></div>
        <div className="skeleton-newsletter-subtitle"></div>
        <div className="skeleton-newsletter-form">
          <div className="skeleton-newsletter-input"></div>
          <div className="skeleton-newsletter-btn"></div>
        </div>
      </div>
    </div>
  );
};

export default BlogsSkeleton;
