import React, { useEffect, useState } from "react";
import "./Nav.css";
import { CiSearch, CiUser, CiShoppingCart } from "react-icons/ci";
import { FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../Cart/Sidebar/Sidebar";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaTiktok } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import axios from "axios";
import BASE_URL from "../../config";
import gsap from 'gsap'
import {useGSAP} from '@gsap/react'
import { useRef } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  const { cart, isSidebarOpen, setIsSidebarOpen } = useCart();
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    suggestions: [],
    products: [],
    categories: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [useHardcodedResults, setUseHardcodedResults] = useState(false);

  useGSAP(() => {
    gsap.fromTo('.navLinks a', {
      opacity: 0,
    }, {
      opacity: 1,
      stagger: .1,
      duration: 1,
      ease: "power1.inOut",
    })
    gsap.fromTo('.navLink', {
      opacity: 0,
    }, {
      opacity: 1,
      stagger: .1,
      duration: 1,
      ease: "power1.inOut",
    })
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length > 0) {
        setIsLoading(true);
        setSearchError(null);
        
        try {
          
          if (useHardcodedResults) {
            // For testing, use hardcoded data
            const hardcodedResults = {
              suggestions: ['Protein Powder', 'Whey Protein', 'Best Protein'],
              products: [
                {
                  _id: '1',
                  name: 'Whey Protein Isolate',
                  images: ['/uploads/protein1.jpg'],
                  price: 49.99
                },
                {
                  _id: '2',
                  name: 'Plant Protein',
                  images: ['/uploads/protein2.jpg'],
                  price: 39.99
                }
              ],
              categories: ['Proteins', 'Supplements']
            };
            
            console.log('Using hardcoded results:', hardcodedResults);
            setSearchResults(hardcodedResults);
          } else {
            // Use actual API
            const response = await axios.get(`/api/v1/search/suggestions?query=${encodeURIComponent(searchQuery)}`);
            
            if (response.data) {
              setSearchResults({
                suggestions: response.data.suggestions || [],
                products: response.data.products || [],
                categories: response.data.categories || []
              });
            } else {
              throw new Error('Invalid response from search API');
            }
          }
        } catch (error) {
          console.error('Error searching products:', error);
          setSearchError(error.message || 'Error searching');
          
          // If API fails, fall back to hardcoded results
          if (!useHardcodedResults) {
            setUseHardcodedResults(true);
          } else {
            setSearchResults({
              suggestions: [],
              products: [],
              categories: []
            });
          }
        }
        setIsLoading(false);
      } else {
        setSearchResults({
          suggestions: [],
          products: [],
          categories: []
        });
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, useHardcodedResults]);

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchActive(false);
      setSearchQuery("");
      setSearchResults({
        suggestions: [],
        products: [],
        categories: []
      });
    }
  };

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (!isSearchActive) {
      setTimeout(() => {
        document.querySelector('.search-input')?.focus();
      }, 100);
    } else {
      setSearchQuery("");
      setSearchResults({
        suggestions: [],
        products: [],
        categories: []
      });
    }
  };

  const handleProductClick = (productId) => {
    setIsSearchActive(false);
    setSearchQuery("");
    setSearchResults({
        suggestions: [],
        products: [],
        categories: []
    });
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className={`navbar ${isSticky ? "sticky" : ""} ${isSearchActive ? "search-active" : ""}`}>
      {/* Left Section with Hamburger Menu */}
      <div className={`left ${isSearchActive ? "hidden" : ""}`}>
        <button className="hamburger-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
        </button>
        <Link to="/">
          <img src="/BlueLogo.png" alt="Power Logo" />
        </Link>
        <div className="navLinks desktopNav">
          <Link to="/shop-all">SHOP</Link>
          {/* <Link to="/collections/stacks">STACK & SAVE</Link> */}
          <Link to="/partner-program">TEAM POWER</Link>
          <Link to="/articles">BLOG</Link>
          <Link to="/stores">STORES</Link>
          {isLoggedIn && user?.isAdmin && (
            <Link to="/admin" className="admin-link">DASHBOARD</Link>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className={`search-container ${isSearchActive ? "active" : ""}`}>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="button" className="search-close" onClick={toggleSearch}>
            <FiX size={24} />
          </button>
        </form>

        {/* Search Results Dropdown */}
        {isSearchActive && searchQuery.trim() && (
          <div className="search-results">
            {searchError && (
              <div className="search-error">
                Error: {searchError}
                {useHardcodedResults && <span> (Using demo results)</span>}
              </div>
            )}
            
            <div className="suggestions_products">
              {/* Suggestions */}
              {searchResults?.suggestions?.length > 0 && (
                <div className="suggestions">
                  <h3>SUGGESTIONS</h3>
                  <div className="suggestion-items">
                    {searchResults.suggestions.map((suggestion, index) => (
                      <button key={index} onClick={() => setSearchQuery(suggestion)}>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              <div className="products">
                <h3>PRODUCTS</h3>
                {isLoading ? (
                  <div className="loading">Loading...</div>
                ) : searchResults?.products?.length > 0 ? (
                  <div className="product-items">
                    {searchResults.products.map((product) => (
                      <button
                        key={product._id}
                        className="product-item"
                        onClick={() => handleProductClick(product._id)}
                      >
                        <img src={`${BASE_URL}${product.images[0]}`} alt={product.name} />
                        <div className="product-info">
                          <h4>{product.name}</h4>
                          <p>Rs. {product.price}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="no-results">
                    No products found
                    <button 
                      onClick={() => setUseHardcodedResults(!useHardcodedResults)}
                      className="toggle-demo-btn"
                    >
                      {useHardcodedResults ? 'Try API search' : 'Show demo results'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Categories */}
            {searchResults?.categories?.length > 0 && (
              <div className="categories-section">
                <h3>CATEGORIES</h3>
                {searchResults.categories.map((category, index) => (
                  <Link 
                    key={index} 
                    to={`/${encodeURIComponent(category)}`}
                    onClick={toggleSearch}
                    style={{textDecoration: 'underline', color: 'inherit'}}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            )}

          
          </div>
        )}
      </div>

      {/* Right Section (Search, User, Cart) */}
      <ul className={`navLinks ${isSearchActive ? "hidden" : ""}`}>
        <li>
          <button onClick={toggleSearch} className="navLink">
            <CiSearch size={25} />
          </button>
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
        <Link to="/articles" onClick={toggleMobileMenu} className="mobile-link">
          BLOG
        </Link>
        <Link to="/stores" onClick={toggleMobileMenu} className="mobile-link">
          STORES
        </Link>
        {isLoggedIn && user?.isAdmin && (
          <Link to="/admin" onClick={toggleMobileMenu} className="mobile-link admin-mobile-link">
            📊 DASHBOARD
          </Link>
        )}

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
