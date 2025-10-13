import React, { useState, useEffect } from "react";
import "./Blogs.css";
import { useNavigate } from "react-router-dom";
import LazyImage from "../LazyImage";
import BASE_URL from "../../config";

const Blogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch blogs from backend API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${BASE_URL}/api/v1/blogs`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        
        const data = await response.json();
        
        if (data.success && data.blogs) {
          setBlogs(data.blogs);
        } else {
          setBlogs([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err.message);
        setBlogs([]);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const categories = ["All", "Supplements", "Nutrition", "Training", "Weight Loss", "Recovery"];

  const filteredBlogs = selectedCategory === "All" 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory);

  const handleBlogClick = (blogId) => {
    // Navigate to individual blog post
    navigate(`/blog/${blogId}`);
  };

  // Helper function to render media (image or video)
  const renderMedia = (blog) => {
    if (blog.mediaType === 'video' && blog.videoUrl) {
      const videoUrl = blog.videoUrl.startsWith('http') ? blog.videoUrl : `${BASE_URL}${blog.videoUrl}`;
      const posterUrl = blog.thumbnail ? (blog.thumbnail.startsWith('http') ? blog.thumbnail : `${BASE_URL}${blog.thumbnail}`) : '';
      
      return (
        <video 
          className="blog-video" 
          controls 
          poster={posterUrl}
          preload="metadata"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else if (blog.image || blog.imageUrl) {
      const imageUrl = (blog.image || blog.imageUrl);
      const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`;
      
      return (
        <LazyImage
          src={fullImageUrl}
          alt={blog.title}
          className="blog-image"
        />
      );
    }
    // Fallback placeholder
    return (
      <div className="blog-image-placeholder">
        <span>No media</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="blogs-container">
        <div className="blogs-loading">
          <div className="spinner"></div>
          <p>Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blogs-container">
        <div className="blogs-error">
          <h2>Error Loading Blogs</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blogs-container">
      <div className="blogs-header">
        <h1>FITNESS & NUTRITION BLOG</h1>
        <p className="blogs-subtitle">Expert insights, training tips, and supplement guides</p>
      </div>

      {/* Category Filter */}
      <div className="blog-categories">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Blog Grid */}
      <div className="blogs-grid">
        {filteredBlogs.map((blog) => (
          <article 
            className="blog-card" 
            key={blog._id || blog.id}
            onClick={() => handleBlogClick(blog._id || blog.id)}
          >
            <div className="blog-image-wrapper">
              {renderMedia(blog)}
              <div className="blog-category-tag">{blog.category}</div>
              {blog.mediaType === 'video' && (
                <div className="video-indicator">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="24" fill="rgba(0,0,0,0.7)"/>
                    <path d="M18 14L34 24L18 34V14Z" fill="white"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="blog-content">
              <div className="blog-meta">
                <span className="blog-author">{blog.author}</span>
                <span className="blog-date">{new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="blog-read-time">{blog.readTime}</span>
              </div>
              <h2 className="blog-title">{blog.title}</h2>
              <p className="blog-excerpt">{blog.excerpt}</p>
              <button className="read-more-btn">
                Read Article
                <svg className="arrow-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3.33334 8H12.6667M12.6667 8L8.00001 3.33334M12.6667 8L8.00001 12.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Empty State */}
      {filteredBlogs.length === 0 && !loading && (
        <div className="blogs-empty">
          <h2>No Articles Yet</h2>
          <p>{selectedCategory === "All" 
            ? "No articles have been published yet. Check back soon!" 
            : `No articles found in the ${selectedCategory} category.`}
          </p>
        </div>
      )}

      {/* Newsletter CTA */}
      <div className="blog-newsletter-cta">
        <h3>Stay Updated with Latest Articles</h3>
        <p>Get expert fitness tips, supplement guides, and exclusive content delivered to your inbox.</p>
        <div className="newsletter-form">
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="newsletter-input"
          />
          <button className="newsletter-submit-btn">Subscribe</button>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
