const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: [true, 'Coupon description is required']
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage',
    required: true
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative']
  },
  minimumOrderAmount: {
    type: Number,
    default: 0,
    min: [0, 'Minimum order amount cannot be negative']
  },
  maxDiscountAmount: {
    type: Number,
    default: null,
    min: [0, 'Maximum discount amount cannot be negative']
  },
  usageLimit: {
    type: Number,
    default: null,
    min: [0, 'Usage limit cannot be negative']
  },
  usageCount: {
    type: Number,
    default: 0,
    min: [0, 'Usage count cannot be negative']
  },
  userUsageLimit: {
    type: Number,
    default: null,
    min: [0, 'User usage limit cannot be negative']
  },
  usedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    usedAt: {
      type: Date,
      default: Date.now
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  }],
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableCategories: [{
    type: String
  }],
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  excludedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for performance
couponSchema.index({ validFrom: 1, validUntil: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ 'usedBy.user': 1 });

// Virtual for checking if coupon is expired
couponSchema.virtual('isExpired').get(function() {
  return new Date() > this.validUntil;
});

// Virtual for checking if coupon is valid time-wise
couponSchema.virtual('isValidTimeRange').get(function() {
  const now = new Date();
  return now >= this.validFrom && now <= this.validUntil;
});

// Virtual for remaining uses
couponSchema.virtual('remainingUses').get(function() {
  if (!this.usageLimit) return null;
  return this.usageLimit - this.usageCount;
});

// Method to check if a user can use this coupon
couponSchema.methods.canBeUsedByUser = function(userId) {
  if (!userId) return { valid: false, reason: 'User not authenticated' };
  
  // Check if coupon is active
  if (!this.isActive) {
    return { valid: false, reason: 'Coupon is not active' };
  }
  
  // Check time validity
  if (!this.isValidTimeRange) {
    if (new Date() < this.validFrom) {
      return { valid: false, reason: 'Coupon is not yet valid' };
    }
    return { valid: false, reason: 'Coupon has expired' };
  }
  
  // Check overall usage limit
  if (this.usageLimit && this.usageCount >= this.usageLimit) {
    return { valid: false, reason: 'Coupon usage limit reached' };
  }
  
  // Check user-specific usage limit (if set)
  if (this.userUsageLimit !== null) {
    const userUsageCount = this.usedBy.filter(
      usage => usage.user.toString() === userId.toString()
    ).length;
    
    if (userUsageCount >= this.userUsageLimit) {
      return { valid: false, reason: `You have already used this coupon ${userUsageCount} time(s)` };
    }
  }
  
  return { valid: true };
};

// Method to calculate discount for an order
couponSchema.methods.calculateDiscount = function(orderAmount, applicableProducts = []) {
  let discountAmount = 0;
  let applicableAmount = orderAmount;
  
  // If specific products are applicable, calculate only on those
  if (this.applicableProducts && this.applicableProducts.length > 0) {
    applicableAmount = applicableProducts
      .filter(item => this.applicableProducts.includes(item.product))
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
  
  // Check minimum order amount
  if (applicableAmount < this.minimumOrderAmount) {
    return {
      valid: false,
      reason: `Minimum order amount of NPR ${this.minimumOrderAmount} required`,
      discount: 0
    };
  }
  
  // Calculate discount based on type
  if (this.discountType === 'percentage') {
    discountAmount = (applicableAmount * this.discountValue) / 100;
  } else if (this.discountType === 'fixed') {
    discountAmount = Math.min(this.discountValue, applicableAmount);
  }
  
  // Apply maximum discount cap if set
  if (this.maxDiscountAmount && discountAmount > this.maxDiscountAmount) {
    discountAmount = this.maxDiscountAmount;
  }
  
  return {
    valid: true,
    discount: Math.round(discountAmount * 100) / 100, // Round to 2 decimal places
    applicableAmount,
    finalAmount: orderAmount - discountAmount
  };
};

// Method to record usage
couponSchema.methods.recordUsage = async function(userId, orderId) {
  this.usedBy.push({
    user: userId,
    orderId: orderId,
    usedAt: new Date()
  });
  this.usageCount += 1;
  await this.save();
};

// Static method to validate and get coupon
couponSchema.statics.validateCoupon = async function(code, userId, orderAmount, products = []) {
  const coupon = await this.findOne({ 
    code: code.toUpperCase(),
    isActive: true 
  });
  
  if (!coupon) {
    return { valid: false, reason: 'Invalid coupon code' };
  }
  
  // Check if user can use the coupon
  const userValidation = coupon.canBeUsedByUser(userId);
  if (!userValidation.valid) {
    return userValidation;
  }
  
  // Calculate discount
  const discountInfo = coupon.calculateDiscount(orderAmount, products);
  if (!discountInfo.valid) {
    return discountInfo;
  }
  
  return {
    valid: true,
    coupon,
    discount: discountInfo.discount,
    finalAmount: discountInfo.finalAmount,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue
  };
};

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
