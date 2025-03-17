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

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  const { cart, isSidebarOpen, setIsSidebarOpen } = useCart();
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
        try {
          const response = await axios.get(`/api/v1/products/search?query=${encodeURIComponent(searchQuery)}`);
          if (Array.isArray(response.data)) {
            setSearchResults(response.data);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error('Error searching products:', error);
          setSearchResults([]);
        }
        setIsLoading(false);
      } else {
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

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
      setSearchResults([]);
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
      setSearchResults([]);
    }
  };

  const handleProductClick = (productId) => {
    setIsSearchActive(false);
    setSearchQuery("");
    setSearchResults([]);
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
          <img src="/PowerLogo.png" alt="Power Logo" />
        </Link>
        <div className="navLinks desktopNav">
          <Link to="/shop-all">SHOP</Link>
          {/* <Link to="/collections/stacks">STACK & SAVE</Link> */}
          <Link to="/partner-program">TEAM POWER</Link>
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
            {/* Suggestions */}
            <div className="suggestions_products">
              <div className="suggestions">
              <h3>SUGGESTIONS</h3>
              <div className="suggestion-items">
                <button onClick={() => setSearchQuery("a hd")}>a hd</button>
                <button onClick={() => setSearchQuery("best aminos")}>best aminos</button>
                <button onClick={() => setSearchQuery("amino acids")}>amino acids</button>
                <button onClick={() => setSearchQuery("Protein & Amino Acids - Recovery")}>
                  Protein & Amino Acids - Recovery
                </button>
                <button onClick={() => setSearchQuery("Accessories")}>Accessories</button>
              </div>
            </div>
             {/* Products */}
            <div className="products">
              <h3>PRODUCTS</h3>
              {isLoading ? (
                <div className="loading">Loading...</div>
              ) : searchResults.length > 0 ? (
                <div className="product-items">
                  {searchResults.slice(0, 3).map((product) => (
                    <button
                      key={product._id}
                      className="product-item"
                      onClick={() => handleProductClick(product._id)}
                    >
                      <img src={product.images[0]} alt={product.name} />
                      <div className="product-info">
                        <h4>{product.name}</h4>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="no-results">No products found</div>
              )}
            </div>

            </div>
            

           
            {/* Pages */}
            <div className="pages-section">
              <h3>PAGES</h3>
              <Link to="/accessibility" onClick={toggleSearch}>Accessibility</Link>
              <Link to="/about" onClick={toggleSearch}>About Us</Link>
            </div>
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
