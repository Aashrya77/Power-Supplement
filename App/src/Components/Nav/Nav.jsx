import React, { useEffect, useState } from "react";
import "./Nav.css";
import { CiSearch, CiUser, CiShoppingCart } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../Cart/Sidebar/Sidebar";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaTiktok } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  const { cart, isSidebarOpen, setIsSidebarOpen } = useCart();
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    if (isMobileMenuOpen) {
      toggleMobileMenu();
    }
  };

  const handleProfileClick = () => {
    navigate("/account/orders");
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className={`navbar ${isSticky ? "sticky" : ""}`}>
      {/* Left Section with Hamburger Menu */}
      <div className="left">
        <button className="hamburger-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
        </button>
        <Link to="/">
          <img src="/PowerLogo.png" alt="Power Logo" />
        </Link>
        <div className="navLinks desktopNav">
          <Link to="/shop-all">SHOP</Link>
          <Link to="/collections/stacks">STACK & SAVE</Link>
          <Link to="/partner-program">TEAM POWER</Link>
        </div>
      </div>

      {/* Right Section (Search, User, Cart) */}
      <ul className="navLinks">
        <li>
          <a href="#home" className="navLink">
            <CiSearch size={25} />
          </a>
        </li>
        
        <li>
          {isLoggedIn ? (
            <div className="user-menu">
              <button className="navLink user" onClick={handleProfileClick}>
                <CiUser size={25} />
              </button>

            </div>
          ) : (
            <Link to="/auth" className="navLink user">
              <CiUser size={25} />
            </Link>
          )}
        </li>
        <li>
          <button className="navLink cart-btn" onClick={toggleSidebar}>
            <CiShoppingCart size={25} />
            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
          </button>
        </li>
      </ul>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? "menu-open" : ""}`}>
        <Link to="/shop-all" onClick={toggleMobileMenu} className="mobile-link">
          SHOP
        </Link>
        <Link to="/collections/stacks" onClick={toggleMobileMenu} className="mobile-link">
          STACK & SAVE
        </Link>
        <Link to="/partner-program" onClick={toggleMobileMenu} className="mobile-link">
          TEAM POWER
        </Link>

        <div className="mobile-menu-bottom">
          {isLoggedIn ? (
            <div className="mobile-user-menu">
              <Link to="/account/profile" className="mobile-menu-item" onClick={toggleMobileMenu}>
                Profile
              </Link>
              <button className="mobile-logout" onClick={handleLogout}>
                <CiUser size={25} />
                Logout
              </button>
            </div>
          ) : (
            <Link
              className="mobile-login"
              to="/auth"
              onClick={toggleMobileMenu}
            >
              <CiUser size={25} />
              Log in
            </Link>
          )}
          <div className="socialLinks">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaFacebook size={22} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaInstagram size={22} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaTwitter size={22} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaYoutube size={22} />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaTiktok size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Dark Overlay for Sidebar */}
      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

      {/* Cart Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
    </nav>
  );
};

export default Navbar;
