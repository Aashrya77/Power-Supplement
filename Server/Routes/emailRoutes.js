const express = require('express');
const router = express.Router();
const {
    sendEmail,
    sendOrderConfirmationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendOrderStatusEmail
} = require('../utils/mailService');

/**
 * POST /api/v1/email/send
 * Send a custom email (for testing)
 */
router.post('/send', async (req, res) => {
    try {
        const { to, subject, html } = req.body;

        if (!to || !subject || !html) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: to, subject, html'
            });
        }

        const result = await sendEmail(to, subject, html);
        res.status(200).json({
            success: true,
            message: 'Email sent successfully',
            data: result
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send email',
            error: error.message
        });
    }
});

/**
 * POST /api/v1/email/order-confirmation
 * Send order confirmation email
 */
router.post('/order-confirmation', async (req, res) => {
    try {
        const { to, order } = req.body;

        if (!to || !order) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: to, order'
            });
        }

        const result = await sendOrderConfirmationEmail(to, order);
        res.status(200).json({
            success: true,
            message: 'Order confirmation email sent successfully',
            data: result
        });
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send order confirmation email',
            error: error.message
        });
    }
});

/**
 * POST /api/v1/email/welcome
 * Send welcome email
 */
router.post('/welcome', async (req, res) => {
    try {
        const { to, name } = req.body;

        if (!to || !name) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: to, name'
            });
        }

        const result = await sendWelcomeEmail(to, name);
        res.status(200).json({
            success: true,
            message: 'Welcome email sent successfully',
            data: result
        });
    } catch (error) {
        console.error('Error sending welcome email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send welcome email',
            error: error.message
        });
    }
});

/**
 * POST /api/v1/email/password-reset
 * Send password reset email
 */
router.post('/password-reset', async (req, res) => {
    try {
        const { to, resetToken, name } = req.body;

        if (!to || !resetToken || !name) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: to, resetToken, name'
            });
        }

        const result = await sendPasswordResetEmail(to, resetToken, name);
        res.status(200).json({
            success: true,
            message: 'Password reset email sent successfully',
            data: result
        });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send password reset email',
            error: error.message
        });
    }
});

/**
 * POST /api/v1/email/order-status
 * Send order status update email
 */
router.post('/order-status', async (req, res) => {
    try {
        const { to, order, newStatus } = req.body;

        if (!to || !order || !newStatus) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: to, order, newStatus'
            });
        }

        const result = await sendOrderStatusEmail(to, order, newStatus);
        res.status(200).json({
            success: true,
            message: 'Order status email sent successfully',
            data: result
        });
    } catch (error) {
        console.error('Error sending order status email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send order status email',
            error: error.message
        });
    }
});

module.exports = router;
