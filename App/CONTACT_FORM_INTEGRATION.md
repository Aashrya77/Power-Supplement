# Contact Form Nodemailer Integration

## Overview
The Contact form has been integrated with the Nodemailer backend to send contact messages via email.

## Changes Made

### Frontend Updates

#### `/App/src/Components/Contact/Contact.jsx`
- **Added state management:**
  - `loading` - Tracks form submission state
  - `submitStatus` - Displays success/error messages

- **Updated `handleSubmit` function:**
  - Sends form data to backend API endpoint
  - Creates formatted HTML email content
  - Handles success and error responses
  - Auto-clears success message after 5 seconds
  - Disables form inputs during submission

- **Form enhancements:**
  - Status message display (success/error)
  - Disabled state for inputs while loading
  - Dynamic button text ("Sending..." vs "Send Message")
  - Form reset after successful submission

#### `/App/src/Components/Contact/Contact.css`
- **Added new styles:**
  - `.submit-status` - Status message container with animation
  - `.submit-status.success` - Green success styling
  - `.submit-status.error` - Red error styling
  - `.submit-btn:disabled` - Disabled button styling
  - `.form-group input:disabled` - Disabled input styling
  - `@keyframes slideIn` - Smooth status message animation

## How It Works

1. **User fills out the contact form** with name, email, subject, and message
2. **User clicks "Send Message"** button
3. **Form data is sent to backend** via POST request to `/api/v1/email/send`
4. **Backend sends email** to `support@powersupplement.com` with formatted HTML content
5. **User sees success/error message** with appropriate styling
6. **Form is reset** on successful submission

## API Endpoint Used

```
POST https://powersupplement.net/api/v1/email/send
Content-Type: application/json

{
  "to": "support@powersupplement.com",
  "subject": "Contact Form: [subject] - From [name]",
  "html": "<formatted HTML email content>"
}
```

## Email Format

The contact form email includes:
- Sender's name
- Sender's email address
- Subject category
- Full message with formatting

Example email structure:
```
New Contact Form Submission

Name: John Doe
Email: john@example.com
Subject: Product Inquiry
Message: [User's message here]
```

## Features

### User Experience
- ✅ Real-time form validation
- ✅ Loading state feedback
- ✅ Success/error notifications
- ✅ Auto-clearing success messages
- ✅ Disabled inputs during submission
- ✅ Smooth animations

### Error Handling
- ✅ Network error handling
- ✅ API error handling
- ✅ User-friendly error messages
- ✅ Fallback contact information

### Styling
- ✅ Dark theme matching site design
- ✅ Responsive design
- ✅ Smooth transitions
- ✅ Color-coded status messages (green for success, red for error)

## Testing

### Test the Contact Form

1. Navigate to the Contact page
2. Fill out the form with test data:
   - Name: "Test User"
   - Email: "test@example.com"
   - Subject: "Product Inquiry"
   - Message: "This is a test message"
3. Click "Send Message"
4. You should see a success message
5. Check `support@powersupplement.com` for the email

### Expected Behavior

**On Success:**
- Green success message appears
- Form fields are cleared
- Message auto-dismisses after 5 seconds

**On Error:**
- Red error message appears
- Form data is preserved
- User can retry submission

## Environment Configuration

The contact form uses the production backend URL:
```
https://powersupplement.net/api/v1/email/send
```

For local development, update the URL in `Contact.jsx`:
```javascript
const response = await fetch('http://localhost:5500/api/v1/email/send', {
  // ... rest of config
});
```

## Backend Requirements

Ensure the backend has:
1. ✅ Nodemailer installed (`npm install nodemailer`)
2. ✅ Email service configured in `.env`
3. ✅ Email routes registered in `app.js`
4. ✅ CORS configured to allow frontend origin

## Files Modified

- **Modified**: `/App/src/Components/Contact/Contact.jsx` - Added email submission logic
- **Modified**: `/App/src/Components/Contact/Contact.css` - Added status message styles

## Troubleshooting

### "Failed to send message" Error
1. Check backend is running
2. Verify email service is configured in backend `.env`
3. Check browser console for network errors
4. Verify CORS configuration allows frontend origin

### Email Not Received
1. Check spam/junk folder
2. Verify `support@powersupplement.com` is correct
3. Check backend logs for email service errors
4. Verify email credentials in backend `.env`

### Form Not Submitting
1. Check browser console for JavaScript errors
2. Verify all form fields are filled
3. Check network tab for API response
4. Verify backend API endpoint is accessible

## Future Enhancements

- Add email validation on frontend
- Add rate limiting to prevent spam
- Add file attachment support
- Add auto-reply email to user
- Add admin notification emails
- Add form submission logging to database
- Add reCAPTCHA verification
