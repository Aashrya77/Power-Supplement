# Nodemailer Integration Guide

## Overview
Nodemailer has been integrated into the backend to handle email notifications for orders, welcome emails, password resets, and order status updates.

## Installation

The `nodemailer` package has been added to `package.json`. Install dependencies:

```bash
npm install
```

## Environment Variables

Add the following variables to your `.env` file:

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@powersupplement.net
```

### Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Google Account
2. **Generate App Password**:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Navigate to "App passwords"
   - Select "Mail" and "Windows Computer"
   - Copy the generated 16-character password
   - Use this as `EMAIL_PASSWORD` in `.env`

### Alternative Email Services

You can use any service supported by Nodemailer:
- **SendGrid**: Set `EMAIL_SERVICE=sendgrid` and use API key as password
- **Mailgun**: Set `EMAIL_SERVICE=mailgun`
- **Custom SMTP**: Configure host, port, auth manually

## API Endpoints

### 1. Send Custom Email
```
POST /api/v1/email/send
Content-Type: application/json

{
  "to": "customer@example.com",
  "subject": "Test Email",
  "html": "<h1>Hello</h1><p>This is a test email</p>"
}
```

### 2. Send Order Confirmation
```
POST /api/v1/email/order-confirmation
Content-Type: application/json

{
  "to": "customer@example.com",
  "order": {
    "_id": "507f1f77bcf86cd799439011",
    "customerName": "John Doe",
    "items": [
      {
        "productName": "Nite Burn™",
        "quantity": 2,
        "price": 2500
      }
    ],
    "totalAmount": 5000,
    "shippingAddress": {
      "street": "123 Main St",
      "city": "Kathmandu",
      "state": "Bagmati",
      "postal_code": "44600",
      "country": "Nepal"
    },
    "paymentMethod": "esewa",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 3. Send Welcome Email
```
POST /api/v1/email/welcome
Content-Type: application/json

{
  "to": "newuser@example.com",
  "name": "John Doe"
}
```

### 4. Send Password Reset Email
```
POST /api/v1/email/password-reset
Content-Type: application/json

{
  "to": "user@example.com",
  "name": "John Doe",
  "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 5. Send Order Status Update
```
POST /api/v1/email/order-status
Content-Type: application/json

{
  "to": "customer@example.com",
  "order": {
    "_id": "507f1f77bcf86cd799439011",
    "customerName": "John Doe"
  },
  "newStatus": "paid"
}
```

## Integration with Existing Features

### Order Creation
Update `orderController.js` to send confirmation email:

```javascript
const { sendOrderConfirmationEmail } = require('../utils/mailService');

// After order is created
await sendOrderConfirmationEmail(order.customerEmail, order);
```

### User Registration
Update `authController.js` to send welcome email:

```javascript
const { sendWelcomeEmail } = require('../utils/mailService');

// After user is created
await sendWelcomeEmail(user.email, user.name);
```

### Order Status Update
Update `adminController.js` to send status update email:

```javascript
const { sendOrderStatusEmail } = require('../utils/mailService');

// After order status is updated
await sendOrderStatusEmail(order.customerEmail, order, newStatus);
```

### Password Reset
Update `authController.js` to send reset email:

```javascript
const { sendPasswordResetEmail } = require('../utils/mailService');

// When user requests password reset
await sendPasswordResetEmail(user.email, resetToken, user.name);
```

## Email Templates

All email templates are styled with:
- **Dark theme** matching Power Supplement branding
- **Responsive design** for mobile and desktop
- **Professional formatting** with proper spacing and colors
- **Brand colors**: Red (#d32f2f) for primary actions

### Template Features
- Order confirmation with itemized list
- Welcome email with CTA
- Password reset with security notice
- Order status updates with contextual messages

## Testing

### Test Email Sending
```bash
curl -X POST http://localhost:5500/api/v1/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<h1>Test</h1>"
  }'
```

### Check Mail Service Status
The mail service logs connection status on server startup:
- ✅ "Mail service ready" - Service is configured correctly
- ❌ "Mail service error" - Check credentials in `.env`

## Troubleshooting

### "Invalid login" Error
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` are correct
- For Gmail, ensure you're using an App Password, not your regular password
- Check that 2FA is enabled on your Google Account

### "ECONNREFUSED" Error
- Verify internet connection
- Check firewall settings
- Ensure email service is accessible

### Emails Not Received
- Check spam/junk folder
- Verify recipient email address is correct
- Check email service logs for delivery failures

### CORS Issues
Email routes are included in CORS configuration. Ensure frontend origin is in the allowed list in `app.js`.

## Security Best Practices

1. **Never commit `.env`** - Keep credentials private
2. **Use App Passwords** - Don't use your main account password
3. **Rotate credentials** - Periodically update email passwords
4. **Rate limiting** - Consider adding rate limiting to email endpoints
5. **Validation** - Always validate email addresses before sending

## Files Modified/Created

- **Created**: `/utils/mailService.js` - Email service module
- **Created**: `/Routes/emailRoutes.js` - Email API endpoints
- **Modified**: `/app.js` - Added email routes registration
- **Modified**: `/package.json` - Added nodemailer dependency

## Next Steps

1. Install dependencies: `npm install`
2. Configure `.env` with email credentials
3. Test email endpoints
4. Integrate with existing controllers (order, auth, admin)
5. Deploy and monitor email delivery
