import React from "react";
import './CTA2.css'
import { FaArrowRight } from "react-icons/fa";
const CTA2 = () => {
  return (
    <div className="CTA2">
      <div className="cta2Texts">
         <h2>Breakthrough Your Limits. Be Unstoppable.</h2>
      <p>
        Sign up for BPI Sports emails and gain access to exclusive offers,
        cutting-edge science, and training tips from the best. We don't just
        create supplements, we fuel the fire within.
      </p>
      <div className="cta2EmailSection">
        <input type="email" className="cta2Email" placeholder="Email"/>
        <FaArrowRight className="arrow" size={20}/>
      </div>
      
      
      </div>
     
    </div>
  );
};

export default CTA2;
