# Nodemailer Integration - Quick Start Guide

## What Was Done

✅ **Backend**: Nodemailer email service with 5 email templates
✅ **Frontend**: Contact form integrated with email submission
✅ **API**: Email endpoints ready to use
✅ **Styling**: Status messages with animations

## Quick Setup

### 1. Backend Setup (Server folder)

```bash
cd Server
npm install
```

Add to `.env`:
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@powersupplement.net
```

**For Gmail:**
1. Enable 2-Factor Authentication
2. Go to Google Account → Security → App passwords
3. Generate password for Mail/Windows
4. Use the 16-character password as `EMAIL_PASSWORD`

### 2. Frontend Ready to Use

Contact form at `/contact` automatically sends emails to `support@powersupplement.com`

## Features

### Contact Form
- ✅ Real-time validation
- ✅ Loading state
- ✅ Success/error messages
- ✅ Auto-reset on success

### Email Templates
1. **Order Confirmation** - Itemized order details
2. **Welcome Email** - New user greeting
3. **Password Reset** - Secure reset link
4. **Order Status Update** - Status change notifications
5. **Generic Email** - Custom emails

## API Endpoints

All endpoints at: `https://powersupplement.net/api/v1/email/`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/send` | POST | Send custom email |
| `/order-confirmation` | POST | Order confirmation |
| `/welcome` | POST | Welcome email |
| `/password-reset` | POST | Password reset |
| `/order-status` | POST | Status update |

## Test Contact Form

1. Go to `/contact` page
2. Fill out form
3. Click "Send Message"
4. Check `support@powersupplement.com` for email

## Integration with Existing Features

### In Order Controller
```javascript
const { sendOrderConfirmationEmail } = require('../utils/mailService');

// After creating order
await sendOrderConfirmationEmail(order.customerEmail, order);
```

### In Auth Controller
```javascript
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../utils/mailService');

// After user registration
await sendWelcomeEmail(user.email, user.name);

// For password reset
await sendPasswordResetEmail(user.email, resetToken, user.name);
```

### In Admin Controller
```javascript
const { sendOrderStatusEmail } = require('../utils/mailService');

// After updating order status
await sendOrderStatusEmail(order.customerEmail, order, newStatus);
```

## Email Template Styling

All emails use:
- Dark theme (#111111 background)
- Brand red (#d32f2f) accents
- Poppins font family
- Responsive design
- Professional formatting

## Files Created/Modified

### Backend
- ✅ Created: `/Server/utils/mailService.js`
- ✅ Created: `/Server/Routes/emailRoutes.js`
- ✅ Created: `/Server/NODEMAILER_SETUP.md`
- ✅ Modified: `/Server/package.json`
- ✅ Modified: `/Server/app.js`

### Frontend
- ✅ Modified: `/App/src/Components/Contact/Contact.jsx`
- ✅ Modified: `/App/src/Components/Contact/Contact.css`
- ✅ Created: `/App/CONTACT_FORM_INTEGRATION.md`

## Troubleshooting

### Email Not Sending
1. Check backend `.env` has correct credentials
2. Verify Gmail app password (not regular password)
3. Check backend logs for errors
4. Ensure 2FA is enabled on Gmail account

### Contact Form Not Working
1. Check browser console for errors
2. Verify backend is running
3. Check network tab for API response
4. Verify CORS configuration

### Email Not Received
1. Check spam/junk folder
2. Verify recipient email is correct
3. Check backend email service logs
4. Test with different email address

## Next Steps

1. ✅ Backend: Run `npm install` and configure `.env`
2. ✅ Frontend: Contact form ready to use
3. 📋 Test contact form submission
4. 📋 Integrate with order/auth controllers
5. 📋 Deploy to production

## Support

For detailed setup instructions, see:
- Backend: `/Server/NODEMAILER_SETUP.md`
- Frontend: `/App/CONTACT_FORM_INTEGRATION.md`
