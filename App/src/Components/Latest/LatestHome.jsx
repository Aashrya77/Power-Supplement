import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./LatestHome.css";
import BASE_URL from "../../config";

const LatestHome = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestProducts();
  }, []);

  const fetchLatestProducts = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/products?sort=-createdAt&limit=4`
      );
      setLatestProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching latest products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="LatestHome">
        <div className="loading">Loading latest releases...</div>
      </div>
    );
  }

  return (
    <div className="LatestHome">
      <h1>LATEST RELEASES</h1>

      <div className="LatestHome-products">
        {latestProducts.map((product) => (
          <div className="LatestHome-product" key={product._id}>
            <Link to={`/product/${product._id}`} className="LatestHome-product-link">
              {product.onSale && <span className="sale-badge">Sale</span>}
              <div className="LatestHomeImg">
                {product.images && product.images[0] && (
                  <img
                    src={`${BASE_URL}${product.images[0]}`}
                    alt={product.name}
                  />
                )}
              </div>
              <div className="LatestHome-texts">
                <h4>{product.name}</h4>
                <div className="LatestHome-price-container">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="LatestHome-original-price">
                      {product.originalPrice.toFixed(2)} NPR
                    </span>
                  )}
                  <span className="LatestHome-sale-price">
                    Rs. {product.price.toFixed(2)} NPR
                  </span>
                </div>
              </div>
            </Link>
            <Link to={`/product/${product._id}`} className="LatestHome-choose-options">
              Choose options
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestHome;
