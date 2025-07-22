import React, { useEffect, useRef, useState } from 'react';

/**
 * Generic lazy-loading image component using IntersectionObserver.
 * Adds native `loading="lazy"` attribute as a fallback.
 */
const LazyImage = ({ src, alt = '', className = '', ...rest }) => {
  const imgRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : ''}
      data-src={src}
      alt={alt}
      className={className}
      loading="lazy"
      {...rest}
    />
  );
};

export default LazyImage;
