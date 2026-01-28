const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads/blogs directory exists
const blogsUploadDir = path.join(__dirname, '..', 'uploads', 'blogs');
if (!fs.existsSync(blogsUploadDir)) {
    fs.mkdirSync(blogsUploadDir, { recursive: true });
}

const maxUploadMb = Number(process.env.BLOG_UPLOAD_MAX_MB) || 200;
const maxUploadBytes = maxUploadMb * 1024 * 1024;

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, blogsUploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for images and videos
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedVideoTypes = [
        'video/mp4',
        'video/mpeg',
        'video/quicktime',
        'video/webm',
        'video/ogg',
        'video/x-msvideo',
        'video/x-matroska',
        'video/3gpp',
        'video/x-flv',
        'application/octet-stream' // Fallback for some browsers
    ];
    
    if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, WebP images and MP4, MPEG, MOV, WebM, OGG, AVI, MKV, 3GP, and FLV videos are allowed.'), false);
    }
};

// Create multer upload instance for blog media
const blogUpload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: maxUploadBytes
    }
});

// Middleware to handle multiple file fields
const uploadBlogMedia = blogUpload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]);

module.exports = { uploadBlogMedia, blogUpload };
