import React from "react";
import "./CTA1.css";
import { Link } from 'react-router-dom';

const CTA1 = () => {
  return (
    <div className="CTA1">
      <div className="img-overlay"></div>
      <div className="cta1Texts">
        <h1>STACK & SAVE</h1>
        <p>Checkout some serious bundles with large savings!</p>
        <Link to="/shop-all" className="shop-now-btn">Shop Now</Link>
      </div>
    </div>
  );
};

export default CTA1;
