const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { Readable } = require('stream');
const fs = require('fs');
const path = require('path');
const os = require('os');

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

// Helper: upload a buffer to Cloudinary using upload_stream (for images / small files)
const uploadToCloudinary = (buffer, options) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { ...options, timeout: 600000 },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        const readable = new Readable();
        const CHUNK = 6 * 1024 * 1024;
        for (let i = 0; i < buffer.length; i += CHUNK) {
            readable.push(buffer.slice(i, i + CHUNK));
        }
        readable.push(null);
        readable.pipe(uploadStream);
    });
};

// Helper: upload large files via upload_large (true multi-part chunked upload)
// SDK v1 upload_large uses callbacks, not promises — wrap in a Promise
const uploadLargeToCloudinary = (buffer, options) => {
    return new Promise((resolve, reject) => {
        const tmpFile = path.join(os.tmpdir(), `blog_video_${Date.now()}`);
        fs.writeFileSync(tmpFile, buffer);

        cloudinary.uploader.upload_large(tmpFile, {
            ...options,
            chunk_size: 20 * 1024 * 1024, // 20 MB chunks
            timeout: 600000
        }, (error, result) => {
            // Clean up temp file
            try { fs.unlinkSync(tmpFile); } catch (_) { /* ignore */ }

            if (error) return reject(error);
            resolve(result);
        });
    });
};

// Use memory storage so we control the Cloudinary upload ourselves
const memoryUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter: fileFilter,
    limits: { fileSize: maxUploadBytes }
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]);

// Middleware to handle multiple file fields with Cloudinary
const uploadBlogMedia = (req, res, next) => {
    // Extend request timeout for large uploads (10 minutes)
    req.setTimeout(600000);
    if (res.connection) res.connection.setTimeout(600000);

    memoryUpload(req, res, function (err) {
        if (err) {
            console.error('[blogUpload] multer error:', err.message);
            return next(err);
        }

        console.log('[blogUpload] multer done. req.files keys:', req.files ? Object.keys(req.files) : 'none');

        // Run the async Cloudinary uploads, then call next() or send error
        (async () => {
            if (!req.files) return next();

            // Upload image to Cloudinary (standard stream upload)
            if (req.files.image && req.files.image[0]) {
                console.log('[blogUpload] Uploading image to Cloudinary...');
                const result = await uploadToCloudinary(req.files.image[0].buffer, {
                    folder: 'power-supplement/blogs/images',
                    resource_type: 'image'
                });
                req.files.image[0].path = result.secure_url;
                console.log('[blogUpload] Image upload complete:', result.secure_url);
            }

            // Upload video to Cloudinary using upload_large (chunked multi-part)
            if (req.files.video && req.files.video[0]) {
                console.log(`[blogUpload] Uploading video (${(req.files.video[0].buffer.length / 1024 / 1024).toFixed(1)} MB) via chunked upload...`);
                const result = await uploadLargeToCloudinary(req.files.video[0].buffer, {
                    folder: 'power-supplement/blogs/videos',
                    resource_type: 'video'
                });
                console.log('[blogUpload] upload_large result keys:', Object.keys(result || {}));
                console.log('[blogUpload] upload_large result:', JSON.stringify(result, null, 2));
                req.files.video[0].path = result.secure_url || result.url;
                console.log('[blogUpload] Video upload complete:', req.files.video[0].path);
            }

            // Upload thumbnail to Cloudinary (standard stream upload)
            if (req.files.thumbnail && req.files.thumbnail[0]) {
                console.log('[blogUpload] Uploading thumbnail to Cloudinary...');
                const result = await uploadToCloudinary(req.files.thumbnail[0].buffer, {
                    folder: 'power-supplement/blogs/thumbnails',
                    resource_type: 'image'
                });
                req.files.thumbnail[0].path = result.secure_url;
                console.log('[blogUpload] Thumbnail upload complete:', result.secure_url);
            }

            console.log('[blogUpload] All uploads done, calling next()');
            next();
        })().catch((uploadError) => {
            console.error('[blogUpload] Cloudinary upload error:', uploadError);

            // Send error response directly — next(err) from inside multer's
            // callback does not reliably reach Express's error handler
            if (!res.headersSent) {
                const status = uploadError.http_code || 500;
                const message = uploadError.http_code === 413
                    ? 'Video file is too large for Cloudinary. Please compress it or use the Video URL option.'
                    : `Upload to cloud storage failed: ${uploadError.message || 'Unknown error'}`;
                return res.status(status).json({ success: false, message });
            }
        });
    });
};

module.exports = { uploadBlogMedia, blogUpload: { fields: uploadBlogMedia } };
