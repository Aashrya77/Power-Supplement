const fs = require('fs');
const path = require('path');
const Product = require('../Models/Product');
const Category = require('../Models/Category');

/**
 * Generate a simple XML sitemap without external dependencies
 * @param {string} baseUrl - The base URL of the website
 * @returns {Promise<string>} - The sitemap XML as a string
 */
async function generateSitemap(baseUrl) {
  try {
    // Start XML document
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    
    // Add static pages
    const staticPages = [
      { url: '/', changefreq: 'daily', priority: '1.0' },
      { url: '/shop-all', changefreq: 'daily', priority: '0.9' },
      { url: '/collections/pre-workout', changefreq: 'weekly', priority: '0.8' },
      { url: '/collections/stacks', changefreq: 'weekly', priority: '0.8' },
      { url: '/fat-burner', changefreq: 'weekly', priority: '0.8' },
      { url: '/protein', changefreq: 'weekly', priority: '0.8' },
      { url: '/partner-program', changefreq: 'monthly', priority: '0.7' },
      { url: '/auth', changefreq: 'monthly', priority: '0.6' },
    ];

    staticPages.forEach(page => {
      sitemap += `\n  <url>\n    <loc>${baseUrl}${page.url}</loc>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`;
    });

    // Add dynamic product pages
    const products = await Product.find({}, '_id updatedAt');
    products.forEach(product => {
      const lastmod = product.updatedAt ? `\n    <lastmod>${product.updatedAt.toISOString()}</lastmod>` : '';
      
      sitemap += `\n  <url>\n    <loc>${baseUrl}/product/${product._id}</loc>${lastmod}\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
    });

    // Add dynamic category pages
    const categories = await Category.find({}, '_id updatedAt');
    categories.forEach(category => {
      const lastmod = category.updatedAt ? `\n    <lastmod>${category.updatedAt.toISOString()}</lastmod>` : '';
      
      sitemap += `\n  <url>\n    <loc>${baseUrl}/collections/${category._id}</loc>${lastmod}\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
    });

    // Close XML document
    sitemap += '\n</urlset>';
    
    // Write sitemap to file
    const publicPath = path.join(__dirname, '..', 'public');
    
    // Create the public directory if it doesn't exist
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true });
    }
    
    fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), sitemap);
    
    return sitemap;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
}

module.exports = { generateSitemap };
