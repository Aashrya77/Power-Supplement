const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
const Product = require('../Models/Product');
const Category = require('../Models/Category');

// Create public directory if it doesn't exist
const publicPath = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath, { recursive: true });
}

// Route to generate and serve the sitemap
router.get('/sitemap.xml', async (req, res) => {
  try {
    // Create a sitemap stream
    const smStream = new SitemapStream({ hostname: `${req.protocol}://${req.get('host')}` });
    const pipeline = smStream.pipe(createGzip());
    
    // Add static pages
    const staticPages = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/shop-all', changefreq: 'daily', priority: 0.9 },
      { url: '/collections/pre-workout', changefreq: 'weekly', priority: 0.8 },
      { url: '/collections/stacks', changefreq: 'weekly', priority: 0.8 },
      { url: '/fat-burner', changefreq: 'weekly', priority: 0.8 },
      { url: '/protein', changefreq: 'weekly', priority: 0.8 },
      { url: '/partner-program', changefreq: 'monthly', priority: 0.7 },
      { url: '/auth', changefreq: 'monthly', priority: 0.6 },
    ];

    staticPages.forEach(page => {
      smStream.write(page);
    });

    // Add dynamic product pages
    const products = await Product.find({}, '_id updatedAt');
    products.forEach(product => {
      smStream.write({
        url: `/product/${product._id}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: product.updatedAt ? product.updatedAt.toISOString() : undefined
      });
    });

    // Add dynamic category pages
    const categories = await Category.find({}, '_id updatedAt');
    categories.forEach(category => {
      smStream.write({
        url: `/collections/${category._id}`,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: category.updatedAt ? category.updatedAt.toISOString() : undefined
      });
    });

    // End the stream
    smStream.end();

    // Set headers
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');
    
    // Stream the response
    pipeline.pipe(res).on('error', (err) => {
      console.error('Error streaming sitemap:', err);
      res.status(500).end();
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
});

// Route to serve robots.txt
router.get('/robots.txt', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const robotsTxt = `
User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
  `.trim();
  
  res.setHeader('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

module.exports = router;
