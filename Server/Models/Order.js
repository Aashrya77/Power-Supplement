const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        postal_code: {
            type: String,
            required: true
        },
        country: {
            type: String,
            default: 'Nepal'
        }
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['esewa', 'cod']
    },
    paymentDetails: {
        transactionId: String,
        referenceId: String,
        amount: Number 
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'delivered'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);