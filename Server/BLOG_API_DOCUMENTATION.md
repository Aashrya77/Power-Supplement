# Blog API Documentation

## Base URL
```
http://localhost:5500/api/v1/blogs
```

## Endpoints

### Public Endpoints (No Authentication Required)

#### 1. Get All Blogs
**GET** `/api/v1/blogs`

Get all published blogs with optional filtering and pagination.

**Query Parameters:**
- `category` (optional) - Filter by category: "Supplements", "Nutrition", "Training", "Weight Loss", "Recovery", or "All"
- `page` (optional, default: 1) - Page number for pagination
- `limit` (optional, default: 10) - Number of blogs per page
- `sort` (optional, default: "-date") - Sort order (-date for newest first)

**Example Request:**
```bash
GET /api/v1/blogs?category=Supplements&page=1&limit=6
```

**Response:**
```json
{
  "success": true,
  "blogs": [
    {
      "_id": "unique-id",
      "title": "The Ultimate Guide to Pre-Workout Supplements",
      "excerpt": "Brief description...",
      "category": "Supplements",
      "author": "Power Team",
      "date": "2025-01-10T00:00:00.000Z",
      "readTime": "5 min read",
      "mediaType": "image",
      "imageUrl": "/uploads/blogs/image-123.jpg",
      "thumbnail": null,
      "published": true,
      "views": 42,
      "slug": "the-ultimate-guide-to-pre-workout-supplements",
      "createdAt": "2025-01-10T00:00:00.000Z",
      "updatedAt": "2025-01-10T00:00:00.000Z"
    }
  ],
  "currentPage": 1,
  "totalPages": 3,
  "totalBlogs": 15
}
```

---

#### 2. Get Single Blog
**GET** `/api/v1/blogs/:id`

Get a single blog by ID or slug. Increments view count.

**Example Request:**
```bash
GET /api/v1/blogs/unique-blog-id
# OR
GET /api/v1/blogs/the-ultimate-guide-to-pre-workout-supplements
```

**Response:**
```json
{
  "success": true,
  "blog": {
    "_id": "unique-id",
    "title": "The Ultimate Guide to Pre-Workout Supplements",
    "excerpt": "Brief description...",
    "content": "Full blog content here...",
    "category": "Supplements",
    "author": "Power Team",
    "date": "2025-01-10T00:00:00.000Z",
    "readTime": "5 min read",
    "mediaType": "image",
    "imageUrl": "/uploads/blogs/image-123.jpg",
    "thumbnail": null,
    "published": true,
    "views": 43,
    "slug": "the-ultimate-guide-to-pre-workout-supplements"
  }
}
```

---

#### 3. Get Blog Categories
**GET** `/api/v1/blogs/categories`

Get all blog categories with post counts.

**Response:**
```json
{
  "success": true,
  "categories": [
    { "_id": "Supplements", "count": 8 },
    { "_id": "Training", "count": 6 },
    { "_id": "Nutrition", "count": 5 },
    { "_id": "Weight Loss", "count": 3 },
    { "_id": "Recovery", "count": 2 }
  ]
}
```

---

### Admin Endpoints (Authentication Required)

**Authentication Header Required:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### 4. Create Blog
**POST** `/api/v1/blogs`

Create a new blog post. Admin only.

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `title` (required) - Blog title
- `excerpt` (required) - Short description (max 300 chars)
- `content` (required) - Full blog content
- `category` (required) - One of: "Supplements", "Nutrition", "Training", "Weight Loss", "Recovery"
- `author` (optional, default: "Power Team") - Author name
- `readTime` (optional, default: "5 min read") - Estimated read time
- `mediaType` (required) - Either "image" or "video"
- `published` (optional, default: true) - Publish immediately or draft
- `image` (file, conditional) - Required if mediaType is "image"
- `video` (file, conditional) - Required if mediaType is "video"
- `thumbnail` (file, optional) - Thumbnail for video

**Example Request (using cURL):**
```bash
curl -X POST http://localhost:5500/api/v1/blogs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=The Ultimate Guide to Pre-Workout Supplements" \
  -F "excerpt=Discover the science behind pre-workout supplements" \
  -F "content=Full article content here..." \
  -F "category=Supplements" \
  -F "author=Power Team" \
  -F "readTime=5 min read" \
  -F "mediaType=image" \
  -F "image=@/path/to/image.jpg"
```

**Response:**
```json
{
  "success": true,
  "message": "Blog created successfully",
  "blog": {
    "_id": "new-blog-id",
    "title": "The Ultimate Guide to Pre-Workout Supplements",
    "slug": "the-ultimate-guide-to-pre-workout-supplements",
    ...
  }
}
```

---

#### 5. Update Blog
**PUT** `/api/v1/blogs/:id`

Update an existing blog. Admin only.

**Content-Type:** `multipart/form-data`

**Form Fields:** Same as Create Blog (all optional for update)

**Example Request:**
```bash
curl -X PUT http://localhost:5500/api/v1/blogs/blog-id \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Updated Title" \
  -F "image=@/path/to/new-image.jpg"
```

**Response:**
```json
{
  "success": true,
  "message": "Blog updated successfully",
  "blog": { ... }
}
```

---

#### 6. Delete Blog
**DELETE** `/api/v1/blogs/:id`

Delete a blog and its associated media files. Admin only.

**Example Request:**
```bash
curl -X DELETE http://localhost:5500/api/v1/blogs/blog-id \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

---

#### 7. Toggle Published Status
**PATCH** `/api/v1/blogs/:id/toggle-published`

Toggle blog between published and draft. Admin only.

**Example Request:**
```bash
curl -X PATCH http://localhost:5500/api/v1/blogs/blog-id/toggle-published \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Blog published successfully",
  "blog": { ... }
}
```

---

## File Upload Specifications

### Images
- **Formats:** JPEG, PNG, WebP
- **Max Size:** 100MB (configurable in middleware)
- **Storage:** `/uploads/blogs/`
- **Naming:** `image-{timestamp}-{random}.{ext}`

### Videos
- **Formats:** MP4, MPEG, MOV
- **Max Size:** 100MB (configurable in middleware)
- **Storage:** `/uploads/blogs/`
- **Naming:** `video-{timestamp}-{random}.{ext}`

### Thumbnails
- **Formats:** JPEG, PNG, WebP
- **Max Size:** 100MB
- **Storage:** `/uploads/blogs/`
- **Usage:** Video poster image

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Admin privileges required."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Blog not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error creating blog",
  "error": "Detailed error message"
}
```

---

## Database Schema

```javascript
{
  title: String (required, unique slug generated),
  excerpt: String (required, max 300 chars),
  content: String (required),
  category: String (required, enum),
  author: String (default: "Power Team"),
  date: Date (default: now),
  readTime: String (default: "5 min read"),
  mediaType: String (required, "image" or "video"),
  imageUrl: String (conditional),
  videoUrl: String (conditional),
  thumbnail: String (optional),
  published: Boolean (default: true),
  views: Number (default: 0),
  slug: String (auto-generated, unique),
  timestamps: true
}
```

---

## Frontend Integration Example

```javascript
// Fetch all blogs
const fetchBlogs = async () => {
  try {
    const response = await fetch('http://localhost:5500/api/v1/blogs');
    const data = await response.json();
    
    if (data.success) {
      setBlogs(data.blogs);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Create blog (admin)
const createBlog = async (formData) => {
  try {
    const response = await fetch('http://localhost:5500/api/v1/blogs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData // FormData object with files
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## Testing the API

Use tools like:
- **Postman** - Import collection for easy testing
- **Thunder Client** (VS Code extension)
- **cURL** - Command line testing
- **Insomnia** - REST client

---

## Notes

- All file uploads automatically clean up on errors
- Old files are deleted when updating with new media
- Slugs are auto-generated from titles
- Views are incremented on each read
- Only published blogs appear in public listings
- Full content is excluded from list views for performance
