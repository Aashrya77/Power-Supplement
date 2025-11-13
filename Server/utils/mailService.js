const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify transporter connection
transporter.verify((error, success) => {
    if (error) {
        console.log('Mail service error:', error);
    } else {
        console.log('Mail service ready');
    }
});

/**
 * Send email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @returns {Promise}
 */
const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

/**
 * Send order confirmation email
 * @param {string} to - Customer email
 * @param {object} order - Order details
 */
const sendOrderConfirmationEmail = async (to, order) => {
    const itemsHtml = order.items
        .map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.productName}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">Rs. ${item.price}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">Rs. ${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
        `)
        .join('');

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Poppins', Arial, sans-serif; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #d32f2f; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                .content { background-color: #f9f9f9; padding: 20px; }
                .order-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
                .order-details h3 { color: #d32f2f; margin-top: 0; }
                table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                th { background-color: #f0f0f0; padding: 10px; text-align: left; font-weight: 600; }
                .total { font-size: 18px; font-weight: bold; color: #d32f2f; text-align: right; padding: 15px 0; }
                .footer { background-color: #111111; color: #e0e0e0; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 5px 5px; }
                .button { background-color: #d32f2f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Order Confirmation</h1>
                    <p>Order ID: ${order._id.toString().slice(-6).toUpperCase()}</p>
                </div>
                <div class="content">
                    <p>Hi ${order.customerName},</p>
                    <p>Thank you for your order! We're excited to get your Power Supplement products to you.</p>
                    
                    <div class="order-details">
                        <h3>Order Details</h3>
                        <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> <span style="color: #d32f2f; font-weight: bold;">${order.status.toUpperCase()}</span></p>
                    </div>

                    <div class="order-details">
                        <h3>Items Ordered</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th style="text-align: center;">Qty</th>
                                    <th style="text-align: right;">Price</th>
                                    <th style="text-align: right;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                            </tbody>
                        </table>
                        <div class="total">Total Amount: Rs. ${order.totalAmount.toFixed(2)}</div>
                    </div>

                    <div class="order-details">
                        <h3>Shipping Address</h3>
                        <p>
                            ${order.shippingAddress.street}<br>
                            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postal_code}<br>
                            ${order.shippingAddress.country}
                        </p>
                    </div>

                    <div class="order-details">
                        <h3>Payment Information</h3>
                        <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
                        <p><strong>Payment Status:</strong> <span style="color: #4caf50; font-weight: bold;">${order.status.toUpperCase()}</span></p>
                    </div>

                    <p>We'll notify you when your order ships. If you have any questions, please don't hesitate to contact us.</p>
                    <a href="https://powersupplement.net" class="button">Track Your Order</a>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Power Supplement. All rights reserved.</p>
                    <p>This is an automated email. Please do not reply directly.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    return sendEmail(to, 'Order Confirmation - Power Supplement', html);
};

/**
 * Send welcome email
 * @param {string} to - User email
 * @param {string} name - User name
 */
const sendWelcomeEmail = async (to, name) => {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Poppins', Arial, sans-serif; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #d32f2f; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                .content { background-color: #f9f9f9; padding: 20px; }
                .footer { background-color: #111111; color: #e0e0e0; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 5px 5px; }
                .button { background-color: #d32f2f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to Power Supplement!</h1>
                </div>
                <div class="content">
                    <p>Hi ${name},</p>
                    <p>Welcome to Power Supplement! We're thrilled to have you join our community of fitness enthusiasts.</p>
                    <p>You now have access to:</p>
                    <ul>
                        <li>Premium supplement products</li>
                        <li>Exclusive deals and discounts</li>
                        <li>Fast and reliable shipping</li>
                        <li>Expert customer support</li>
                    </ul>
                    <p>Start exploring our collection of high-quality supplements today!</p>
                    <a href="https://powersupplement.net" class="button">Shop Now</a>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Power Supplement. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    return sendEmail(to, 'Welcome to Power Supplement!', html);
};

/**
 * Send password reset email
 * @param {string} to - User email
 * @param {string} resetToken - Reset token
 * @param {string} name - User name
 */
const sendPasswordResetEmail = async (to, resetToken, name) => {
    const resetLink = `https://powersupplement.net/reset-password?token=${resetToken}`;
    
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Poppins', Arial, sans-serif; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #d32f2f; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                .content { background-color: #f9f9f9; padding: 20px; }
                .warning { background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 15px 0; }
                .footer { background-color: #111111; color: #e0e0e0; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 5px 5px; }
                .button { background-color: #d32f2f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
                .code { background-color: #f0f0f0; padding: 10px; border-radius: 5px; word-break: break-all; font-family: monospace; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>Hi ${name},</p>
                    <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
                    
                    <div class="warning">
                        <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. Do not share this link with anyone.
                    </div>

                    <p>Click the button below to reset your password:</p>
                    <a href="${resetLink}" class="button">Reset Password</a>

                    <p>Or copy and paste this link in your browser:</p>
                    <div class="code">${resetLink}</div>

                    <p>If you have any questions, please contact our support team.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Power Supplement. All rights reserved.</p>
                    <p>This is an automated email. Please do not reply directly.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    return sendEmail(to, 'Password Reset Request - Power Supplement', html);
};

/**
 * Send order status update email
 * @param {string} to - Customer email
 * @param {object} order - Order details
 * @param {string} newStatus - New order status
 */
const sendOrderStatusEmail = async (to, order, newStatus) => {
    const statusMessages = {
        pending: 'Your order has been received and is being processed.',
        paid: 'Payment confirmed! Your order is being prepared for shipment.',
        delivered: 'Your order has been delivered. Thank you for your purchase!',
        failed: 'There was an issue with your order. Please contact support.'
    };

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Poppins', Arial, sans-serif; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #d32f2f; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                .content { background-color: #f9f9f9; padding: 20px; }
                .status-box { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #d32f2f; }
                .footer { background-color: #111111; color: #e0e0e0; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 5px 5px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Order Status Update</h1>
                    <p>Order ID: ${order._id.toString().slice(-6).toUpperCase()}</p>
                </div>
                <div class="content">
                    <p>Hi ${order.customerName},</p>
                    
                    <div class="status-box">
                        <h3 style="margin-top: 0; color: #d32f2f;">Status: ${newStatus.toUpperCase()}</h3>
                        <p>${statusMessages[newStatus] || 'Your order status has been updated.'}</p>
                    </div>

                    <p>Thank you for shopping with Power Supplement!</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Power Supplement. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    return sendEmail(to, `Order Status Update - Power Supplement`, html);
};

module.exports = {
    sendEmail,
    sendOrderConfirmationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendOrderStatusEmail
};
