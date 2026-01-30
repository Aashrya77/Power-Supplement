const Coupon = require('../Models/Coupon');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Admin Operations

// Create a new coupon (Admin only)
exports.createCoupon = catchAsync(async (req, res, next) => {
  // Check if user is admin
  if (!req.user.isAdmin) {
    return next(new AppError('Not authorized to access this resource', 403));
  }
  const {
    code,
    description,
    discountType,
    discountValue,
    minimumOrderAmount,
    maxDiscountAmount,
    usageLimit,
    userUsageLimit,
    validFrom,
    validUntil,
    applicableCategories,
    applicableProducts,
    excludedProducts
  } = req.body;

  // Validate discount value based on type
  if (discountType === 'percentage' && (discountValue < 0 || discountValue > 100)) {
    return next(new AppError('Percentage discount must be between 0 and 100', 400));
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    description,
    discountType,
    discountValue,
    minimumOrderAmount,
    maxDiscountAmount,
    usageLimit,
    userUsageLimit,
    validFrom: validFrom || Date.now(),
    validUntil,
    applicableCategories,
    applicableProducts,
    excludedProducts,
    createdBy: req.user._id
  });

  res.status(201).json({
    status: 'success',
    data: {
      coupon
    }
  });
});

// Get all coupons (Admin only)
exports.getAllCoupons = catchAsync(async (req, res, next) => {
  // Check if user is admin
  if (!req.user.isAdmin) {
    return next(new AppError('Not authorized to access this resource', 403));
  }
  const { active, expired, search } = req.query;
  
  let query = {};
  
  // Filter by active status
  if (active !== undefined) {
    query.isActive = active === 'true';
  }
  
  // Filter by expiry
  if (expired === 'true') {
    query.validUntil = { $lt: new Date() };
  } else if (expired === 'false') {
    query.validUntil = { $gte: new Date() };
  }
  
  // Search by code or description
  if (search) {
    query.$or = [
      { code: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  const coupons = await Coupon.find(query)
    .populate('createdBy', 'name email')
    .populate('applicableProducts', 'name')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: coupons.length,
    data: {
      coupons
    }
  });
});

// Get single coupon details (Admin only)
exports.getCoupon = catchAsync(async (req, res, next) => {
  // Check if user is admin
  if (!req.user.isAdmin) {
    return next(new AppError('Not authorized to access this resource', 403));
  }
  const coupon = await Coupon.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('applicableProducts', 'name price')
    .populate('excludedProducts', 'name')
    .populate('usedBy.user', 'name email');

  if (!coupon) {
    return next(new AppError('No coupon found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      coupon
    }
  });
});

// Update coupon (Admin only)
exports.updateCoupon = catchAsync(async (req, res, next) => {
  // Check if user is admin
  if (!req.user.isAdmin) {
    return next(new AppError('Not authorized to access this resource', 403));
  }
  const {
    description,
    discountType,
    discountValue,
    minimumOrderAmount,
    maxDiscountAmount,
    usageLimit,
    userUsageLimit,
    validFrom,
    validUntil,
    isActive,
    applicableCategories,
    applicableProducts,
    excludedProducts
  } = req.body;

  // Don't allow code change
  if (req.body.code) {
    return next(new AppError('Coupon code cannot be changed', 400));
  }

  // Validate discount value if provided
  if (discountType === 'percentage' && discountValue !== undefined) {
    if (discountValue < 0 || discountValue > 100) {
      return next(new AppError('Percentage discount must be between 0 and 100', 400));
    }
  }

  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maxDiscountAmount,
      usageLimit,
      userUsageLimit,
      validFrom,
      validUntil,
      isActive,
      applicableCategories,
      applicableProducts,
      excludedProducts
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!coupon) {
    return next(new AppError('No coupon found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      coupon
    }
  });
});

// Delete coupon (Admin only)
exports.deleteCoupon = catchAsync(async (req, res, next) => {
  // Check if user is admin
  if (!req.user.isAdmin) {
    return next(new AppError('Not authorized to access this resource', 403));
  }
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(new AppError('No coupon found with that ID', 404));
  }

  // Check if coupon has been used
  if (coupon.usageCount > 0) {
    return next(new AppError('Cannot delete a coupon that has been used. Deactivate it instead.', 400));
  }

  await coupon.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Toggle coupon active status (Admin only)
exports.toggleCouponStatus = catchAsync(async (req, res, next) => {
  // Check if user is admin
  if (!req.user.isAdmin) {
    return next(new AppError('Not authorized to access this resource', 403));
  }
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(new AppError('No coupon found with that ID', 404));
  }

  coupon.isActive = !coupon.isActive;
  await coupon.save();

  res.status(200).json({
    status: 'success',
    message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`,
    data: {
      coupon
    }
  });
});

// Get coupon statistics (Admin only)
exports.getCouponStats = catchAsync(async (req, res, next) => {
  // Check if user is admin
  if (!req.user.isAdmin) {
    return next(new AppError('Not authorized to access this resource', 403));
  }
  const couponId = req.params.id;
  
  const coupon = await Coupon.findById(couponId)
    .populate('usedBy.user', 'name email')
    .populate('usedBy.orderId', 'totalAmount createdAt');

  if (!coupon) {
    return next(new AppError('No coupon found with that ID', 404));
  }

  // Calculate total discount given
  let totalDiscountGiven = 0;
  let totalOrdersValue = 0;
  
  for (const usage of coupon.usedBy) {
    if (usage.orderId) {
      const orderAmount = usage.orderId.totalAmount || 0;
      totalOrdersValue += orderAmount;
      
      // Calculate discount for this order
      if (coupon.discountType === 'percentage') {
        totalDiscountGiven += (orderAmount * coupon.discountValue) / 100;
      } else {
        totalDiscountGiven += Math.min(coupon.discountValue, orderAmount);
      }
    }
  }

  const stats = {
    code: coupon.code,
    description: coupon.description,
    totalUsage: coupon.usageCount,
    remainingUses: coupon.remainingUses,
    uniqueUsers: [...new Set(coupon.usedBy.map(u => u.user?._id?.toString()))].length,
    totalDiscountGiven: Math.round(totalDiscountGiven * 100) / 100,
    totalOrdersValue: Math.round(totalOrdersValue * 100) / 100,
    averageOrderValue: coupon.usageCount > 0 ? Math.round((totalOrdersValue / coupon.usageCount) * 100) / 100 : 0,
    isActive: coupon.isActive,
    isExpired: coupon.isExpired,
    usageHistory: coupon.usedBy.map(usage => ({
      user: usage.user,
      usedAt: usage.usedAt,
      orderAmount: usage.orderId?.totalAmount || 0
    }))
  };

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

// Customer Operations

// Validate coupon for customer
exports.validateCouponForCustomer = catchAsync(async (req, res, next) => {
  const { code, orderAmount, products } = req.body;

  if (!code) {
    return next(new AppError('Please provide a coupon code', 400));
  }

  if (!orderAmount || orderAmount <= 0) {
    return next(new AppError('Please provide a valid order amount', 400));
  }

  const validation = await Coupon.validateCoupon(
    code,
    req.user._id,
    orderAmount,
    products
  );

  if (!validation.valid) {
    return next(new AppError(validation.reason, 400));
  }

  res.status(200).json({
    status: 'success',
    data: {
      valid: true,
      code: validation.coupon.code,
      description: validation.coupon.description,
      discountType: validation.discountType,
      discountValue: validation.discountValue,
      discount: validation.discount,
      finalAmount: validation.finalAmount,
      minimumOrderAmount: validation.coupon.minimumOrderAmount
    }
  });
});

// Get active coupons available to customer
exports.getAvailableCoupons = catchAsync(async (req, res, next) => {
  const now = new Date();
  
  // Find active and valid coupons
  const coupons = await Coupon.find({
    isActive: true,
    validFrom: { $lte: now },
    validUntil: { $gte: now }
  }).select('code description discountType discountValue minimumOrderAmount validUntil');

  // Filter coupons that the user can still use
  const availableCoupons = [];
  
  for (const coupon of coupons) {
    const validation = coupon.canBeUsedByUser(req.user._id);
    if (validation.valid) {
      availableCoupons.push({
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumOrderAmount: coupon.minimumOrderAmount,
        validUntil: coupon.validUntil
      });
    }
  }

  res.status(200).json({
    status: 'success',
    results: availableCoupons.length,
    data: {
      coupons: availableCoupons
    }
  });
});

// Apply coupon to order (called internally during order creation)
exports.applyCouponToOrder = async (code, userId, orderAmount, orderId, products = []) => {
  if (!code) return null;

  const validation = await Coupon.validateCoupon(code, userId, orderAmount, products);
  
  if (!validation.valid) {
    throw new AppError(validation.reason, 400);
  }

  // Record the usage
  await validation.coupon.recordUsage(userId, orderId);

  return {
    couponCode: validation.coupon.code,
    discount: validation.discount,
    finalAmount: validation.finalAmount
  };
};
