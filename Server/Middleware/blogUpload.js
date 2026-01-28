const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const maxUploadMb = Number(process.env.BLOG_UPLOAD_MAX_MB) || 200;
const maxUploadBytes = maxUploadMb * 1024 * 1024;

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
        'application/octet-stream'
    ];
    
    if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, WebP images and MP4, MPEG, MOV, WebM, OGG, AVI, MKV, 3GP, and FLV videos are allowed.'), false);
    }
};

// Configure Cloudinary storage for images
const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'power-supplement/blogs/images',
        resource_type: 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
    }
});

// Configure Cloudinary storage for videos
const videoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'power-supplement/blogs/videos',
        resource_type: 'video',
        allowed_formats: ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', '3gp', 'flv']
    }
});

// Configure Cloudinary storage for thumbnails
const thumbnailStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'power-supplement/blogs/thumbnails',
        resource_type: 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
    }
});

// Create multer instances for different file types
const imageUpload = multer({
    storage: imageStorage,
    fileFilter: fileFilter,
    limits: { fileSize: maxUploadBytes }
});

const videoUpload = multer({
    storage: videoStorage,
    fileFilter: fileFilter,
    limits: { fileSize: maxUploadBytes }
});

const thumbnailUpload = multer({
    storage: thumbnailStorage,
    fileFilter: fileFilter,
    limits: { fileSize: maxUploadBytes }
});

// Middleware to handle multiple file fields with Cloudinary
const uploadBlogMedia = (req, res, next) => {
    const multiUpload = multer({
        storage: new CloudinaryStorage({
            cloudinary: cloudinary,
            params: async (req, file) => {
                let folder = 'power-supplement/blogs/images';
                let resource_type = 'auto';
                
                if (file.fieldname === 'video') {
                    folder = 'power-supplement/blogs/videos';
                    resource_type = 'video';
                } else if (file.fieldname === 'thumbnail') {
                    folder = 'power-supplement/blogs/thumbnails';
                    resource_type = 'auto';
                }
                
                return {
                    folder: folder,
                    resource_type: resource_type
                };
            }
        }),
        fileFilter: fileFilter,
        limits: { fileSize: maxUploadBytes }
    }).fields([
        { name: 'image', maxCount: 1 },
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]);

    multiUpload(req, res, next);
};

module.exports = { uploadBlogMedia, blogUpload: { fields: uploadBlogMedia } };
