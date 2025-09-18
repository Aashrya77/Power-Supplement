import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0
  });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null });
  const [deleting, setDeleting] = useState(false);
  const [editModal, setEditModal] = useState({ isOpen: false, product: null, activeTab: 'price' });
  const [updating, setUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    price: '',
    stock: '',
    stockStatus: 'In Stock'
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Handle ESC key press to close modals
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        if (deleteModal.isOpen) {
          handleDeleteCancel();
        } else if (editModal.isOpen) {
          handleEditCancel();
        }
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [deleteModal.isOpen, editModal.isOpen]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const productsResponse = await axios.get(`${BASE_URL}/api/v1/products`);
      const productsData = productsResponse.data.products || [];
      setProducts(productsData);

      // Fetch categories
      const categoriesResponse = await axios.get(`${BASE_URL}/api/v1/categories`);
      setCategories(categoriesResponse.data || []);

      // Calculate stats from real data
      const totalRevenue = productsData.reduce((sum, product) => sum + product.price, 0);
      
      setStats({
        totalOrders: productsData.reduce((sum, product) => sum + (product.sales || 0), 0), // Sum of all sales
        totalRevenue: totalRevenue,
        totalProducts: productsData.length,
        totalUsers: Math.floor(totalRevenue / 1000) // Estimate users based on revenue
      });
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate sample orders with real product names (for demo purposes)
  const getSampleOrders = (count = 5) => {
    if (products.length === 0) return [];
    
    const customers = ['Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Sneha Patel', 'Vikram Thapa', 'Anita Rai', 'Suresh Gurung'];
    const statuses = ['Completed', 'Processing', 'Shipped', 'Pending'];
    
    return Array.from({ length: count }, (_, index) => {
      const randomProduct = products[index % products.length];
      const randomCustomer = customers[index % customers.length];
      const randomStatus = statuses[index % statuses.length];
      const date = new Date();
      date.setDate(date.getDate() - index);
      
      return {
        id: `#PS${(1000 + index).toString()}`,
        customer: randomCustomer,
        product: randomProduct.name.length > 35 ? randomProduct.name.substring(0, 35) + '...' : randomProduct.name,
        amount: `Rs. ${randomProduct.price}`,
        status: randomStatus,
        date: date.toISOString().split('T')[0]
      };
    });
  };

  // Helper function to format price
  const formatPrice = (price) => {
    return `Rs. ${price}`;
  };

  // Helper function to get category name
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Unknown';
  };

  // Helper function to get stock status
  const getStockStatus = (stock) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    return 'In Stock';
  };

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category?._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle delete product
  const handleDeleteClick = (product) => {
    setDeleteModal({ isOpen: true, product });
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.product) return;

    try {
      setDeleting(true);
      
      // Get auth token from localStorage
      const token = localStorage.getItem('authToken');
      
      const response = await axios.delete(
        `${BASE_URL}/api/v1/products/${deleteModal.product._id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        // Remove product from local state
        setProducts(prev => prev.filter(p => p._id !== deleteModal.product._id));
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalProducts: prev.totalProducts - 1,
          totalRevenue: prev.totalRevenue - deleteModal.product.price
        }));

        // Close modal
        setDeleteModal({ isOpen: false, product: null });
        // Restore scrolling
        document.body.style.overflow = '';
        
        // Show success message (you could add a toast notification here)
        console.log('Product deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      // You could add error handling/toast notification here
      alert('Failed to delete product. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, product: null });
    // Restore scrolling when modal is closed
    document.body.style.overflow = '';
  };

  // Handle edit product
  const handleEditClick = (product) => {
    setEditModal({ isOpen: true, product, activeTab: 'price' });
    setEditForm({
      price: product.price.toString(),
      stock: product.stock.toString(),
      stockStatus: getStockStatus(product.stock)
    });
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleEditCancel = () => {
    setEditModal({ isOpen: false, product: null, activeTab: 'price' });
    setEditForm({ price: '', stock: '', stockStatus: 'In Stock' });
    // Restore scrolling when modal is closed
    document.body.style.overflow = '';
  };

  const handleEditTabChange = (tab) => {
    setEditModal(prev => ({ ...prev, activeTab: tab }));
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdatePrice = async () => {
    if (!editModal.product || !editForm.price) return;

    try {
      setUpdating(true);
      const token = localStorage.getItem('authToken');
      
      const response = await axios.patch(
        `${BASE_URL}/api/v1/products/${editModal.product._id}/price`,
        { price: parseFloat(editForm.price) },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        // Update product in local state
        setProducts(prev => prev.map(p => 
          p._id === editModal.product._id 
            ? { ...p, price: parseFloat(editForm.price) }
            : p
        ));
        
        // Update stats
        const priceDifference = parseFloat(editForm.price) - editModal.product.price;
        setStats(prev => ({
          ...prev,
          totalRevenue: prev.totalRevenue + priceDifference
        }));

        handleEditCancel();
        console.log('Price updated successfully');
      }
    } catch (error) {
      console.error('Error updating price:', error);
      alert('Failed to update price. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateStock = async () => {
    if (!editModal.product || !editForm.stock) return;

    try {
      setUpdating(true);
      const token = localStorage.getItem('authToken');
      
      const response = await axios.patch(
        `${BASE_URL}/api/v1/products/${editModal.product._id}/stock`,
        { 
          stock: parseInt(editForm.stock),
          stockStatus: editForm.stockStatus
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        // Update product in local state
        setProducts(prev => prev.map(p => 
          p._id === editModal.product._id 
            ? { ...p, stock: parseInt(editForm.stock) }
            : p
        ));

        handleEditCancel();
        console.log('Stock updated successfully');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const renderOverview = () => (
    <div className="admin-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon orders">📦</div>
          <div className="stat-info">
            <h3>{stats.totalOrders.toLocaleString()}</h3>
            <p>Total Orders</p>
            <span className="stat-change neutral">Live Data</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon revenue">💰</div>
          <div className="stat-info">
            <h3>Rs. {stats.totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
            <span className="stat-change neutral">Live Data</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon products">🏷️</div>
          <div className="stat-info">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
            <span className="stat-change neutral">Live Data</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon users">👥</div>
          <div className="stat-info">
            <h3>{stats.totalUsers.toLocaleString()}</h3>
            <p>Total Users</p>
            <span className="stat-change neutral">Estimated</span>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <div className="activity-section">
          <h3>Recent Orders</h3>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {getSampleOrders().map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.product}</td>
                    <td>{order.amount}</td>
                    <td><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></td>
                    <td>{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="admin-orders">
      <div className="section-header">
        <h2>Orders Management</h2>
        <div className="header-actions">
          <input type="search" placeholder="Search orders..." className="search-input" />
          <select className="filter-select">
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
          </select>
        </div>
      </div>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getSampleOrders(10).map((order, index) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.product}</td>
                <td>{order.amount}</td>
                <td><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></td>
                <td>{order.date}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-view">View</button>
                    <button className="btn-edit">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProducts = () => {
    if (loading) {
      return (
        <div className="admin-products">
          <div className="loading-container">
            <p>Loading products...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="admin-products">
        <div className="section-header">
          <h2>Products Management ({filteredProducts.length} of {products.length})</h2>
          <div className="header-actions">
            <input 
              type="search" 
              placeholder="Search products..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button className="btn-primary">Add Product</button>
          </div>
        </div>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price (NPR)</th>
                <th>Stock</th>
                <th>Flavors</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product._id}>
                  <td>{product._id.slice(-6)}</td>
                  <td>
                    <div className="product-name-cell">
                      <strong>{product.name}</strong>
                      {product.images && product.images[0] && (
                        <div className="product-image-preview">
                          <img 
                            src={`${BASE_URL}${product.images[0]}`} 
                            alt={product.name}
                            style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px'}}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{product.category?.name || 'Unknown'}</td>
                  <td>Rs. {product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    {product.flavors && product.flavors.length > 0 ? (
                      <div className="flavors-list">
                        {product.flavors.slice(0, 2).map(flavor => (
                          <span key={flavor._id} className="flavor-tag">
                            {flavor.name}
                          </span>
                        ))}
                        {product.flavors.length > 2 && (
                          <span className="flavor-more">+{product.flavors.length - 2} more</span>
                        )}
                      </div>
                    ) : (
                      <span className="no-flavors">No flavors</span>
                    )}
                  </td>
                  <td>
                    <span className={`status ${getStockStatus(product.stock).toLowerCase().replace(' ', '-')}`}>
                      {getStockStatus(product.stock)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-view" title="View Product">👁️</button>
                      <button 
                        className="btn-edit" 
                        title="Edit Product"
                        onClick={() => handleEditClick(product)}
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-delete" 
                        title="Delete Product"
                        onClick={() => handleDeleteClick(product)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && !loading && (
          <div className="no-products">
            <p>{products.length === 0 ? 'No products found.' : 'No products match your search criteria.'}</p>
            {searchTerm && (
              <button 
                className="btn-primary" 
                onClick={() => {setSearchTerm(''); setSelectedCategory('all');}}
                style={{marginTop: '10px'}}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderUsers = () => (
    <div className="admin-users">
      <div className="section-header">
        <h2>Users Management</h2>
        <div className="header-actions">
          <input type="search" placeholder="Search users..." className="search-input" />
          <select className="filter-select">
            <option value="">All Users</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="users-grid">
        <div className="user-card">
          <div className="user-avatar">JD</div>
          <div className="user-info">
            <h4>John Doe</h4>
            <p>john.doe@email.com</p>
            <span className="user-status active">Active</span>
          </div>
          <div className="user-actions">
            <button className="btn-view">View</button>
            <button className="btn-edit">Edit</button>
          </div>
        </div>
        <div className="user-card">
          <div className="user-avatar">JS</div>
          <div className="user-info">
            <h4>Jane Smith</h4>
            <p>jane.smith@email.com</p>
            <span className="user-status active">Active</span>
          </div>
          <div className="user-actions">
            <button className="btn-view">View</button>
            <button className="btn-edit">Edit</button>
          </div>
        </div>
        <div className="user-card">
          <div className="user-avatar">MJ</div>
          <div className="user-info">
            <h4>Mike Johnson</h4>
            <p>mike.johnson@email.com</p>
            <span className="user-status inactive">Inactive</span>
          </div>
          <div className="user-actions">
            <button className="btn-view">View</button>
            <button className="btn-edit">Edit</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="admin-settings">
      <h2>Settings</h2>
      <div className="settings-grid">
        <div className="settings-card">
          <h3>General Settings</h3>
          <div className="setting-item">
            <label>Site Name</label>
            <input type="text" defaultValue="Power Supplement" />
          </div>
          <div className="setting-item">
            <label>Site Description</label>
            <textarea defaultValue="Premium supplements for fitness enthusiasts"></textarea>
          </div>
          <button className="btn-primary">Save Changes</button>
        </div>
        <div className="settings-card">
          <h3>Email Settings</h3>
          <div className="setting-item">
            <label>Admin Email</label>
            <input type="email" defaultValue="admin@powersupplement.com" />
          </div>
          <div className="setting-item">
            <label>Support Email</label>
            <input type="email" defaultValue="support@powersupplement.com" />
          </div>
          <button className="btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-user">
          <div className="admin-user-info">
            <span>Welcome, {user?.username || 'Admin'}</span>
            <small>{user?.email}</small>
          </div>
          <div className="admin-avatar">
            {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
          </div>
          <button className="logout-btn" onClick={logout} title="Logout">
            🚪
          </button>
        </div>
      </div>

      <div className="admin-nav">
        <button 
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 Orders
        </button>
        <button 
          className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          🏷️ Products
        </button>
        <button 
          className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button 
          className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'settings' && renderSettings()}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="modal-overlay" onClick={handleDeleteCancel}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🗑️ Delete Product</h2>
              <button className="modal-close" onClick={handleDeleteCancel}>×</button>
            </div>
            <div className="modal-content">
              <div className="delete-product-info">
                {deleteModal.product?.images && deleteModal.product.images[0] && (
                  <img 
                    src={`${BASE_URL}${deleteModal.product.images[0]}`} 
                    alt={deleteModal.product.name}
                    className="delete-product-image"
                  />
                )}
                <div className="delete-product-details">
                  <h3>{deleteModal.product?.name}</h3>
                  <p><strong>Category:</strong> {deleteModal.product?.category?.name}</p>
                  <p><strong>Price:</strong> Rs. {deleteModal.product?.price}</p>
                  <p><strong>Stock:</strong> {deleteModal.product?.stock} units</p>
                </div>
              </div>
              <div className="delete-warning">
                <p>⚠️ Are you sure you want to delete this product?</p>
                <p>This action cannot be undone and will permanently remove the product from your inventory.</p>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-cancel" 
                onClick={handleDeleteCancel}
                disabled={deleting}
              >
                Cancel
              </button>
              <button 
                className="btn-delete-confirm" 
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editModal.isOpen && (
        <div className="modal-overlay" onClick={handleEditCancel}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Edit Product</h2>
              <button className="modal-close" onClick={handleEditCancel}>×</button>
            </div>
            
            {/* Product Info */}
            <div className="edit-product-info">
              {editModal.product?.images && editModal.product.images[0] && (
                <img 
                  src={`${BASE_URL}${editModal.product.images[0]}`} 
                  alt={editModal.product.name}
                  className="edit-product-image"
                />
              )}
              <div className="edit-product-details">
                <h3>{editModal.product?.name}</h3>
                <p><strong>Category:</strong> {editModal.product?.category?.name}</p>
                <p><strong>Current Price:</strong> Rs. {editModal.product?.price}</p>
                <p><strong>Current Stock:</strong> {editModal.product?.stock} units</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="edit-tabs">
              <button 
                className={`edit-tab ${editModal.activeTab === 'price' ? 'active' : ''}`}
                onClick={() => handleEditTabChange('price')}
              >
                💰 Update Price
              </button>
              <button 
                className={`edit-tab ${editModal.activeTab === 'stock' ? 'active' : ''}`}
                onClick={() => handleEditTabChange('stock')}
              >
                📦 Update Stock
              </button>
            </div>

            {/* Tab Content */}
            <div className="edit-content">
              {editModal.activeTab === 'price' && (
                <div className="price-update-form">
                  <h4>Update Product Price</h4>
                  <div className="form-group">
                    <label htmlFor="price">New Price (NPR)</label>
                    <input
                      type="number"
                      id="price"
                      value={editForm.price}
                      onChange={(e) => handleEditFormChange('price', e.target.value)}
                      placeholder="Enter new price"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="price-comparison">
                    <p><strong>Current Price:</strong> Rs. {editModal.product?.price}</p>
                    <p><strong>New Price:</strong> Rs. {editForm.price || '0'}</p>
                    <p className={`price-difference ${parseFloat(editForm.price) > editModal.product?.price ? 'increase' : 'decrease'}`}>
                      <strong>Difference:</strong> Rs. {editForm.price ? Math.abs(parseFloat(editForm.price) - editModal.product?.price).toFixed(2) : '0'} 
                      {editForm.price && parseFloat(editForm.price) !== editModal.product?.price && (
                        <span className="arrow">
                          {parseFloat(editForm.price) > editModal.product?.price ? ' ↗️' : ' ↘️'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {editModal.activeTab === 'stock' && (
                <div className="stock-update-form">
                  <h4>Update Stock & Status</h4>
                  <div className="form-group">
                    <label htmlFor="stock">Stock Quantity</label>
                    <input
                      type="number"
                      id="stock"
                      value={editForm.stock}
                      onChange={(e) => handleEditFormChange('stock', e.target.value)}
                      placeholder="Enter stock quantity"
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="stockStatus">Stock Status</label>
                    <select
                      id="stockStatus"
                      value={editForm.stockStatus}
                      onChange={(e) => handleEditFormChange('stockStatus', e.target.value)}
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                      <option value="Coming Soon">Coming Soon</option>
                    </select>
                  </div>
                  <div className="stock-comparison">
                    <p><strong>Current Stock:</strong> {editModal.product?.stock} units</p>
                    <p><strong>New Stock:</strong> {editForm.stock || '0'} units</p>
                    <p><strong>Status:</strong> {editForm.stockStatus}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="modal-actions">
              <button 
                className="btn-cancel" 
                onClick={handleEditCancel}
                disabled={updating}
              >
                Cancel
              </button>
              {editModal.activeTab === 'price' && (
                <button 
                  className="btn-update" 
                  onClick={handleUpdatePrice}
                  disabled={updating || !editForm.price}
                >
                  {updating ? 'Updating...' : 'Update Price'}
                </button>
              )}
              {editModal.activeTab === 'stock' && (
                <button 
                  className="btn-update" 
                  onClick={handleUpdateStock}
                  disabled={updating || !editForm.stock}
                >
                  {updating ? 'Updating...' : 'Update Stock'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
