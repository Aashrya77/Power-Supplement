import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for lazy loading components using Intersection Observer
 * @param {Object} options - Intersection Observer options
 * @returns {Object} - { ref, isVisible, hasBeenVisible }
 */
const useLazyLoad = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const ref = useRef();

  const defaultOptions = {
    root: null,
    rootMargin: '100px', // Load 100px before element comes into view
    threshold: 0.1,
    ...options
  };

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        setHasBeenVisible(true);
        // Once visible, we can disconnect the observer for performance
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      }
    }, defaultOptions);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return { ref, isVisible, hasBeenVisible };
};

export default useLazyLoad;
