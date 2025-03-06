import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './FatBurner.css';
import { FaStar } from 'react-icons/fa';
import BASE_URL from '../../config';

const FatBurner = () => {
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
      console.log('All categories:', response.data);
      
      // Try different possible category names
      const possibleNames = ['Fat Burners', 'fat-burners', 'fat burners', 'fatburners'];
      let fatBurnerCategory = null;
      
      for (const name of possibleNames) {
        const found = response.data.find(
          category => category.name.toLowerCase() === name.toLowerCase()
        );
        if (found) {
          console.log(`Found category with name: ${name}`, found);
          fatBurnerCategory = found;
          break;
        }
      }

      if (fatBurnerCategory) {
        console.log('Setting category ID:', fatBurnerCategory._id);
        setCategoryId(fatBurnerCategory._id);
      } else {
        console.log('Available category names:', response.data.map(c => c.name));
        console.error('Fat burner category not found in any format');
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
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/products?category=${categoryId}`);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]); // Set empty array on error
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = Array.isArray(products) ? [...products] : [];

    if (selectedFlavor !== 'all') {
      result = result.filter(product => 
        product.flavors.some(flavor => flavor._id === selectedFlavor)
      );
    }

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

  const formatPrice = (price) => {
    return `$${(price / 100).toFixed(2)} USD`;
  };

  return (
    <div className="fat-burner-container">
      <div className="fatburner-header">
        <h1>Fat Burner Supplements</h1>
        <p>
          Achieve your weight management goals with our premium fat burner supplements.
          Our scientifically formulated products are designed to support your fitness journey
          and help you reach your desired results.
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
                    src={`http://localhost:5500${product.images[0]}`}
                    alt={product.name} 
                  />
                )}
                {product.stock === 0 && <div className="sold-out-badge">Sold out</div>}
                {product.salePrice && <div className="sale-badge">Sale</div>}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <div className="product-rating">
                  {renderStars(product.rating || 0)}
                </div>
                <div className="product-price">
                  {product.salePrice ? (
                    <>
                      <span className="original-price">{formatPrice(product.price)}</span>
                      <span className="sale-price">{formatPrice(product.salePrice)}</span>
                    </>
                  ) : (
                    <span>{formatPrice(product.price)}</span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="descriptions-fatburner">
        <div className="paragraph">
          <h2>Premium Fat Burner Supplements</h2>
          <p>
            Our fat burner supplements are formulated with scientifically-backed ingredients
            to support your weight management goals. Whether you're looking to enhance your
            fitness routine or support your weight loss journey, our premium supplements
            are designed to help you achieve your desired results.
          </p>
        </div>
        <div className="paragraph">
          <h2>What are Fat Burner Supplements?</h2>
          <p>
            <strong>Fat burner supplements</strong> are specially formulated products
            designed to support your body's natural fat-burning processes. These supplements
            typically contain ingredients that may help boost metabolism, enhance energy
            levels, and support appetite control.
          </p>
        </div>
        <div className="paragraph">
          <h2>Benefits of Fat Burner Supplements</h2>
          <ul>
            <li>
              <strong>Enhanced Metabolism:</strong> Support your body's natural
              fat-burning processes with our carefully selected ingredients.
            </li>
            <li>
              <strong>Energy Support:</strong> Stay energized throughout your day
              and workouts with our premium formulations.
            </li>
            <li>
              <strong>Quality Ingredients:</strong> Our supplements are made with
              high-quality ingredients backed by scientific research.
            </li>
            <li>
              <strong>Comprehensive Support:</strong> Get the support you need
              for your weight management goals with our effective formulas.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FatBurner;