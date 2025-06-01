import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./LatestHome.css";
import BASE_URL from "../../config";
import gsap from 'gsap'
import { useGSAP } from "@gsap/react";
import {ScrollTrigger} from 'gsap/all'
import { useRef } from "react";
gsap.registerPlugin(ScrollTrigger, useGSAP) 

const LatestHome = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef()

  useGSAP(() => {
    if(latestProducts.length > 0){
      gsap.fromTo(".product-ani", {
      opacity: .5,
    }, {
      opacity: 1,
      ease: 'power1.inOut',
      duration: .3,
      stagger: .3,
      scrollTrigger: {
        trigger: '.LatestHome-products',
        start: "top 60%",
        id: 'latestId',
        toggleActions: 'play none none none',
      }
    })
    }
   
  }, {scope: containerRef, dependencies: [latestProducts]})

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
    <div className="LatestHome" ref={containerRef}>
      <h1>LATEST RELEASES</h1>

      <div className="LatestHome-products">
        {latestProducts.map((product) => (
          <div className="LatestHome-product product-ani" key={product._id}>
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
                      {product.originalPrice} NPR
                    </span>
                  )}
                  <span className="LatestHome-sale-price">
                    Rs. {product.price} NPR
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
