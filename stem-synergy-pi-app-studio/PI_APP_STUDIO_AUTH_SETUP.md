# Pi App Studio Setup Instructions

## Critical: Environment Variable Configuration

**IMPORTANT**: The authentication will fail if `PI_API_KEY` is not configured.

### Step 1: Set Environment Variable in Pi App Studio

After uploading the app, you MUST configure the environment variable:

1. Go to your app settings in Pi App Studio
2. Navigate to "Environment Variables" or "Configuration"
3. Add the following variable:

```
Name: PI_API_KEY
Value: f3eqqvo6a8iwcpe3bactyauoslzvsjkeudefmoqy7i48whlkcyjviodvbixttvyy
```

### Step 2: Redeploy the App

After adding the environment variable, trigger a new deployment to apply the changes.

## Troubleshooting Authentication Issues

### Issue: "PI_API_KEY not set" error
**Solution**: Ensure PI_API_KEY is configured in Pi App Studio environment variables

### Issue: "Pi object not available" error
**Solution**: Make sure the app is being accessed through Pi Browser, not a regular web browser

### Issue: "Invalid Pi authentication token" error
**Solution**: Check that PI_API_KEY is correct and has proper permissions in Pi Developer Portal

### Issue: Authentication keeps failing
**Solutions**:
1. Check browser console (F12) for detailed error messages
2. Verify PI_API_KEY is set in environment
3. Ensure app URL matches the domain registered in Pi Developer Portal (stemsynergy1368.pinet.com)
4. Try refreshing the page
5. Click "Try Again" button on the loading screen

## Debugging

The app includes console logging for debugging:

- `[Login]` - Backend authentication logs
- `Pi SDK initialized` - SDK initialization success
- `Pi SDK already loaded` - SDK found in Pi App Studio
- `Authenticating with Pi Network...` - User authentication in progress

Open browser console (F12 → Console tab) to see these logs and identify issues.

## Expected Authentication Flow

1. App loads → "Loading Pi Network SDK..."
2. SDK loads or detects existing SDK → "Pi SDK initialized"
3. User prompted for authentication → "Authenticating with Pi Network..."
4. Backend verifies token → "[Login] Pi user verified"
5. Success → App loads with user data

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `PI_API_KEY` | **YES** | Pi Network API key from Developer Portal |
| `ANTHROPIC_API_KEY` | NO | Optional - for AI blueprint features |
| `NEXT_PUBLIC_APP_URL` | NO | Auto-set - app URL |

## Support

If authentication continues to fail after:
- Setting PI_API_KEY
- Redeploying the app
- Accessing via Pi Browser
- Checking console logs

Please verify:
1. PI_API_KEY is valid and active in Pi Developer Portal
2. App domain (stemsynergy1368.pinet.com) is validated
3. No firewall/network blocking Pi Network API calls
