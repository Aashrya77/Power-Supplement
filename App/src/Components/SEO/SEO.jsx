import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component for managing all SEO-related elements
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.canonicalUrl - Canonical URL for the page
 * @param {string} props.ogImage - Open Graph image URL
 * @param {string} props.ogType - Open Graph type (default: website)
 * @param {Array} props.keywords - Keywords for meta keywords tag
 * @param {Object} props.structuredData - JSON-LD structured data
 * @param {boolean} props.noindex - Whether to add noindex meta tag
 */
const SEO = ({
  title = 'Top Sports Supplement | Power Supplement',
  description = 'Premium quality sports supplements for athletes and fitness enthusiasts. Shop pre-workouts, protein, fat burners and more.',
  canonicalUrl,
  ogImage = '/PowerLogo.png',
  ogType = 'website',
  keywords = ['sports supplements', 'pre workout', 'protein powder', 'fat burner', 'fitness supplements'],
  structuredData,
  noindex = false,
}) => {
  // Construct the full title with brand name
  const fullTitle = title.includes('Power Supplement') ? title : `${title} | Power Supplement`;
  
  // Construct the canonical URL
  const siteUrl = window.location.origin;
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : window.location.href;
  
  // Default structured data for the website
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Power Supplement',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  // Merge provided structured data with default
  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Robots Meta Tags */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Open Graph Meta Tags for Social Media */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Power Supplement" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Mobile Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#ffffff" />
      
      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
