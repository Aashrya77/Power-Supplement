import React, { useEffect, useRef, useState } from 'react';
import { SkeletonImage } from './Skeleton/Skeleton';

/**
 * Generic lazy-loading image component using IntersectionObserver.
 * Shows skeleton while loading and adds native `loading="lazy"` attribute as a fallback.
 */
const LazyImage = ({ src, alt = '', className = '', ...rest }) => {
  const imgRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const current = imgRef.current;
    if (!current) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.disconnect();
            }
          });
        },
        { rootMargin: '150px' }
      );
      observer.observe(current);
      return () => observer.disconnect();
    }

    // Fallback for browsers without IO support
    setIsVisible(true);
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div ref={imgRef} className={`lazy-image-container ${className}`} style={{ position: 'relative' }}>
      {!isLoaded && isVisible && (
        <SkeletonImage 
          width="100%" 
          height={rest.height || '200px'} 
          className="lazy-image-skeleton"
        />
      )}
      {isVisible && (
        <img
          src={src}
          data-src={src}
          alt={alt}
          className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
          loading="lazy"
          onLoad={handleImageLoad}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            position: isLoaded ? 'static' : 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          {...rest}
        />
      )}
    </div>
  );
};

export default LazyImage;
