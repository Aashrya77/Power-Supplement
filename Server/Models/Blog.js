const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  excerpt: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 300
  },
  content: { 
    type: String, 
    required: true
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Supplements', 'Nutrition', 'Training', 'Weight Loss', 'Recovery']
  },
  author: { 
    type: String, 
    required: true,
    default: 'Power Team'
  },
  date: { 
    type: Date, 
    required: true, 
    default: Date.now 
  },
  readTime: { 
    type: String, 
    required: true,
    default: '5 min read'
  },
  mediaType: { 
    type: String, 
    required: true,
    enum: ['image', 'video']
  },
  imageUrl: { 
    type: String,
    validate: {
      validator: function(v) {
        // imageUrl is required if mediaType is 'image'
        if (this.mediaType === 'image') {
          return !!v;
        }
        return true;
      },
      message: 'Image URL is required when media type is image'
    }
  },
  videoUrl: { 
    type: String,
    validate: {
      validator: function(v) {
        // videoUrl is required if mediaType is 'video'
        if (this.mediaType === 'video') {
          return !!v;
        }
        return true;
      },
      message: 'Video URL is required when media type is video'
    }
  },
  thumbnail: { 
    type: String,
    default: null
  },
  published: { 
    type: Boolean, 
    default: true
  },
  views: { 
    type: Number, 
    default: 0
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  }
}, {
  timestamps: true
});

// Create slug from title before saving
blogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Index for better query performance
blogSchema.index({ category: 1, published: 1, date: -1 });
blogSchema.index({ slug: 1 });

module.exports = mongoose.model('Blog', blogSchema);
