import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AccountLayout.css';

const AccountLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="account-container">
      <div className="account-header">
        <div className="header-content">
          <h1>My Account</h1>
          <div className="user-email">{user?.email}</div>
        </div>
      </div>
      
      <div className="account-layout">
        <nav className="account-nav">
          <Link 
            to="/account/orders" 
            className={`nav-link ${isActive('/account/orders') ? 'active' : ''}`}
          >
            Orders
          </Link>
          <Link 
            to="/account/profile" 
            className={`nav-link ${isActive('/account/profile') ? 'active' : ''}`}
          >
            Profile
          </Link>
          <Link 
            to="/account/settings" 
            className={`nav-link ${isActive('/account/settings') ? 'active' : ''}`}
          >
            Settings
          </Link>
        </nav>
        
        <main className="account-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AccountLayout;
