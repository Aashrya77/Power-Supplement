import React, { Suspense, lazy } from 'react';
import StoreLocationsSkeleton from './StoreLocationsSkeleton';
import './LazyStoreLocations.css';

const StoreLocations = lazy(() => import('./StoreLocations'));

const LazyStoreLocations = () => {
  return (
    <div className="lazy-store-locations-container">
      <Suspense fallback={<StoreLocationsSkeleton />}>
        <StoreLocations />
      </Suspense>
    </div>
  );
};

export default LazyStoreLocations;
