import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BlogDetail.css";
import LazyImage from "../LazyImage";
import BASE_URL from "../../config";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the specific blog
        const response = await fetch(`${BASE_URL}/api/v1/blogs/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog');
        }
        
        const data = await response.json();
        
        if (data.success && data.blog) {
          setBlog(data.blog);
          
          // Fetch related blogs from the same category
          fetchRelatedBlogs(data.blog.category, id);
        } else {
          setError('Blog not found');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchRelatedBlogs = async (category, currentId) => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/blogs`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.blogs) {
            // Filter blogs from same category, excluding current blog
            const related = data.blogs
              .filter(b => b.category === category && b._id !== currentId)
              .slice(0, 3);
            setRelatedBlogs(related);
          }
        }
      } catch (err) {
        console.error('Error fetching related blogs:', err);
      }
    };

    fetchBlogDetail();
    
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const getVideoMimeType = (url) => {
    if (!url) return 'video/mp4';
    const ext = url.split('.').pop().toLowerCase();
    const mimeTypes = {
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'ogg': 'video/ogg',
      'ogv': 'video/ogg',
      'mov': 'video/quicktime',
      'avi': 'video/x-msvideo',
      'mkv': 'video/x-matroska',
      '3gp': 'video/3gpp',
      'flv': 'video/x-flv'
    };
    return mimeTypes[ext] || 'video/mp4';
  };

  const renderMedia = (blog) => {
    if (!blog) return null;
    
    if (blog.mediaType === 'video' && blog.videoUrl) {
      const videoUrl = blog.videoUrl.startsWith('http') ? blog.videoUrl : `${BASE_URL}${blog.videoUrl}`;
      const posterUrl = blog.thumbnail ? (blog.thumbnail.startsWith('http') ? blog.thumbnail : `${BASE_URL}${blog.thumbnail}`) : '';
      const videoMimeType = getVideoMimeType(videoUrl);
      
      return (
        <video 
          className="blog-detail-video" 
          controls 
          poster={posterUrl}
          preload="metadata"
        >
          <source src={videoUrl} type={videoMimeType} />
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
          className="blog-detail-image"
        />
      );
    }
    return null;
  };

  const handleRelatedBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  const handleBackToBlogs = () => {
    navigate('/articles');
  };

  if (loading) {
    return (
      <div className="blog-detail-container">
        <div className="blog-detail-loading">
          <div className="spinner"></div>
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-detail-container">
        <div className="blog-detail-error">
          <h2>Article Not Found</h2>
          <p>{error || 'The article you are looking for does not exist.'}</p>
          <button onClick={handleBackToBlogs} className="back-btn">
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-container">
      {/* Back Button */}
      <button onClick={handleBackToBlogs} className="back-to-blogs-btn">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Articles
      </button>

      {/* Blog Header */}
      <article className="blog-detail-article">
        <header className="blog-detail-header">
          <div className="blog-detail-category-tag">{blog.category}</div>
          <h1 className="blog-detail-title">{blog.title}</h1>
          
          <div className="blog-detail-meta">
            <div className="blog-author-info">
              <div className="author-avatar">
                {blog.author ? blog.author.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="author-details">
                <span className="author-name">{blog.author}</span>
                <div className="blog-detail-stats">
                  <span className="blog-date">
                    {new Date(blog.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                  <span className="separator">•</span>
                  <span className="read-time">{blog.readTime || '5 min read'}</span>
                </div>
              </div>
            </div>
            
            {/* Social Share Buttons */}
            <div className="social-share">
              <span className="share-text">Share:</span>
              <button className="share-btn" aria-label="Share on Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </button>
              <button className="share-btn" aria-label="Share on Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
              </button>
              <button className="share-btn" aria-label="Share on LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Featured Media */}
        <div className="blog-detail-media">
          {renderMedia(blog)}
        </div>

        {/* Blog Content */}
        <div className="blog-detail-content">
          {blog.excerpt && (
            <p className="blog-lead">{blog.excerpt}</p>
          )}
          
          <div 
            className="blog-body" 
            dangerouslySetInnerHTML={{ __html: blog.content || blog.body }}
          />
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="blog-tags">
            <span className="tags-label">Tags:</span>
            {blog.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </article>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <section className="related-articles">
          <h2 className="related-title">Related Articles</h2>
          <div className="related-grid">
            {relatedBlogs.map((relatedBlog) => (
              <article 
                key={relatedBlog._id}
                className="related-card"
                onClick={() => handleRelatedBlogClick(relatedBlog._id)}
              >
                <div className="related-image-wrapper">
                  {relatedBlog.image || relatedBlog.imageUrl ? (
                    <LazyImage
                      src={(relatedBlog.image || relatedBlog.imageUrl).startsWith('http') 
                        ? (relatedBlog.image || relatedBlog.imageUrl) 
                        : `${BASE_URL}${relatedBlog.image || relatedBlog.imageUrl}`}
                      alt={relatedBlog.title}
                      className="related-image"
                    />
                  ) : (
                    <div className="related-image-placeholder">
                      <span>No image</span>
                    </div>
                  )}
                  <div className="related-category-tag">{relatedBlog.category}</div>
                </div>
                <div className="related-content">
                  <h3 className="related-article-title">{relatedBlog.title}</h3>
                  <p className="related-excerpt">{relatedBlog.excerpt}</p>
                  <div className="related-meta">
                    <span>{new Date(relatedBlog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span>•</span>
                    <span>{relatedBlog.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <div className="blog-detail-newsletter">
        <h3>Get More Fitness & Nutrition Insights</h3>
        <p>Subscribe to our newsletter for expert tips, supplement guides, and exclusive content.</p>
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

export default BlogDetail;
