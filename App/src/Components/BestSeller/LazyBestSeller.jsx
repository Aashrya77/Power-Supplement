import React, { Suspense } from 'react';
import useLazyLoad from '../../hooks/useLazyLoad';
import BestSellerSkeleton from './BestSellerSkeleton';
import './LazyBestSeller.css';

// Lazy load the actual BestSeller component
const BestSeller = React.lazy(() => import('./BestSeller'));

const LazyBestSeller = () => {
  const { ref, hasBeenVisible } = useLazyLoad({
    rootMargin: '200px', // Start loading 200px before it comes into view
    threshold: 0.1
  });

  return (
    <div ref={ref} className="lazy-bestseller-container">
      {hasBeenVisible ? (
        <Suspense fallback={<BestSellerSkeleton />}>
          <BestSeller />
        </Suspense>
      ) : (
        <BestSellerSkeleton />
      )}
    </div>
  );
};

export default LazyBestSeller;
