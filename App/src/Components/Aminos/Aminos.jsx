import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Aminos.css';
import { FaStar } from 'react-icons/fa';
import BASE_URL from '../../config';

const Aminos = () => {
  const [products, setProducts] = useState([]);
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
      const possibleNames = ['Aminos', 'aminos', 'amino acids', 'amino-acids'];
      let aminosCategory = null;
      
      for (const name of possibleNames) {
        const found = response.data.find(
          category => category.name.toLowerCase() === name.toLowerCase()
        );
        if (found) {
          aminosCategory = found;
          break;
        }
      }

      if (aminosCategory) {
        setCategoryId(aminosCategory._id);
      } else {
        console.error('Aminos category not found in any format');
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
      setProducts(response.data.products || []);
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
        setProducts([]);
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
    <div className="aminos-container">
      <div className="aminos-header">
        <h1>Amino Acid Supplements</h1>
        <p>
          Support your muscle recovery and performance with our premium amino acid supplements.
          Our scientifically formulated products deliver essential amino acids to enhance
          your fitness results and overall athletic performance.
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

      <div className="descriptions-aminos">
        <div className="paragraph">
          <h2>Premium Amino Acid Supplements</h2>
          <p>
            Our amino acid supplements are crafted with the finest ingredients to support
            your muscle recovery and athletic performance. Whether you're an athlete, bodybuilder,
            or fitness enthusiast, our premium amino acid products are designed to help
            you achieve your fitness goals.
          </p>
        </div>
        <div className="paragraph">
          <h2>Why Choose Our Amino Acid Supplements?</h2>
          <p>
            <strong>Quality amino acid supplements</strong> are essential for muscle
            recovery and performance enhancement. Our products are formulated with essential
            amino acids and are designed to support muscle protein synthesis and athletic endurance.
          </p>
        </div>
        <div className="paragraph">
          <h2>Benefits of Amino Acid Supplements</h2>
          <ul>
            <li>
              <strong>Muscle Recovery:</strong> Support your body's natural recovery
              process after intense workouts.
            </li>
            <li>
              <strong>Performance Enhancement:</strong> Enhance endurance and reduce
              fatigue during training sessions.
            </li>
            <li>
              <strong>Quality Ingredients:</strong> Made with premium amino acids
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

export default Aminos;