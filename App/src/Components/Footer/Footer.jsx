import React from "react";
import "./Footer.css";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { FaCcMastercard } from "react-icons/fa";
const Footer = () => {
  return (
    <>
      <div className="footerSection1">
        <div className="footer">
          <div className="logoSide">
            <div className="logoImg">
              <img src="\PowerLogo.png" alt="" />
            </div>

            <div className="icons">
              <FaFacebook className="icon"/>
              <FaInstagram className="icon"/>
            </div>
          </div>
          <div className="quickLinks">
            <h3>POWER SUPPLEMENT</h3>
            <a href="/auth">Login/Register</a>
            <a href="">About Us</a>
            <a href="">Contact Us</a>
            <a href="">Articles</a>
            <a href="">FAQ</a>
            <a href="/partner-program">JOIN TEAM POWER</a>
          </div>
          <div className="legalTerms">
            <h3>LEGAL</h3>
            <a href="">Terms of service</a>
            <a href="">Refund policy</a>
            <a href="">Shipping Policy</a>
            <a href="">Privacy Policy</a>
            <a href="">Accessibility</a>
            <a href="">Do not sell or share my personal information</a>
          </div>
          <div className="moneyback">
            <h3>100% MONEY BACK GUARANTEE</h3>
            <p>
              Not happy with your purchase? Send it back within 30 days for your
              money back. <span style={{color: '#d32f2f'}}>Money Back Guarantee</span> 
            </p>
          </div>
        </div>
        <div className="cta3">
          <h3 style={{ textAlign: "center" }}>
            Receive Exclusive Updates On New Products & Exclusive Deals!
          </h3>
          <div className="cta2EmailSection">
            <input type="email" className="cta2Email" placeholder="Email" />
            <FaArrowRight className="arrow" size={20} />
          </div>
        </div>
      </div>
      <div className="footerSection2">
        <FaCcMastercard color="white" />
        <h5>© 2025 BPI Sports</h5>
        <p>
          * These statements have not been evaluated by the Food and Drug
          Administration. These products are not intended to diagnose, treat,
          cure or prevent any disease. † When combined with a proper exercise
          and nutrition regimen. Statements based on early-stage independent 3rd
          party in vivo and / or in vitro model scientific research data
          findings for individual ingredients. By placing your order, you agree
          to BPI Sports privacy policy and terms and conditions. Want to become
          a BPI Sports affiliate? Fill out the form to get started! BPI is in
          good standing with the FDA’s registration requirements as delineated
          in The Public Health Security and Bioterrorism Preparedness and
          Response Act of 2002. BPI and their Contract Manufacturing
          Organizations are third-party certified compliant with cGMPs (Current
          Good Manufacturing Practices) under 21 CFR part 111 regulated by the
          FDA.
        </p>
      </div>
    </>
  );
};

export default Footer;
