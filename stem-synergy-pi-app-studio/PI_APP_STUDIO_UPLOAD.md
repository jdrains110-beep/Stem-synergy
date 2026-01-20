# Pi App Studio Upload Instructions

- **Last Updated**: 1/20/2026

## App Information for Pi App Studio

### Basic Information
- **App Name**: Stem Synergy
- **App URL**: `https://stemsynergy1368.pinet.com`
- **App Description**: 
  ```
  Stem Synergy is an AI-powered platform that generates comprehensive corporate STEM blueprints using 3D visualizations and advanced analytics. Transform your organization's STEM initiatives with data-driven insights from 677 companies.
  ```

### Technical Configuration
- **Framework**: Next.js 16.1.3
- **Pi SDK Version**: 2.0
- **Sandbox Mode**: No (Production)

### Domain Validation
- **Validation Key URL**: `https://stemsynergy1368.pinet.com/validation-key.txt`
- **Validation Key**: 
  ```
  18753f1ee789c85d80b288876d8504a8d61335b46f3c44e402bf088180554eb1df10f229114d37c131556d91f94b0b180f92e392dc9d242fa85f30920175fcf1
  ```
- **Status**: ✅ Validated
- **Pi Subdomain**: stemsynergy1368.pinet.com

### API Configuration
- **Pi API Key**: `f3eqqvo6a8iwcpe3bactyauoslzvsjkeudefmoqy7i48whlkcyjviodvbixttvyy`
- **API Key Location**: Configured in Vercel environment variables (Production, Preview, Development)

### Permissions Required
1. **Username** (Required)
   - Reason: "To personalize your experience and save your blueprints"
   
2. **Payments** (Required)
   - Reason: "To enable premium features and blueprint generation credits"

### API Endpoints
- **Login**: `/api/login` - Handles Pi Network authentication
- **Payment Approval**: `/api/pi/payments/approve` - Server-side payment approval
- **Payment Completion**: `/api/pi/payments/complete` - Server-side payment completion
- **Health Check**: `/api/health` - Service health monitoring

### Features
- ✨ AI-powered STEM blueprint generation
- 🎨 3D interactive visualizations with Three.js
- 📊 Corporate data analysis from 677 companies
- 🖼️ Image-to-blueprint conversion
- 💳 Credit-based premium features via Pi payments

### App Category
**Education** / Technology

### App Version
1.0.0

---

## Upload Steps for Pi App Studio

### Step 1: Create New App
1. Go to [Pi Developer Portal](https://developers.minepi.com)
2. Click "Create New App"
3. Select "Web App"

### Step 2: Fill Basic Information
- **App Name**: Stem Synergy
- **App URL**: https://stemsynergy1368.pinet.com
- **Category**: Education
- **Description**: Copy from above

### Step 3: Domain Validation
- Paste validation key URL: `https://stemsynergy1368.pinet.com/validation-key.txt`
- Wait for validation (already completed - should be instant)

### Step 4: Configure Permissions
- Enable "username" scope
- Enable "payments" scope
- Add reasons as listed above

### Step 5: Add API Key
- Your Pi API Key is already configured in Vercel
- Use key: `f3eqqvo6a8iwcpe3bactyauoslzvsjkeudefmoqy7i48whlkcyjviodvbixttvyy`

### Step 6: Test the App
1. Open Pi Browser
2. Navigate to: `stemsynergy1368.pinet.com`
3. Authenticate with Pi Network
4. Test payment flow

### Step 7: Submit for Review
- Ensure all endpoints are working
- Test payment flow end-to-end
- Submit app for Pi Network review

---

## JSON Configuration (for API upload if needed)

The complete app configuration is available in `pi-app-studio.json` in the project root.

You can use this JSON if Pi App Studio supports programmatic uploads via API.

---

## Important URLs

| Purpose | URL |
|---------|-----|
| **Production App** | https://stemsynergy1368.pinet.com |
| **Vercel Admin** | https://vercel.com/jeremiah-drains-projects/stem-synergy |
| **GitHub Repo** | https://github.com/jdrains110-beep/Stem-synergy |
| **Validation Key** | https://stemsynergy1368.pinet.com/validation-key.txt |
| **Health Check** | https://stemsynergy1368.pinet.com/api/health |

---

## Troubleshooting

### If validation fails:
- Check that validation key URL is accessible publicly
- Ensure no Vercel deployment protection is enabled
- Verify domain resolves correctly

### If authentication fails:
- Verify `/api/login` endpoint is working
- Check PI_API_KEY is set in Vercel environment variables
- Test Pi SDK initialization in browser console

### If payments fail:
- Verify both approval and completion endpoints are accessible
- Check PI_API_KEY has payment permissions
- Review payment callbacks in browser console

---

## Support

For issues, contact the developer:
- **GitHub**: [@jdrains110-beep](https://github.com/jdrains110-beep)
- **Repository Issues**: [Submit Issue](https://github.com/jdrains110-beep/Stem-synergy/issues)
