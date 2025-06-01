import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Settings.css';

const Settings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      
      <div className="settings-section">
        <h3>Account Management</h3>
        <div className="settings-content">
          <button 
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>
          <p className="logout-description">
            Securely log out of your account across all devices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
