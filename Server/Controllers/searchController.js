const Product = require('../Models/Product');
const Category = require('../Models/Category');

// Get search suggestions and products based on query
exports.getSearchSuggestions = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query || query.trim().length === 0) {
            return res.json({
                suggestions: [],
                products: [],
                categories: []
            });
        }

        // Search for categories first
        const categories = await Category.find({
            name: { $regex: query, $options: 'i' }
        })
        .select('name')
        .limit(5);


        // Get category IDs for product search
        const categoryIds = categories.map(cat => cat._id);

        // Search for products
        const productQuery = {
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $in: categoryIds } }
            ]
        };


        const products = await Product.find(productQuery)
            .populate('category', 'name')
            .select('name images price category')
            .limit(3);


        // Generate search suggestions
        const suggestions = new Set();
        
        // Add category names as suggestions
        categories.forEach(category => suggestions.add(category.name));
        
        // Add product-based suggestions
        products.forEach(product => {
            suggestions.add(product.name);
            if (product.category?.name) {
                suggestions.add(product.category.name);
            }
        });

        // Common search terms based on product attributes
        const commonTerms = ['best', 'top', 'new', 'sale'];
        const matchedCommonSuggestions = commonTerms
            .map(term => `${term} ${query}`)
            .filter(suggestion => 
                products.some(product => 
                    product.name.toLowerCase().includes(query.toLowerCase()) ||
                    (product.category?.name || '').toLowerCase().includes(query.toLowerCase())
                )
            );

        // Combine all suggestions
        const allSuggestions = [...suggestions, ...matchedCommonSuggestions]
            .slice(0, 5); // Limit to top 5 suggestions

        // Format products for response
        const formattedProducts = products.map(product => ({
            _id: product._id,
            name: product.name,
            images: product.images,
            price: product.price,
            category: product.category?.name
        }));

        const response = {
            suggestions: allSuggestions,
            products: formattedProducts,
            categories: categories.map(c => c.name)
        };

        res.json(response);

    } catch (error) {
        console.error('Search suggestion error:', error);
        res.status(500).json({ error: 'Error generating search suggestions' });
    }
};
