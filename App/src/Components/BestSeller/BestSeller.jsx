import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./BestSeller.css";
import BASE_URL from "../../config";

const BestSeller = () => {
  const [bestProducts, setBestProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchBestProducts();
  }, []);

  const fetchBestProducts = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/products?sort=-sales&limit=4`
      );
      setBestProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching best products:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating = 5) => {
    return "★".repeat(rating);
  };


  if (loading) {
    return (
      <div className="BestSeller">
        <div className="loading">Loading best sellers...</div>
      </div>
    );
  }

  return (
    <div className="BestSeller">
      <h1>BEST SELLERS</h1>

      <div className="BestSeller-products">
        {bestProducts.map((product) => (
          <div className="BestSeller-product" key={product._id}>
            <Link to={`/product/${product._id}`} className="BestSeller-product-link">
              {product.onSale && <span className="sale-badge">Sale</span>}
              <div className="BestSellerImg">
                {product.images && product.images[0] && (
                  <img
                    src={`${BASE_URL}${product.images[0]}`}
                    alt={product.name}
                  />
                )}
              </div>
              <div className="BestSeller-texts">
                <h4>{product.name}</h4>
                <div className="BestSeller-rating">
                  <span className="BestSeller-stars">{renderStars(product.rating)}</span>
                  <span className="BestSeller-review-count">
                    ({product.reviews?.length || 0})
                  </span>
                </div>
                <div className="BestSeller-price-container">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="BestSeller-original-price">
                      ${product.originalPrice.toFixed(2)} USD
                    </span>
                  )}
                  <span className="BestSeller-sale-price">
                    Rs. {product.price.toFixed(2)} NPR
                  </span>
                </div>
              </div>
            </Link>
            <Link to={`/product/${product._id}`} className="BestSeller-choose-options">
              Choose options
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
