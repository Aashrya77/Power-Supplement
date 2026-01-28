import React, { Suspense } from 'react';
import useLazyLoad from '../../hooks/useLazyLoad';
import SponsorsSkeleton from './SponsorsSkeleton';
import './LazySponsors.css';

// Lazy load the actual Sponsors component
const Sponsors = React.lazy(() => import('./Sponsors'));

const LazySponsors = () => {
  const { ref, hasBeenVisible } = useLazyLoad({
    rootMargin: '200px', // Start loading 200px before it comes into view
    threshold: 0.1
  });

  return (
    <div ref={ref} className="lazy-sponsors-container">
      {hasBeenVisible ? (
        <Suspense fallback={<SponsorsSkeleton />}>
          <Sponsors />
        </Suspense>
      ) : (
        <SponsorsSkeleton />
      )}
    </div>
  );
};

export default LazySponsors;
