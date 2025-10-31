import React, { Suspense, lazy } from 'react';
import './LazyBlogDetail.css';

const BlogDetail = lazy(() => import('./BlogDetail'));

const BlogDetailSkeleton = () => {
  return (
    <div className="blog-detail-skeleton">
      <div className="skeleton-back-btn"></div>
      <div className="skeleton-article">
        <div className="skeleton-header">
          <div className="skeleton-category"></div>
          <div className="skeleton-title"></div>
          <div className="skeleton-meta">
            <div className="skeleton-author">
              <div className="skeleton-avatar"></div>
              <div className="skeleton-author-info">
                <div className="skeleton-line short"></div>
                <div className="skeleton-line shorter"></div>
              </div>
            </div>
            <div className="skeleton-share">
              <div className="skeleton-circle"></div>
              <div className="skeleton-circle"></div>
              <div className="skeleton-circle"></div>
            </div>
          </div>
        </div>
        <div className="skeleton-media"></div>
        <div className="skeleton-content">
          <div className="skeleton-line full"></div>
          <div className="skeleton-line full"></div>
          <div className="skeleton-line medium"></div>
          <div className="skeleton-line full"></div>
          <div className="skeleton-line full"></div>
          <div className="skeleton-line long"></div>
        </div>
      </div>
    </div>
  );
};

const LazyBlogDetail = () => {
  return (
    <Suspense fallback={<BlogDetailSkeleton />}>
      <BlogDetail />
    </Suspense>
  );
};

export default LazyBlogDetail;
