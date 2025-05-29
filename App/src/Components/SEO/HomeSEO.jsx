import React from 'react';
import SEO from './SEO';

/**
 * SEO component specifically for the home page
 */
const HomeSEO = () => {
  // Create structured data for the organization
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Power Supplement',
    url: window.location.origin,
    logo: `${window.location.origin}/PowerLogo.png`,
    sameAs: [
      'https://www.facebook.com/powersupplement',
      'https://www.instagram.com/powersupplement',
      'https://twitter.com/powersupplement'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-POWER-SUP',
      contactType: 'customer service',
      availableLanguage: 'English'
    }
  };

  return (
    <SEO
      title="Premium Sports Supplements for Peak Performance | Power Supplement"
      description="Discover premium quality sports supplements designed for athletes and fitness enthusiasts. Shop pre-workouts, protein powders, fat burners and more for optimal results."
      canonicalUrl="/"
      ogImage="/home-hero.jpg"
      ogType="website"
      keywords={[
        'sports supplements',
        'pre workout supplements',
        'protein powder',
        'fat burners',
        'fitness supplements',
        'bodybuilding supplements',
        'workout nutrition',
        'performance supplements',
        'muscle building supplements',
        'Power Supplement'
      ]}
      structuredData={structuredData}
    />
  );
};

export default HomeSEO;
