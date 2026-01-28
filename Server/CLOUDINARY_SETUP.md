# Cloudinary Setup Guide for Blog Videos

## Problem Solved
Videos uploaded to blogs now work in production. Previously, videos were stored locally in `/uploads/blogs/` which gets deleted on server restart/redeploy. Now using Cloudinary cloud storage.

## Setup Steps

### 1. Create Cloudinary Account
1. Go to https://cloudinary.com
2. Sign up for a free account
3. Go to Dashboard to find your credentials

### 2. Get Your Credentials
In your Cloudinary Dashboard, you'll find:
- **Cloud Name** - Your unique identifier
- **API Key** - Public API key
- **API Secret** - Private API secret (keep this secret!)

### 3. Update .env File
Add these to your `/Server/.env`:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
BLOG_UPLOAD_MAX_MB=200
```

### 4. Install Dependencies
```bash
cd Server
npm install
```

This installs:
- `cloudinary` - Cloudinary SDK
- `multer-storage-cloudinary` - Multer adapter for Cloudinary

### 5. How It Works

**Upload Flow:**
1. Admin uploads blog with video via admin dashboard
2. Video sent to backend as FormData
3. Multer middleware uploads to Cloudinary
4. Cloudinary returns URL (e.g., `https://res.cloudinary.com/...`)
5. URL stored in MongoDB database

**Playback Flow:**
1. Frontend fetches blog data with Cloudinary URL
2. Video player loads directly from Cloudinary CDN
3. Works in both local and production environments

### 6. File Organization in Cloudinary
Videos are organized in folders:
- `power-supplement/blogs/images/` - Blog images
- `power-supplement/blogs/videos/` - Blog videos
- `power-supplement/blogs/thumbnails/` - Video thumbnails

### 7. Testing Locally
1. Start server: `npm start`
2. Admin dashboard should work as before
3. Upload a blog with video
4. Video should play immediately
5. Refresh page - video still plays (stored in cloud)

### 8. Production Deployment
1. Add Cloudinary env vars to your hosting platform (Render, Heroku, etc.)
2. Deploy as normal
3. Videos will work without any local file storage

### 9. Benefits
✅ Videos persist across server restarts
✅ Works in production without ephemeral storage issues
✅ Automatic CDN delivery (fast loading)
✅ Free tier supports up to 25GB storage
✅ No local disk space needed

### 10. Troubleshooting

**Error: "No video with supported format and MIME type found"**
- Check that Cloudinary credentials are correct in .env
- Verify video format is supported (MP4, WebM, OGG, MOV, AVI, MKV, 3GP, FLV)
- Check browser console for actual error message

**Video uploads fail**
- Ensure BLOG_UPLOAD_MAX_MB is set (default 200MB)
- Check file size doesn't exceed limit
- Verify Cloudinary API credentials

**Videos not showing in production**
- Confirm Cloudinary env vars are set on hosting platform
- Check that URLs in database start with `https://res.cloudinary.com/`
- Verify CORS is configured (already done in app.js)

### 11. Free Tier Limits
- 25GB storage
- 25GB bandwidth/month
- Unlimited uploads
- Perfect for small to medium projects

For more info: https://cloudinary.com/documentation
