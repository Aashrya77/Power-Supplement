import React from 'react';
import SEO from './SEO';

/**
 * SEO component specifically for product pages
 * 
 * @param {Object} props - Component props
 * @param {Object} props.product - Product data
 */
const ProductSEO = ({ product }) => {
  if (!product) return null;
  
  const { name, description, price, images, category, _id, flavors = [] } = product;
  
  // Create a clean description without HTML tags
  const cleanDescription = description ? description.replace(/<[^>]*>?/gm, '') : '';
  
  // Create structured data for the product
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: cleanDescription,
    image: images && images.length > 0 ? images.map(img => `${window.location.origin}${img}`) : [],
    sku: _id,
    mpn: _id,
    brand: {
      '@type': 'Brand',
      name: 'Power Supplement'
    },
    offers: {
      '@type': 'Offer',
      url: window.location.href,
      price: price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Power Supplement'
      }
    }
  };

  // Add product variants if flavors exist
  if (flavors && flavors.length > 0) {
    structuredData.offers = {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: price,
      highPrice: price,
      offerCount: flavors.length,
      offers: flavors.map(flavor => ({
        '@type': 'Offer',
        name: `${name} - ${flavor.name}`,
        price: price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition'
      }))
    };
  }

  // Create keywords based on product data
  const keywords = [
    name,
    category?.name || '',
    'sports supplement',
    ...flavors.map(f => f.name),
    'fitness',
    'workout',
    'nutrition'
  ].filter(Boolean);

  return (
    <SEO
      title={name}
      description={cleanDescription.substring(0, 160) || `Buy ${name} - Premium quality sports supplement for optimal performance.`}
      canonicalUrl={`/product/${_id}`}
      ogImage={images && images.length > 0 ? images[0] : '/PowerLogo.png'}
      ogType="product"
      keywords={keywords}
      structuredData={structuredData}
    />
  );
};

export default ProductSEO;
