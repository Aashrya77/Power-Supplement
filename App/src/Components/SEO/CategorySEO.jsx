import React from 'react';
import SEO from './SEO';

/**
 * SEO component specifically for category/collection pages
 * 
 * @param {Object} props - Component props
 * @param {Object} props.category - Category data
 * @param {Array} props.products - Products in this category
 */
const CategorySEO = ({ category, products = [] }) => {
  if (!category) return null;
  
  const { name, description, _id, image } = category;
  
  // Create a clean description without HTML tags
  const cleanDescription = description ? description.replace(/<[^>]*>?/gm, '') : '';
  
  // Default description if none provided
  const seoDescription = cleanDescription || 
    `Shop our collection of ${name} supplements. Premium quality sports nutrition products for optimal performance and results.`;
  
  // Create structured data for the category page
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${name} Collection | Power Supplement`,
    description: seoDescription,
    url: window.location.href,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.name,
          url: `${window.location.origin}/product/${product._id}`,
          image: product.images && product.images.length > 0 
            ? `${window.location.origin}${product.images[0]}`
            : `${window.location.origin}/PowerLogo.png`,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'USD'
          }
        }
      }))
    }
  };

  // Create keywords based on category data
  const keywords = [
    name,
    'sports supplements',
    'fitness supplements',
    'workout supplements',
    ...products.slice(0, 5).map(p => p.name) // Add top 5 product names as keywords
  ].filter(Boolean);

  return (
    <SEO
      title={`${name} Supplements Collection`}
      description={seoDescription.substring(0, 160)}
      canonicalUrl={`/collections/${_id}`}
      ogImage={image || '/PowerLogo.png'}
      ogType="website"
      keywords={keywords}
      structuredData={structuredData}
    />
  );
};

export default CategorySEO;
