# eSewa Production Setup Guide

## Issue: "Invalid Payload Signature" in Production

### Root Cause
The signature validation fails in production because of environment-specific configuration differences between localhost (test/sandbox) and production environments.

## Required Environment Variables

### For Local Development (Test/Sandbox)
```env
# .env (local)
ESEWA_SECRET_KEY=your_test_secret_key_from_esewa
ESEWA_MERCHANT_CODE=your_test_merchant_code
ESEWA_SUCCESS_URL=http://localhost:5173/payment-success
ESEWA_FAILURE_URL=http://localhost:5173/payment-failed
NODE_ENV=development
```

### For Production
```env
# .env (production)
ESEWA_SECRET_KEY=your_production_secret_key_from_esewa
ESEWA_MERCHANT_CODE=your_production_merchant_code
ESEWA_SUCCESS_URL=https://powersupplement.net/payment-success
ESEWA_FAILURE_URL=https://powersupplement.net/payment-failed
NODE_ENV=production
```

## Important Notes

1. **Different Secret Keys**: eSewa provides different secret keys for test/sandbox and production environments
   - Test/Sandbox secret key: Used for localhost testing
   - Production secret key: Used for live transactions

2. **Product Code**: Ensure your product code (currently 'NP-ES-PS') is registered with eSewa for both environments

3. **URLs**: 
   - Test environment may use: `https://rc-epay.esewa.com.np/api/epay/main/v2/form`
   - Production uses: `https://epay.esewa.com.np/api/epay/main/v2/form`

## Deployment Checklist

### Before Deploying to Production:

1. ✅ Obtain production credentials from eSewa
2. ✅ Set `ESEWA_SECRET_KEY` with production secret key in production environment
3. ✅ Set `ESEWA_MERCHANT_CODE` with production merchant code
4. ✅ Update success/failure URLs to production domain
5. ✅ Verify product code is registered for production
6. ✅ Remove any hardcoded test credentials

### Testing Production Setup:

1. Deploy the updated code without hardcoded fallback keys
2. Check server logs for signature generation details
3. Verify environment variables are loaded correctly
4. Test with a small transaction first

## Troubleshooting

If you still get "Invalid Payload Signature" after setup:

1. **Check Secret Key Format**: Ensure the secret key is correctly copied (no extra spaces or line breaks)

2. **Verify Signature Generation**: The signature must be generated exactly as:
   ```javascript
   const signedFieldString = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=NP-ES-PS`;
   const signature = crypto
     .createHmac("sha256", ESEWA_SECRET_KEY)
     .update(signedFieldString, "utf8")
     .digest("base64");
   ```

3. **Check Server Logs**: Look for:
   - "ESEWA_SECRET_KEY is not configured" error
   - Signature generation details
   - Environment being used

4. **Contact eSewa Support**: If issues persist, verify with eSewa:
   - Your production credentials are active
   - Product code is registered
   - Account is approved for production transactions

## Code Changes Made

1. **Removed hardcoded fallback secret key** - Forces use of environment variable
2. **Added validation** - Checks if ESEWA_SECRET_KEY exists before processing
3. **Added logging** - Helps diagnose signature generation issues
4. **Fixed formUrl** - Removed trailing space that could cause issues

## Security Best Practices

- Never commit secret keys to version control
- Use environment variables for all sensitive data
- Rotate secret keys periodically
- Monitor failed payment attempts
- Log signature mismatches for security auditing
