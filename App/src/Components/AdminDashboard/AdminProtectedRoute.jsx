import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminProtectedRoute = ({ children }) => {
  const { isLoggedIn, user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user is admin
  if (!user?.isAdmin) {
    return (
      <div className="admin-dashboard">
        <div className="admin-access-denied">
          <div className="access-denied-content">
            <h1>🚫 Access Denied</h1>
            <p>You don't have administrator privileges to access this page.</p>
            <div className="access-denied-info">
              <p><strong>Current User:</strong> {user?.username || 'Unknown'}</p>
              <p><strong>Email:</strong> {user?.email || 'Unknown'}</p>
              <p><strong>Admin Status:</strong> {user?.isAdmin ? 'Yes' : 'No'}</p>
            </div>
            <button 
              className="btn-primary" 
              onClick={() => window.history.back()}
              style={{marginTop: '20px'}}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and is admin, render the protected component
  return children;
};

export default AdminProtectedRoute;
