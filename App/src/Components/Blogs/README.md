# Blogs Component - Backend Integration Guide

## Overview
The Blogs component is ready for backend integration and supports both **images** and **videos** as blog media.

## API Endpoint Required

### GET `/api/blogs`
Returns an array of blog posts.

## Expected API Response Format

```json
[
  {
    "_id": "unique-blog-id-123",
    "title": "The Ultimate Guide to Pre-Workout Supplements",
    "excerpt": "Brief description or preview text for the blog post",
    "category": "Supplements",
    "author": "Power Team",
    "date": "2025-01-10T00:00:00.000Z",
    "readTime": "5 min read",
    "mediaType": "image",
    "imageUrl": "https://yourdomain.com/uploads/blog-image.jpg",
    "thumbnail": null
  },
  {
    "_id": "unique-blog-id-456",
    "title": "How to Build Muscle with Proper Training",
    "excerpt": "Video tutorial on effective muscle building techniques",
    "category": "Training",
    "author": "Power Team",
    "date": "2025-01-12T00:00:00.000Z",
    "readTime": "8 min read",
    "mediaType": "video",
    "videoUrl": "https://yourdomain.com/uploads/training-video.mp4",
    "thumbnail": "https://yourdomain.com/uploads/video-thumbnail.jpg"
  }
]
```

## Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | String | Yes | Unique identifier for the blog post |
| `title` | String | Yes | Blog post title |
| `excerpt` | String | Yes | Short preview text (will be truncated to 3 lines) |
| `category` | String | Yes | One of: "Supplements", "Nutrition", "Training", "Weight Loss", "Recovery" |
| `author` | String | Yes | Author name |
| `date` | String (ISO 8601) | Yes | Publication date |
| `readTime` | String | Yes | Estimated reading time (e.g., "5 min read") |
| `mediaType` | String | Yes | Either "image" or "video" |
| `imageUrl` or `image` | String (URL) | Conditional | Required if mediaType is "image" |
| `videoUrl` | String (URL) | Conditional | Required if mediaType is "video". Must be MP4 format |
| `thumbnail` | String (URL) | Optional | Video thumbnail image. Recommended for videos |

## Media Upload Requirements

### Images
- **Formats**: JPG, PNG, WebP
- **Recommended Size**: 800x600px or 4:3 ratio
- **Max File Size**: 2MB recommended
- **Optimization**: Compress images before upload

### Videos
- **Format**: MP4 (H.264 codec)
- **Recommended Size**: 1920x1080px (1080p) or 1280x720px (720p)
- **Max File Size**: 50MB recommended
- **Duration**: 1-10 minutes
- **Thumbnail**: Always provide a thumbnail image for better UX

## Categories

The component supports these predefined categories:
- **All** (default filter, shows all posts)
- **Supplements**
- **Nutrition**
- **Training**
- **Weight Loss**
- **Recovery**

Make sure blog posts use one of these exact category names.

## Backend Implementation Checklist

### Database Schema (MongoDB Example)
```javascript
{
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true }, // Full blog content for individual post page
  category: { 
    type: String, 
    required: true,
    enum: ['Supplements', 'Nutrition', 'Training', 'Weight Loss', 'Recovery']
  },
  author: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  readTime: { type: String, required: true },
  mediaType: { 
    type: String, 
    required: true,
    enum: ['image', 'video']
  },
  imageUrl: { type: String },
  videoUrl: { type: String },
  thumbnail: { type: String },
  published: { type: Boolean, default: false },
  views: { type: Number, default: 0 }
}
```

### File Upload Setup
1. Set up multer or similar for file uploads
2. Store files in cloud storage (AWS S3, Cloudinary, etc.) or local storage
3. Return full URLs in API responses
4. Implement file type validation
5. Add file size limits

### API Endpoints to Create
- `GET /api/blogs` - Get all published blogs
- `GET /api/blogs/:id` - Get single blog post (for future individual blog page)
- `POST /api/blogs` - Create new blog (admin only)
- `PUT /api/blogs/:id` - Update blog (admin only)
- `DELETE /api/blogs/:id` - Delete blog (admin only)
- `POST /api/blogs/upload` - Handle media uploads

## Frontend Integration

✅ **INTEGRATED** - The frontend is now connected to the backend API at `${BASE_URL}/api/v1/blogs`

The integration includes:
- Automatic API endpoint configuration from `config.js`
- Proper handling of backend response format (`data.blogs`)
- Full URL construction for images and videos
- Support for both relative and absolute URLs
- Video thumbnail support with poster images

## Features Already Implemented

✅ Category filtering
✅ Image lazy loading
✅ Video playback with controls
✅ Skeleton loading states
✅ Error handling
✅ Empty state display
✅ Responsive design
✅ Navigation in navbar (desktop + mobile)
✅ Click navigation to individual posts
✅ Newsletter CTA section

## Future Enhancements (Optional)

- Individual blog post page with full content
- Rich text editor for blog creation
- Comments section
- Social sharing buttons
- Related posts
- Search functionality
- Pagination or infinite scroll
- Admin dashboard for blog management
