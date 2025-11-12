const Order = require('../Models/Order');
const User = require('../Models/User');
const Product = require('../Models/Product');

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this resource'
            });
        }

        // Fetch all orders with populated user and product data
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate('user', 'username email phone')
            .populate('items.product', 'name price image');

        res.status(200).json({
            success: true,
            data: orders,
            count: orders.length
        });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve orders'
        });
    }
};

// Get dashboard statistics (admin only)
exports.getDashboardStats = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this resource'
            });
        }

        // Get total orders
        const totalOrders = await Order.countDocuments();

        // Get total revenue
        const revenueData = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' }
                }
            }
        ]);
        const totalRevenue = revenueData[0]?.totalRevenue || 0;

        // Get total products
        const totalProducts = await Product.countDocuments();

        // Get total users
        const totalUsers = await User.countDocuments();

        // Get orders by status
        const ordersByStatus = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalOrders,
                totalRevenue,
                totalProducts,
                totalUsers,
                ordersByStatus
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve dashboard statistics'
        });
    }
};

// Update order status (admin only)
exports.updateOrderStatusAdmin = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this resource'
            });
        }

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
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order'
        });
    }
};
