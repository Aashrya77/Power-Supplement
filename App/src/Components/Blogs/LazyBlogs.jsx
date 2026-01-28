import React, { Suspense } from 'react';
import BlogsSkeleton from './BlogsSkeleton';
import './LazyBlogs.css';

const Blogs = React.lazy(() => import('./Blogs'));

const LazyBlogs = () => {
  return (
    <div className="lazy-blogs-wrapper">
      <Suspense fallback={<BlogsSkeleton />}>
        <Blogs />
      </Suspense>
    </div>
  );
};

export default LazyBlogs;
