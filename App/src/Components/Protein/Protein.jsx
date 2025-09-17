import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Protein.css';
import { FaStar } from 'react-icons/fa';
import BASE_URL from '../../config';

const Protein = () => {
  const [products, setProducts] = useState([]); // Fix: initialize products as an empty array
  const [flavors, setFlavors] = useState([]);
  const [selectedFlavor, setSelectedFlavor] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [categoryId, setCategoryId] = useState(null);

  useEffect(() => {
    fetchCategoryId();
    fetchFlavors();
  }, []);

  useEffect(() => {
    if (categoryId) {
      fetchProducts();
    }
  }, [categoryId]);

  const fetchCategoryId = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/categories`);
      
      // Try different possible category names
      const possibleNames = ['Protein', 'protein', 'proteins', 'Proteins'];
      let proteinCategory = null;
      
      for (const name of possibleNames) {
        const found = response.data.find(
          category => category.name.toLowerCase() === name.toLowerCase()
        );
        if (found) {
          proteinCategory = found;
          break;
        }
      }

      if (proteinCategory) {
        setCategoryId(proteinCategory._id);
      } else {
        console.error('Protein category not found in any format');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchFlavors = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/flavors`);
      setFlavors(response.data);
    } catch (error) {
      console.error('Error fetching flavors:', error);
    }
  };

  const fetchProducts = async () => {
    if (!categoryId) {
      console.error('No category ID available');
      return;
    }
    
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/products?category=${categoryId}`);
      setProducts(response.data.products || []); // Fix: access products from response.data.products
    } catch (error) {
      console.error('Error fetching products:', error.response?.data || error.message);
      // Fallback to fetch all products if category filtering fails
      try {
        const allResponse = await axios.get(`${BASE_URL}/api/v1/products`);
        const filteredProducts = allResponse.data.products?.filter(
          product => product.category?._id === categoryId
        ) || [];
        setProducts(filteredProducts);
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        setProducts([]); // Set empty array on error
      }
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    // Ensure products is an array
    if (!Array.isArray(products)) {
      return [];
    }

    let result = [...products];

    // Apply flavor filter
    if (selectedFlavor !== 'all') {
      result = result.filter(product => 
        product.flavors?.some(flavor => flavor._id === selectedFlavor)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedFlavor, sortBy]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar key={index} className={index < rating ? 'star filled' : 'star'} />
    ));
  };

 
  return (
    <div className="protein-container">
      <div className="protein-header">
        <h1>Protein Supplements</h1>
        <p>
          Power up your muscle recovery and growth with our premium protein supplements.
          Our scientifically formulated products deliver the highest quality protein
          to support your fitness goals.
        </p>
      </div>
      <div className="filters-header">
        <div className="filter-section">
          <span>Filter:</span>
          <select 
            value={selectedFlavor} 
            onChange={(e) => setSelectedFlavor(e.target.value)}
            className="flavor-select"
          >
            <option value="all">All Flavors</option>
            {flavors.map(flavor => (
              <option key={flavor._id} value={flavor._id}>
                {flavor.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sort-section">
          <span>Sort by:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
          <span className="product-count">{filteredAndSortedProducts.length} products</span>
        </div>
      </div>

      <div className="products-grid">
        {filteredAndSortedProducts.map(product => (
          <div key={product._id} className="product-card">
            <Link to={`/product/${product._id}`} className="product-link">
              <div className="product-image">
                {product.images && product.images.length > 0 && (
                  <img
                    src={`${BASE_URL}${product.images[0]}`}
                    alt={product.name} 
                  />
                )}
                {product.stock === 0 && <div className="sold-out-badge">Sold out</div>}
                {product.salePrice && <div className="sale-badge">Sale</div>}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                {/* <div className="product-rating">
                  {renderStars(product.rating || 0)}
                </div> */}
                <div className="product-price">
                  {product.salePrice ? (
                    <>
                      <span className="original-price">{product.price}</span>
                      <span className="sale-price">{product.salePrice}</span>
                    </>
                  ) : (
                    <span>Rs. {product.price} NPR</span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="descriptions-protein">
        <div className="paragraph">
          <h2>Premium Protein Supplements</h2>
          <p>
            Our protein supplements are crafted with the finest ingredients to support
            your muscle recovery and growth. Whether you're an athlete, bodybuilder,
            or fitness enthusiast, our premium protein products are designed to help
            you achieve your goals.
          </p>
        </div>
        <div className="paragraph">
          <h2>Why Choose Our Protein Supplements?</h2>
          <p>
            <strong>Quality protein supplements</strong> are essential for muscle
            recovery and growth. Our products are formulated with high-quality protein
            sources and are designed to be easily digestible and effective.
          </p>
        </div>
        <div className="paragraph">
          <h2>Benefits of Protein Supplements</h2>
          <ul>
            <li>
              <strong>Muscle Recovery:</strong> Support your body's natural recovery
              process after intense workouts.
            </li>
            <li>
              <strong>Muscle Growth:</strong> Provide the building blocks needed
              for muscle development and strength.
            </li>
            <li>
              <strong>Quality Ingredients:</strong> Made with premium protein sources
              and carefully selected ingredients.
            </li>
            <li>
              <strong>Great Taste:</strong> Available in a variety of delicious
              flavors to suit your preference.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Protein;