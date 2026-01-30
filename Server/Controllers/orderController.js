const Order = require('../Models/Order');
const User = require('../Models/User');
const { applyCouponToOrder } = require('./couponController');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress, paymentMethod, couponCode } = req.body;
        console.log(totalAmount)
        
        // Validate required fields
        if (!items || !totalAmount || !shippingAddress || !paymentMethod) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        // Validate shipping address fields including phone
        if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || 
            !shippingAddress.postal_code || !shippingAddress.phone) {
            return res.status(400).json({
                success: false,
                message: 'All shipping address fields including phone number are required'
            });
        }

        // Validate items array
        if (!Array.isArray(items) || items.length === 0) { 
            return res.status(400).json({
                success: false,
                message: 'Order must contain at least one item'
            });
        }

        // Validate phone number format (basic validation)
        const phoneRegex = /^[0-9]{7,15}$/;
        if (!phoneRegex.test(shippingAddress.phone.replace(/[\s-]/g, ''))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format'
            });
        }

        // Validate each item has required fields
        for (const item of items) {
            if (!item.product) {
                return res.status(400).json({
                    success: false,
                    message: 'Each item must have a product ID'
                });
            }
        }
        
        // Calculate subtotal (original amount before discount)
        let subtotal = totalAmount;
        let finalAmount = totalAmount;
        let couponData = null;
        
        // Apply coupon if provided
        if (couponCode) {
            try {
                // Create a temporary order ID for coupon validation
                const tempOrder = new Order({
                    user: req.user._id,
                    items: items.map(item => ({ 
                        product: item.product,
                        quantity: item.quantity
                    })),
                    totalAmount: subtotal,
                    subtotal: subtotal,
                    paymentMethod,
                    shippingAddress,
                    status: 'pending'
                });
                
                // Save temporarily to get ID
                await tempOrder.save();
                
                // Apply coupon
                const couponResult = await applyCouponToOrder(
                    couponCode,
                    req.user._id,
                    subtotal,
                    tempOrder._id,
                    items
                );
                
                if (couponResult) {
                    finalAmount = couponResult.finalAmount;
                    couponData = {
                        code: couponResult.couponCode,
                        discountAmount: couponResult.discount,
                        discountType: 'percentage', // Will be updated from coupon
                        discountValue: 5 // Will be updated from coupon
                    };
                    
                    // Update the order with coupon data
                    tempOrder.totalAmount = finalAmount;
                    tempOrder.couponApplied = couponData;
                    await tempOrder.save();
                    
                    // Use the updated order
                    const order = tempOrder;
                    
                    res.status(201).json({
                        success: true,
                        order,
                        message: 'Order created successfully with coupon applied',
                        discount: couponResult.discount
                    });
                    return;
                } else {
                    // If coupon failed, delete temp order and continue without coupon
                    await tempOrder.deleteOne();
                }
            } catch (couponError) {
                console.error('Coupon application error:', couponError);
                // Continue without coupon if there's an error
                return res.status(400).json({
                    success: false,
                    message: couponError.message || 'Invalid coupon code'
                });
            }
        }
        
        // Create new order (without coupon)
        const order = new Order({
            user: req.user._id,
            items: items.map(item => ({ 
                product: item.product,
                quantity: item.quantity
            })),
            totalAmount: finalAmount,
            subtotal: subtotal,
            paymentMethod,
            shippingAddress,
            status: paymentMethod === 'cod' ? 'pending' : 'pending',
            couponApplied: couponData
        });
        
        // Save order to database
        await order.save();
        
        res.status(201).json({
            success: true,
            order,
            message: 'Order created successfully'
        });
    } catch (error) {
        console.error('Create order error:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid order data',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create order'
        });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const order = await Order.findById(orderId)
            .populate('user', 'name email')
            .populate('items.product', 'name price image');
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        // Check if the order belongs to the requesting user
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this order'
            });
        }
        
        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve order'
        });
    }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('items.product', 'name price images');
        
        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve orders'
        });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, paymentDetails } = req.body;
        
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        // Update order status
        if (status) {
            order.status = status;
        }

        
        
        // Update payment details if provided
        if (paymentDetails) {
            order.paymentDetails = {
                ...order.paymentDetails,
                ...paymentDetails
            };
        }
        
        await order.save();
        
        res.status(200).json({
            success: true,
            data: order,
            message: 'Order updated successfully'
        });
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order'
        });
    }
};
