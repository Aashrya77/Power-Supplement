import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ShopAll.css';
import { FaStar } from 'react-icons/fa';
import BASE_URL from '../../config';

const ShopAll = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = `${BASE_URL}/api/v1/products?page=${currentPage}&limit=9`;
      
      // Add sorting parameter
      if (sortBy === 'featured') {
        url += '&sort=random';
      } else if (sortBy === 'price-low') {
        url += '&sort=price';
      } else if (sortBy === 'price-high') {
        url += '&sort=-price';
      } else if (sortBy === 'name') {
        url += '&sort=name';
      }

      const response = await axios.get(url);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar key={index} className={index < rating ? 'star filled' : 'star'} />
    ));
  };


  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="shop-all-container">
      <div className="shop-all-header">
        <h1>All Products</h1>
        <p>
          Browse our complete collection of premium supplements designed to support
          your fitness journey and help you achieve your goals.
        </p>
      </div>

      <div className="filters-header">
        <div className="sort-section">
          <span>Sort by:</span>
          <select 
            value={sortBy} 
            onChange={handleSort}
            className="sort-select"
          >
            <option value="featured">Random</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <>
          <div className="products-grid">
            {products.map(product => (
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
                    <div className="product-rating">
                      {renderStars(product.rating || 0)}
                    </div>
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

          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Previous
            </button>
            {renderPagination()}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShopAll;