import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { getAllOrders } from '../../services/orderService';
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
  const [flavors, setFlavors] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
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
  const [addModal, setAddModal] = useState({ isOpen: false });
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    description: '',
    category: '',
    flavors: [],
    price: '',
    images: [],
    stock: '',
    stockStatus: 'In Stock'
  });
  const [newFlavor, setNewFlavor] = useState('');

  // Blog management state
  const [blogs, setBlogs] = useState([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogSearchTerm, setBlogSearchTerm] = useState('');
  const [selectedBlogCategory, setSelectedBlogCategory] = useState('all');
  const [blogDeleteModal, setBlogDeleteModal] = useState({ isOpen: false, blog: null });
  const [blogEditModal, setBlogEditModal] = useState({ isOpen: false, blog: null });
  const [blogAddModal, setBlogAddModal] = useState({ isOpen: false });
  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Supplements',
    author: 'Power Team',
    readTime: '5 min read',
    mediaType: 'image',
    published: true,
    imageFile: null,
    videoFile: null,
    thumbnailFile: null
  });
  const [blogSubmitting, setBlogSubmitting] = useState(false);
  const [orderDetailsModal, setOrderDetailsModal] = useState({ isOpen: false, order: null });

  useEffect(() => {
    fetchData();
    fetchOrders();
    fetchBlogs();
  }, []);

  // Handle ESC key press to close modals
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        if (deleteModal.isOpen) {
          handleDeleteCancel();
        } else if (editModal.isOpen) {
          handleEditCancel();
        } else if (addModal.isOpen) {
          handleAddCancel();
        } else if (blogDeleteModal.isOpen) {
          handleBlogDeleteCancel();
        } else if (blogEditModal.isOpen) {
          handleBlogEditCancel();
        } else if (blogAddModal.isOpen) {
          handleBlogAddCancel();
        }
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [deleteModal.isOpen, editModal.isOpen, addModal.isOpen, blogDeleteModal.isOpen, blogEditModal.isOpen, blogAddModal.isOpen]);

  // Utility function to validate token
  const validateToken = () => {
    const token = localStorage.getItem('authToken');
    return token;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.warn('No auth token found, redirecting to login');
        logout();
        return;
      }
      
      // Fetch products
      const productsResponse = await axios.get(`${BASE_URL}/api/v1/products`);
      const productsData = productsResponse.data.products || [];
      setProducts(productsData);

      // Fetch categories
      const categoriesResponse = await axios.get(`${BASE_URL}/api/v1/categories`);
      setCategories(categoriesResponse.data || []);

      // Fetch flavors
      const flavorsResponse = await axios.get(`${BASE_URL}/api/v1/flavors`);
      setFlavors(flavorsResponse.data || []);

      // Calculate stats from real data
      const totalRevenue = productsData.reduce((sum, product) => sum + product.price, 0);
      
      setStats({
        totalOrders: productsData.reduce((sum, product) => sum + (product.sales || 0), 0), // Sum of all sales
        totalRevenue: totalRevenue,
        totalProducts: productsData.length,
        totalUsers: Math.floor(totalRevenue / 1000) // Estimate users based on revenue
      });
      
    } catch (error) {
      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await getAllOrders();
      if (response.success && response.data) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Format orders for display
  const formatOrdersForDisplay = (ordersData) => {
    if (!Array.isArray(ordersData)) return [];
    
    return ordersData.map((order, index) => {
      const firstProduct = order.items && order.items[0] ? order.items[0].product : null;
      const productName = firstProduct?.name || 'Unknown Product';
      const customerName = order.user?.username || order.user?.email || 'Unknown Customer';
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      const status = order.status || 'pending';
      
      return {
        id: `#${order._id.slice(-6).toUpperCase()}`,
        customer: customerName,
        product: productName.length > 35 ? productName.substring(0, 35) + '...' : productName,
        amount: `Rs. ${order.totalAmount}`,
        status: status.charAt(0).toUpperCase() + status.slice(1),
        date: orderDate,
        phone: order.shippingAddress?.phone || 'N/A',
        fullOrder: order
      };
    });
  };

  // Generate sample orders with real product names (for demo purposes)
  const getSampleOrders = (count = 5) => {
    if (products.length === 0) return [];
    
    const customers = ['Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Sneha Patel', 'Vikram Thapa', 'Anita Rai', 'Suresh Gurung'];
    const statuses = ['Completed', 'Processing', 'Shipped', 'Pending'];
    
    return Array.from({ length: count }, (_, index) => {
      const randomProduct = products[index % products.length];
      
      // Safety check for product
      if (!randomProduct || !randomProduct.name) {
        return null;
      }
      
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
    }).filter(order => order !== null);
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
  const getStockStatus = (product) => {
    // If stockStatus is provided by the server, use it
    if (product.stockStatus) {
      return product.stockStatus;
    }
    
    // Fallback to calculating based on stock quantity
    if (product.stock === 0) return 'Out of Stock';
    if (product.stock < 10) return 'Low Stock';
    return 'In Stock';
  };

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    // Safety check to ensure product exists and has required properties
    if (!product || !product.name) {
      return false;
    }
    
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());
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
      
      if (!token) {
        alert('Authentication token not found. Please login again.');
        logout();
        return;
      }
      
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
      stockStatus: product.stockStatus || getStockStatus(product)
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
      
      if (!token) {
        alert('Authentication token not found. Please login again.');
        logout();
        return;
      }
      
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
      if (error.response?.status === 401) {
        alert('Authentication failed. Please login again.');
        logout();
      } else {
        alert(`Failed to update price: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateStock = async () => {
    if (!editModal.product || !editForm.stock) return;

    try {
      setUpdating(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        alert('Authentication token not found. Please login again.');
        logout();
        return;
      }
      
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
            ? { ...p, stock: parseInt(editForm.stock), stockStatus: editForm.stockStatus }
            : p
        ));

        handleEditCancel();
        console.log('Stock updated successfully');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      if (error.response?.status === 401) {
        alert('Authentication failed. Please login again.');
        logout();
      } else {
        alert(`Failed to update stock: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setUpdating(false);
    }
  };

  // Handle add product
  const handleAddClick = () => {
    setAddModal({ isOpen: true });
    setAddForm({
      name: '',
      description: '',
      category: '',
      flavors: [],
      price: '',
      images: [],
      stock: '',
      stockStatus: 'In Stock'
    });
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleAddCancel = () => {
    setAddModal({ isOpen: false });
    setAddForm({
      name: '',
      description: '',
      category: '',
      flavors: [],
      price: '',
      images: [],
      stock: '',
      stockStatus: 'In Stock'
    });
    // Restore scrolling when modal is closed
    document.body.style.overflow = '';
  };

  const handleAddFormChange = (field, value) => {
    setAddForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddFlavor = (flavorId) => {
    const selectedFlavor = flavors.find(f => f._id === flavorId);
    if (selectedFlavor && !addForm.flavors.some(f => f._id === selectedFlavor._id)) {
      setAddForm(prev => ({
        ...prev,
        flavors: [...prev.flavors, selectedFlavor]
      }));
    }
  };

  const handleRemoveFlavor = (index) => {
    setAddForm(prev => ({
      ...prev,
      flavors: prev.flavors.filter((_, i) => i !== index)
    }));
  };

  // ==================== FLAVOR MANAGEMENT FUNCTIONS ====================
  const handleCreateFlavor = async () => {
    if (!newFlavor.trim()) {
      alert('Please enter a flavor name');
      return;
    }
    try {
      const token = validateToken();
      if (!token) {
        alert('Authentication token not found. Please login again.');
        logout();
        return;
      }
      const response = await axios.post(
        `${BASE_URL}/api/v1/flavors`,
        { name: newFlavor.trim() },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (response.status === 201) {
        const createdFlavor = response.data;
        setFlavors(prev => [...prev, createdFlavor]);
        setNewFlavor('');
        return createdFlavor;
      }
    } catch (error) {
      alert(`Failed to create flavor: ${error.response?.data?.message || error.message}`);
    }
  };

  // Add existing flavor or create new one from input
  const handleAddOrCreateFlavor = async () => {
    const trimmed = newFlavor.trim();
    if (!trimmed) return;
    // check existing
    const existing = flavors.find(f => f.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      if (!addForm.flavors.some(f => f._id === existing._id)) {
        setAddForm(prev => ({ ...prev, flavors: [...prev.flavors, existing] }));
      }
      setNewFlavor('');
      return;
    }
    // create
    const created = await handleCreateFlavor();
    if (created && !addForm.flavors.some(f => f._id === created._id)) {
      setAddForm(prev => ({ ...prev, flavors: [...prev.flavors, created] }));
    }
  };

  const handleDeleteFlavor = async (flavorId) => {
    if (!window.confirm('Are you sure you want to delete this flavor?')) return;
    try {
      const token = validateToken();
      if (!token) {
        alert('Authentication token not found. Please login again.');
        logout();
        return;
      }
      await axios.delete(`${BASE_URL}/api/v1/flavors/${flavorId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setFlavors(prev => prev.filter(f => f._id !== flavorId));
      // Remove from selected flavors in add form if present
      setAddForm(prev => ({
        ...prev,
        flavors: prev.flavors.filter(f => f._id !== flavorId)
      }));
    } catch (error) {
      alert(`Failed to delete flavor: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setAddForm(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleRemoveImage = (index) => {
    setAddForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddProduct = async () => {
    if (!addForm.name || !addForm.description || !addForm.category || !addForm.price || !addForm.stock) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setAdding(true);
      const token = validateToken();
      
      if (!token) {
        alert('Authentication token not found. Please login again.');
        logout();
        return;
      }
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', addForm.name);
      formData.append('description', addForm.description);
      formData.append('category', addForm.category);
      formData.append('price', parseFloat(addForm.price));
      formData.append('stock', parseInt(addForm.stock));
      formData.append('stockStatus', addForm.stockStatus);
      
      // Add flavors (send flavor IDs)
      addForm.flavors.forEach((flavor, index) => {
        formData.append(`flavors[${index}]`, flavor._id);
      });
      
      // Add images
      addForm.images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await axios.post(
        `${BASE_URL}/api/v1/products`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 201) {
        // Add new product to local state
        const newProduct = response.data.product || response.data;
        
        if (newProduct && newProduct._id) {
          setProducts(prev => [newProduct, ...prev]);
          
          // Update stats
          setStats(prev => ({
            ...prev,
            totalProducts: prev.totalProducts + 1,
            totalRevenue: prev.totalRevenue + parseFloat(addForm.price)
          }));
          
          handleAddCancel();
        } else {
          alert('Product was created but there was an issue with the response data. Please refresh the page.');
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        alert('Authentication failed. Please login again.');
        logout();
      } else if (error.response?.status === 403) {
        alert('You do not have permission to add products.');
      } else {
        alert(`Failed to add product: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setAdding(false);
    }
  };

  // ==================== BLOG MANAGEMENT FUNCTIONS ====================

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      setBlogLoading(true);
      const response = await axios.get(`${BASE_URL}/api/v1/blogs`);
      if (response.data.success) {
        setBlogs(response.data.blogs || []);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setBlogLoading(false);
    }
  };

  // Filter blogs
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title?.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
                         blog.excerpt?.toLowerCase().includes(blogSearchTerm.toLowerCase());
    const matchesCategory = selectedBlogCategory === 'all' || blog.category === selectedBlogCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle blog form changes
  const handleBlogFormChange = (field, value) => {
    setBlogForm(prev => ({ ...prev, [field]: value }));
  };

  // Handle file uploads for blogs
  const handleBlogFileChange = (field, file) => {
    setBlogForm(prev => ({ ...prev, [field]: file }));
  };

  // Create new blog
  const handleCreateBlog = async () => {
    if (!blogForm.title || !blogForm.excerpt || !blogForm.content || !blogForm.category) {
      alert('Please fill in all required fields');
      return;
    }

    if (blogForm.mediaType === 'image' && !blogForm.imageFile) {
      alert('Please upload an image');
      return;
    }

    if (blogForm.mediaType === 'video' && !blogForm.videoFile) {
      alert('Please upload a video');
      return;
    }

    try {
      setBlogSubmitting(true);
      const token = validateToken();
      
      if (!token) {
        alert('Authentication token not found. Please login again.');
        logout();
        return;
      }

      const formData = new FormData();
      formData.append('title', blogForm.title);
      formData.append('excerpt', blogForm.excerpt);
      formData.append('content', blogForm.content);
      formData.append('category', blogForm.category);
      formData.append('author', blogForm.author);
      formData.append('readTime', blogForm.readTime);
      formData.append('mediaType', blogForm.mediaType);
      formData.append('published', blogForm.published);

      if (blogForm.mediaType === 'image' && blogForm.imageFile) {
        formData.append('image', blogForm.imageFile);
      }

      if (blogForm.mediaType === 'video') {
        if (blogForm.videoFile) {
          formData.append('video', blogForm.videoFile);
        }
        if (blogForm.thumbnailFile) {
          formData.append('thumbnail', blogForm.thumbnailFile);
        }
      }

      const response = await axios.post(
        `${BASE_URL}/api/v1/blogs`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setBlogs(prev => [response.data.blog, ...prev]);
        setBlogAddModal({ isOpen: false });
        setBlogForm({
          title: '',
          excerpt: '',
          content: '',
          category: 'Supplements',
          author: 'Power Team',
          readTime: '5 min read',
          mediaType: 'image',
          published: true,
          imageFile: null,
          videoFile: null,
          thumbnailFile: null
        });
        document.body.style.overflow = '';
        alert('Blog created successfully!');
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Failed to create blog. Please try again.');
    } finally {
      setBlogSubmitting(false);
    }
  };

  // Update blog
  const handleUpdateBlog = async () => {
    if (!blogForm.title || !blogForm.excerpt || !blogForm.content) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setBlogSubmitting(true);
      const token = validateToken();
      
      if (!token) {
        alert('Authentication token not found. Please login again.');
        logout();
        return;
      }

      const formData = new FormData();
      formData.append('title', blogForm.title);
      formData.append('excerpt', blogForm.excerpt);
      formData.append('content', blogForm.content);
      formData.append('category', blogForm.category);
      formData.append('author', blogForm.author);
      formData.append('readTime', blogForm.readTime);
      formData.append('mediaType', blogForm.mediaType);
      formData.append('published', blogForm.published);

      if (blogForm.imageFile) {
        formData.append('image', blogForm.imageFile);
      }

      if (blogForm.videoFile) {
        formData.append('video', blogForm.videoFile);
      }

      if (blogForm.thumbnailFile) {
        formData.append('thumbnail', blogForm.thumbnailFile);
      }

      const response = await axios.put(
        `${BASE_URL}/api/v1/blogs/${blogEditModal.blog._id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setBlogs(prev => prev.map(b => 
          b._id === blogEditModal.blog._id ? response.data.blog : b
        ));
        setBlogEditModal({ isOpen: false, blog: null });
        document.body.style.overflow = '';
        alert('Blog updated successfully!');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Failed to update blog. Please try again.');
    } finally {
      setBlogSubmitting(false);
    }
  };

  // Delete blog
  const handleDeleteBlog = async () => {
    if (!blogDeleteModal.blog) return;

    try {
      const token = validateToken();
      
      if (!token) {
        alert('Authentication token not found. Please login again.');
        logout();
        return;
      }

      const response = await axios.delete(
        `${BASE_URL}/api/v1/blogs/${blogDeleteModal.blog._id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setBlogs(prev => prev.filter(b => b._id !== blogDeleteModal.blog._id));
        setBlogDeleteModal({ isOpen: false, blog: null });
        document.body.style.overflow = '';
        alert('Blog deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog. Please try again.');
    }
  };

  // Toggle blog published status
  const handleToggleBlogPublished = async (blog) => {
    try {
      const token = validateToken();
      
      if (!token) {
        alert('Authentication token not found. Please login again.');
        logout();
        return;
      }

      const response = await axios.patch(
        `${BASE_URL}/api/v1/blogs/${blog._id}/toggle-published`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setBlogs(prev => prev.map(b => 
          b._id === blog._id ? response.data.blog : b
        ));
      }
    } catch (error) {
      console.error('Error toggling blog status:', error);
      alert('Failed to toggle blog status. Please try again.');
    }
  };

  // Blog modal handlers
  const handleBlogAddClick = () => {
    setBlogAddModal({ isOpen: true });
    document.body.style.overflow = 'hidden';
  };

  const handleBlogEditClick = (blog) => {
    setBlogEditModal({ isOpen: true, blog });
    setBlogForm({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      author: blog.author,
      readTime: blog.readTime,
      mediaType: blog.mediaType,
      published: blog.published,
      imageFile: null,
      videoFile: null,
      thumbnailFile: null
    });
    document.body.style.overflow = 'hidden';
  };

  const handleBlogDeleteClick = (blog) => {
    setBlogDeleteModal({ isOpen: true, blog });
    document.body.style.overflow = 'hidden';
  };

  const handleBlogAddCancel = () => {
    setBlogAddModal({ isOpen: false });
    setBlogForm({
      title: '',
      excerpt: '',
      content: '',
      category: 'Supplements',
      author: 'Power Team',
      readTime: '5 min read',
      mediaType: 'image',
      published: true,
      imageFile: null,
      videoFile: null,
      thumbnailFile: null
    });
    document.body.style.overflow = '';
  };

  const handleBlogEditCancel = () => {
    setBlogEditModal({ isOpen: false, blog: null });
    setBlogForm({
      title: '',
      excerpt: '',
      content: '',
      category: 'Supplements',
      author: 'Power Team',
      readTime: '5 min read',
      mediaType: 'image',
      published: true,
      imageFile: null,
      videoFile: null,
      thumbnailFile: null
    });
    document.body.style.overflow = '';
  };

  const handleBlogDeleteCancel = () => {
    setBlogDeleteModal({ isOpen: false, blog: null });
    document.body.style.overflow = '';
  };

  // ==================== END BLOG MANAGEMENT FUNCTIONS ====================

  // ==================== ORDER DETAILS MODAL FUNCTIONS ====================

  const handleViewOrder = (order) => {
    setOrderDetailsModal({ isOpen: true, order });
    document.body.style.overflow = 'hidden';
  };

  const handleCloseOrderDetails = () => {
    setOrderDetailsModal({ isOpen: false, order: null });
    document.body.style.overflow = '';
  };

  // ==================== END ORDER DETAILS MODAL FUNCTIONS ====================

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

  const renderOrders = () => {
    const displayOrders = orders.length > 0 ? formatOrdersForDisplay(orders) : [];
    
    return (
      <div className="admin-orders">
        <div className="section-header">
          <h2>Orders Management ({displayOrders.length})</h2>
          <div className="header-actions">
            <input type="search" placeholder="Search orders..." className="search-input" />
            <select className="filter-select">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
        <div className="table-container">
          {ordersLoading ? (
            <div className="loading-state">Loading orders...</div>
          ) : displayOrders.length === 0 ? (
            <div className="empty-state">
              <p>No orders found</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.phone}</td>
                    <td>{order.product}</td>
                    <td>{order.amount}</td>
                    <td><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></td>
                    <td>{order.date}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-view"
                          onClick={() => handleViewOrder(order.fullOrder)}
                        >
                          View
                        </button>
                        <button className="btn-edit">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

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
            <button className="btn-primary" onClick={handleAddClick}>Add Product</button>
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
                    <span className={`status ${getStockStatus(product).toLowerCase().replace(/ /g, '-')}`}>
                      {getStockStatus(product)}
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

  const renderBlogs = () => (
    <div className="admin-products">
      <div className="products-header">
        <div className="header-left">
          <h2>📝 Blog Management</h2>
          <p className="products-count">{blogs.length} total blogs</p>
        </div>
        <button className="btn-add" onClick={handleBlogAddClick}>
          ➕ Create New Blog
        </button>
      </div>

      <div className="products-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search blogs..."
            value={blogSearchTerm}
            onChange={(e) => setBlogSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <select 
          className="category-filter"
          value={selectedBlogCategory}
          onChange={(e) => setSelectedBlogCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="Supplements">Supplements</option>
          <option value="Nutrition">Nutrition</option>
          <option value="Training">Training</option>
          <option value="Weight Loss">Weight Loss</option>
          <option value="Recovery">Recovery</option>
        </select>
      </div>

      {blogLoading ? (
        <div className="loading-state">Loading blogs...</div>
      ) : filteredBlogs.length === 0 ? (
        <div className="empty-state">
          <p>No blogs found</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Author</th>
                <th>Views</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((blog) => (
                <tr key={blog._id}>
                  <td>
                    <div className="product-info">
                      <div className="product-details">
                        <span className="product-name">{blog.title}</span>
                        <span className="product-meta">
                          {blog.excerpt.substring(0, 60)}...
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">{blog.category}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${blog.mediaType}`}>
                      {blog.mediaType === 'video' ? '🎥 Video' : '🖼️ Image'}
                    </span>
                  </td>
                  <td>{blog.author}</td>
                  <td>{blog.views || 0}</td>
                  <td>
                    <button
                      className={`status-badge ${blog.published ? 'in-stock' : 'out-of-stock'}`}
                      onClick={() => handleToggleBlogPublished(blog)}
                      style={{ cursor: 'pointer', border: 'none', padding: '4px 8px' }}
                    >
                      {blog.published ? '✓ Published' : '✗ Draft'}
                    </button>
                  </td>
                  <td>{new Date(blog.date).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-edit"
                        onClick={() => handleBlogEditClick(blog)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleBlogDeleteClick(blog)}
                        title="Delete"
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
      )}
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
          className={`nav-btn ${activeTab === 'blogs' ? 'active' : ''}`}
          onClick={() => setActiveTab('blogs')}
        >
          📝 Blogs
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
        {activeTab === 'blogs' && renderBlogs()}
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

      {/* Add Product Modal */}
      {addModal.isOpen && (
        <div className="modal-overlay" onClick={handleAddCancel}>
          <div className="add-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Add New Product</h2>
              <button className="modal-close" onClick={handleAddCancel}>×</button>
            </div>
            
            <div className="add-content">
              <form onSubmit={(e) => { e.preventDefault(); handleAddProduct(); }}>
                {/* Basic Information */}
                <div className="form-section">
                  <h3>📝 Basic Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="productName">Product Name *</label>
                      <input
                        type="text"
                        id="productName"
                        value={addForm.name}
                        onChange={(e) => handleAddFormChange('name', e.target.value)}
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="productCategory">Category *</label>
                      <select
                        id="productCategory"
                        value={addForm.category}
                        onChange={(e) => handleAddFormChange('category', e.target.value)}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="productDescription">Product Description *</label>
                    <div className="textarea-container">
                      <textarea
                        id="productDescription"
                        value={addForm.description}
                        onChange={(e) => handleAddFormChange('description', e.target.value)}
                        placeholder="Describe your product in detail... Include benefits, ingredients, usage instructions, and any special features that make this product unique."
                        rows="5"
                        maxLength="1000"
                        required
                      />
                      <div className="character-counter">
                        <span className={addForm.description.length > 800 ? 'warning' : ''}>
                          {addForm.description.length}/1000 characters
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing & Stock */}
                <div className="form-section">
                  <h3>💰 Pricing & Stock</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="productPrice">Price (NPR) *</label>
                      <input
                        type="number"
                        id="productPrice"
                        value={addForm.price}
                        onChange={(e) => handleAddFormChange('price', e.target.value)}
                        placeholder="Enter price"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="productStock">Stock Quantity *</label>
                      <input
                        type="number"
                        id="productStock"
                        value={addForm.stock}
                        onChange={(e) => handleAddFormChange('stock', e.target.value)}
                        placeholder="Enter stock quantity"
                        min="0"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="productStockStatus">Stock Status</label>
                      <select
                        id="stockStatus"
                        value={addForm.stockStatus}
                        onChange={(e) => handleAddFormChange('stockStatus', e.target.value)}
                      >
                        <option value="In Stock">In Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                        <option value="Coming Soon">Coming Soon</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Flavors */}
                <div className="form-section">
                  <h3>🍓 Product Flavors</h3>
                  <div className="flavor-selection-group">
                    <div className="form-group">
                      <label>
                        <input
                          type="text"
                          id="flavorInput"
                          list="flavor-options"
                          placeholder="Type flavor name and press Enter"
                          value={newFlavor}
                          onChange={(e) => setNewFlavor(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddOrCreateFlavor();
                            }
                          }}
                          className="flavor-input"
                        />
                        <datalist id="flavor-options">
                          {flavors.map(flavor => (
                            <option key={flavor._id} value={flavor.name} />
                          ))}
                        </datalist>
                      </label>
                    </div>
                  </div>
                  
                  {addForm.flavors.length > 0 && (
                    <div className="selected-flavors">
                      <h4>Selected Flavors:</h4>
                      <div className="flavors-grid">
                        {addForm.flavors.map((flavor, index) => (
                          <div key={flavor._id || index} className="flavor-card">
                            <span className="flavor-name">{flavor.name}</span>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveFlavor(index)}
                              className="btn-remove-flavor"
                              title="Remove flavor"
                            >
                              ×
                            </button>
                            <button 
                              type="button" 
                              onClick={() => handleCreateFlavor()}
                              className="btn-create-flavor"
                              title="Create flavor"
                            >
                              +
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Images */}
                <div className="form-section">
                  <h3>📸 Product Images</h3>
                  <div className="form-group">
                    <label htmlFor="productImages">Upload Images</label>
                    <input
                      type="file"
                      id="productImages"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="file-input"
                    />
                  </div>
                  {addForm.images.length > 0 && (
                    <div className="images-preview">
                      {addForm.images.map((image, index) => (
                        <div key={index} className="image-preview-item">
                          <img 
                            src={URL.createObjectURL(image)} 
                            alt={`Preview ${index + 1}`}
                            className="preview-image"
                          />
                          <button 
                            type="button" 
                            onClick={() => handleRemoveImage(index)}
                            className="btn-remove-image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Modal Actions */}
            <div className="modal-actions">
              <button 
                className="btn-cancel" 
                onClick={handleAddCancel}
                disabled={adding}
              >
                Cancel
              </button>
              <button 
                className="btn-add-product" 
                onClick={handleAddProduct}
                disabled={adding || !addForm.name || !addForm.description || !addForm.category || !addForm.price || !addForm.stock}
              >
                {adding ? 'Adding Product...' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== BLOG MODALS ==================== */}
      
      {/* Blog Add Modal */}
      {blogAddModal.isOpen && (
        <div className="modal-overlay" onClick={handleBlogAddCancel}>
          <div className="add-modal blog-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📝 Create New Blog Post</h2>
              <button className="close-btn" onClick={handleBlogAddCancel}>×</button>
            </div>

            <div className="modal-content">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  placeholder="Enter blog title"
                  value={blogForm.title}
                  onChange={(e) => handleBlogFormChange('title', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Excerpt (Short Description) *</label>
                <textarea
                  placeholder="Brief description (max 300 characters)"
                  value={blogForm.excerpt}
                  onChange={(e) => handleBlogFormChange('excerpt', e.target.value)}
                  className="form-textarea"
                  rows="2"
                  maxLength="300"
                />
                <small>{blogForm.excerpt.length}/300 characters</small>
              </div>

              <div className="form-group">
                <label>Content *</label>
                <textarea
                  placeholder="Full blog content"
                  value={blogForm.content}
                  onChange={(e) => handleBlogFormChange('content', e.target.value)}
                  className="form-textarea"
                  rows="8"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={blogForm.category}
                    onChange={(e) => handleBlogFormChange('category', e.target.value)}
                    className="form-select"
                  >
                    <option value="Supplements">Supplements</option>
                    <option value="Nutrition">Nutrition</option>
                    <option value="Training">Training</option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Recovery">Recovery</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Media Type *</label>
                  <select
                    value={blogForm.mediaType}
                    onChange={(e) => handleBlogFormChange('mediaType', e.target.value)}
                    className="form-select"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Author</label>
                  <input
                    type="text"
                    value={blogForm.author}
                    onChange={(e) => handleBlogFormChange('author', e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Read Time</label>
                  <input
                    type="text"
                    placeholder="5 min read"
                    value={blogForm.readTime}
                    onChange={(e) => handleBlogFormChange('readTime', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {blogForm.mediaType === 'image' && (
                <div className="form-group">
                  <label>Upload Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBlogFileChange('imageFile', e.target.files[0])}
                    className="form-input"
                  />
                  {blogForm.imageFile && <small>✓ {blogForm.imageFile.name}</small>}
                </div>
              )}

              {blogForm.mediaType === 'video' && (
                <>
                  <div className="form-group">
                    <label>Upload Video *</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleBlogFileChange('videoFile', e.target.files[0])}
                      className="form-input"
                    />
                    {blogForm.videoFile && <small>✓ {blogForm.videoFile.name}</small>}
                  </div>

                  <div className="form-group">
                    <label>Upload Thumbnail (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBlogFileChange('thumbnailFile', e.target.files[0])}
                      className="form-input"
                    />
                    {blogForm.thumbnailFile && <small>✓ {blogForm.thumbnailFile.name}</small>}
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={blogForm.published}
                    onChange={(e) => handleBlogFormChange('published', e.target.checked)}
                  />
                  <span>Publish immediately</span>
                </label>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn-cancel" 
                onClick={handleBlogAddCancel}
                disabled={blogSubmitting}
              >
                Cancel
              </button>
              <button 
                className="btn-add-product" 
                onClick={handleCreateBlog}
                disabled={blogSubmitting}
              >
                {blogSubmitting ? 'Creating...' : 'Create Blog'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blog Edit Modal */}
      {blogEditModal.isOpen && (
        <div className="modal-overlay" onClick={handleBlogEditCancel}>
          <div className="add-modal blog-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Edit Blog Post</h2>
              <button className="close-btn" onClick={handleBlogEditCancel}>×</button>
            </div>

            <div className="modal-content">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={blogForm.title}
                  onChange={(e) => handleBlogFormChange('title', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Excerpt *</label>
                <textarea
                  value={blogForm.excerpt}
                  onChange={(e) => handleBlogFormChange('excerpt', e.target.value)}
                  className="form-textarea"
                  rows="2"
                  maxLength="300"
                />
                <small>{blogForm.excerpt.length}/300 characters</small>
              </div>

              <div className="form-group">
                <label>Content *</label>
                <textarea
                  value={blogForm.content}
                  onChange={(e) => handleBlogFormChange('content', e.target.value)}
                  className="form-textarea"
                  rows="8"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={blogForm.category}
                    onChange={(e) => handleBlogFormChange('category', e.target.value)}
                    className="form-select"
                  >
                    <option value="Supplements">Supplements</option>
                    <option value="Nutrition">Nutrition</option>
                    <option value="Training">Training</option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Recovery">Recovery</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Media Type *</label>
                  <select
                    value={blogForm.mediaType}
                    onChange={(e) => handleBlogFormChange('mediaType', e.target.value)}
                    className="form-select"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Author</label>
                  <input
                    type="text"
                    value={blogForm.author}
                    onChange={(e) => handleBlogFormChange('author', e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Read Time</label>
                  <input
                    type="text"
                    value={blogForm.readTime}
                    onChange={(e) => handleBlogFormChange('readTime', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {blogForm.mediaType === 'image' && (
                <div className="form-group">
                  <label>Update Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBlogFileChange('imageFile', e.target.files[0])}
                    className="form-input"
                  />
                  {blogForm.imageFile && <small>✓ New: {blogForm.imageFile.name}</small>}
                </div>
              )}

              {blogForm.mediaType === 'video' && (
                <>
                  <div className="form-group">
                    <label>Update Video (Optional)</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleBlogFileChange('videoFile', e.target.files[0])}
                      className="form-input"
                    />
                    {blogForm.videoFile && <small>✓ New: {blogForm.videoFile.name}</small>}
                  </div>

                  <div className="form-group">
                    <label>Update Thumbnail (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBlogFileChange('thumbnailFile', e.target.files[0])}
                      className="form-input"
                    />
                    {blogForm.thumbnailFile && <small>✓ New: {blogForm.thumbnailFile.name}</small>}
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={blogForm.published}
                    onChange={(e) => handleBlogFormChange('published', e.target.checked)}
                  />
                  <span>Published</span>
                </label>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn-cancel" 
                onClick={handleBlogEditCancel}
                disabled={blogSubmitting}
              >
                Cancel
              </button>
              <button 
                className="btn-add-product" 
                onClick={handleUpdateBlog}
                disabled={blogSubmitting}
              >
                {blogSubmitting ? 'Updating...' : 'Update Blog'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blog Delete Modal */}
      {blogDeleteModal.isOpen && (
        <div className="modal-overlay" onClick={handleBlogDeleteCancel}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🗑️ Delete Blog Post</h2>
              <button className="close-btn" onClick={handleBlogDeleteCancel}>×</button>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to delete this blog post?</p>
              <div className="product-preview">
                <h4>{blogDeleteModal.blog?.title}</h4>
                <p>{blogDeleteModal.blog?.category}</p>
              </div>
              <p className="warning-text">⚠️ This action cannot be undone. The blog and all associated media will be permanently deleted.</p>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={handleBlogDeleteCancel}>
                Cancel
              </button>
              <button className="btn-delete-confirm" onClick={handleDeleteBlog}>
                Delete Blog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {orderDetailsModal.isOpen && orderDetailsModal.order && (
        <div className="modal-overlay" onClick={handleCloseOrderDetails}>
          <div className="order-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📦 Order Details</h2>
              <button className="close-btn" onClick={handleCloseOrderDetails}>×</button>
            </div>
            <div className="modal-content order-details-content">
              {/* Order Header */}
              <div className="order-header-section">
                <div className="order-id-status">
                  <div>
                    <h3>Order ID: {orderDetailsModal.order._id?.slice(-6).toUpperCase() || 'N/A'}</h3>
                    <span className={`status ${orderDetailsModal.order.status?.toLowerCase() || 'pending'}`}>
                      {orderDetailsModal.order.status?.charAt(0).toUpperCase() + orderDetailsModal.order.status?.slice(1) || 'Pending'}
                    </span>
                  </div>
                  <div className="order-date">
                    <p><strong>Order Date:</strong> {new Date(orderDetailsModal.order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="order-section">
                <h4>👤 Customer Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Name:</label>
                    <p>{orderDetailsModal.order.user?.username || 'N/A'}</p>
                  </div>
                  <div className="info-item">
                    <label>Email:</label>
                    <p>{orderDetailsModal.order.user?.email || 'N/A'}</p>
                  </div>
                  <div className="info-item">
                    <label>Phone:</label>
                    <p>{orderDetailsModal.order.shippingAddress?.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="order-section">
                <h4>🚚 Shipping Address</h4>
                <div className="info-grid">
                  <div className="info-item full-width">
                    <label>Address:</label>
                    <p>{orderDetailsModal.order.shippingAddress?.street || 'N/A'}</p>
                  </div>
                  <div className="info-item">
                    <label>City:</label>
                    <p>{orderDetailsModal.order.shippingAddress?.city || 'N/A'}</p>
                  </div>
                  <div className="info-item">
                    <label>State:</label>
                    <p>{orderDetailsModal.order.shippingAddress?.state || 'N/A'}</p>
                  </div>
                  <div className="info-item">
                    <label>Postal Code:</label>
                    <p>{orderDetailsModal.order.shippingAddress?.postal_code || 'N/A'}</p>
                  </div>
                  <div className="info-item">
                    <label>Country:</label>
                    <p>{orderDetailsModal.order.shippingAddress?.country || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="order-section">
                <h4>📋 Order Items</h4>
                <div className="items-list">
                  {orderDetailsModal.order.items && orderDetailsModal.order.items.length > 0 ? (
                    orderDetailsModal.order.items.map((item, index) => (
                      <div key={index} className="item-card">
                        <div className="item-info">
                          <p><strong>Product:</strong> {item.product?.name || 'Unknown'}</p>
                          <p><strong>Quantity:</strong> {item.quantity}</p>
                          <p><strong>Price per unit:</strong> Rs. {item.product?.price || 'N/A'}</p>
                        </div>
                        <div className="item-total">
                          <p>Rs. {item.quantity * (item.product?.price || 0)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No items in this order</p>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div className="order-section">
                <h4>💳 Payment Information</h4>
                <div className="info-grid">
                  <div className="info-item highlight">
                    <label>Total Amount:</label>
                    <p className="total-amount">Rs. {orderDetailsModal.order.totalAmount || 0}</p>
                  </div>
                  <div className="info-item">
                    <label>Payment Method:</label>
                    <p className="capitalize">{orderDetailsModal.order.paymentMethod || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              {orderDetailsModal.order.paymentDetails && (
                <div className="order-section">
                  <h4>🔐 Payment Details</h4>
                  <div className="info-grid">
                    {orderDetailsModal.order.paymentDetails.transactionId && (
                      <div className="info-item">
                        <label>Transaction ID:</label>
                        <p>{orderDetailsModal.order.paymentDetails.transactionId}</p>
                      </div>
                    )}
                    {orderDetailsModal.order.paymentDetails.referenceId && (
                      <div className="info-item">
                        <label>Reference ID:</label>
                        <p>{orderDetailsModal.order.paymentDetails.referenceId}</p>
                      </div>
                    )}
                    {orderDetailsModal.order.paymentDetails.amount && (
                      <div className="info-item">
                        <label>Amount Paid:</label>
                        <p>Rs. {orderDetailsModal.order.paymentDetails.amount}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={handleCloseOrderDetails}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
