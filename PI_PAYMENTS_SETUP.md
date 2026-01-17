# Pi Network Payments Setup Guide

## Overview
Stem Synergy now supports Pi cryptocurrency payments for premium features. This guide walks through the complete setup process.

## ✅ What's Already Done

1. **Domain Validated**: `stemsynergy1368.pinet.com` assigned ✅
2. **Pi SDK Integration**: Authentication and payment framework ✅
3. **Backend API Endpoints**: `/api/pi/payments/approve` and `/api/pi/payments/complete` ✅
4. **Payment Component**: `<PiPaymentButton>` ready to use ✅

## 🔑 Required: Get Your Pi API Key

### Step 1: Access Pi Developer Portal
- Open **Pi Browser** on your phone
- Navigate to: `develop.pi` or `develop.pinet.com`
- Select your **Stem Synergy** app

### Step 2: Copy API Key
1. Scroll down to **"API Keys"** section
2. You'll see your **Server API Key**
3. **Copy the entire key** (starts with a long string)
4. ⚠️ **IMPORTANT**: Never share this key publicly!

### Step 3: Add to Vercel
1. Go to: https://vercel.com/jeremiah-drains-projects/stem-synergy/settings/environment-variables
2. Click **"Add New"**
3. Set:
   - **Name**: `PI_API_KEY`
   - **Value**: Paste your API key
   - **Environment**: Select all (Production, Preview, Development)
4. Click **"Save"**

### Step 4: Redeploy
After adding the key, trigger a new deployment:
- Go to: https://vercel.com/jeremiah-drains-projects/stem-synergy
- Click **"Redeploy"** on latest deployment
- OR push a new commit to GitHub

## 📱 Testing Payments

### Test in Pi Browser (Recommended)
1. Open your app in Pi Browser: `stemsynergy1368.pinet.com`
2. Navigate to a page with payment button
3. Click payment button
4. Pi Wallet will open with payment details
5. Approve the payment
6. Check console logs for confirmation

### Local Testing (Optional)
For local development, add to `.env.local`:
```bash
PI_API_KEY=your_api_key_here
```

## 💰 How Payments Work

### Payment Flow
```
User clicks "Pay with Pi"
        ↓
Frontend: Pi.createPayment() → Opens Pi Wallet
        ↓
User approves in Pi Wallet → Creates paymentId
        ↓
Frontend: onReadyForServerApproval → Calls your backend
        ↓
Backend: /api/pi/payments/approve → Approves with Pi servers
        ↓
Pi Network: Submits blockchain transaction → Returns txid
        ↓
Frontend: onReadyForServerCompletion → Calls your backend
        ↓
Backend: /api/pi/payments/complete → Completes with Pi servers
        ↓
Your App: Grant user access/credits/features ✅
```

### Payment States
- **Created**: Payment ID generated, waiting for approval
- **Approved**: Backend approved, blockchain transaction submitted
- **Completed**: Transaction confirmed, user granted access

## 🛠️ Using the Payment Component

### Basic Usage
```tsx
import { PiPaymentButton } from '@/components/pi-payment-button';

export function PremiumFeature() {
  return (
    <PiPaymentButton
      amount={5}
      memo="Premium Blueprint Pack"
      metadata={{
        product: 'premium_blueprints',
        quantity: 10,
      }}
      onSuccess={(paymentId, txid) => {
        // Handle successful payment
        console.log('Payment successful!', { paymentId, txid });
        // Redirect, update UI, grant access, etc.
      }}
      buttonText="Purchase for 5 π"
    />
  );
}
```

### Example Use Cases

#### 1. Premium Blueprints
```tsx
<PiPaymentButton
  amount={5}
  memo="10 Premium Blueprints"
  metadata={{ product: 'blueprints', quantity: 10 }}
/>
```

#### 2. Advanced Features
```tsx
<PiPaymentButton
  amount={10}
  memo="Unlock 3D Visualization"
  metadata={{ feature: '3d_visualization' }}
/>
```

#### 3. Credits System
```tsx
<PiPaymentButton
  amount={20}
  memo="100 Generation Credits"
  metadata={{ credits: 100 }}
/>
```

## 📊 Backend Integration

### Update Payment Completion
Edit `/app/api/pi/payments/complete/route.ts` to grant user access:

```typescript
// After payment is completed
const completionData = await completeResponse.json();

// TODO: Grant user access (examples)
// Option 1: Update database
// await db.users.update({ credits: user.credits + amount });

// Option 2: Store payment record
// await db.payments.create({ userId, amount, txid, status: 'completed' });

// Option 3: Unlock features
// await db.userFeatures.unlock({ userId, feature: metadata.feature });

return NextResponse.json({ success: true, paymentId, txid });
```

## 🔍 Monitoring & Debugging

### Check Payment Status
View logs in Vercel dashboard:
1. Go to: https://vercel.com/jeremiah-drains-projects/stem-synergy
2. Click on a deployment
3. View **"Functions"** logs
4. Look for:
   - `✅ Payment approved`
   - `✅ Payment completed`
   - `❌ Payment approval failed` (troubleshoot)

### Common Issues

#### Payment Approval Fails
**Cause**: API key not set or invalid
**Fix**: Double-check `PI_API_KEY` in Vercel environment variables

#### Payment Hangs on Approval
**Cause**: Backend endpoint not responding
**Fix**: Check Vercel function logs for errors

#### "Payment system not configured"
**Cause**: `PI_API_KEY` environment variable missing
**Fix**: Add API key to Vercel, then redeploy

## 📚 Additional Resources

- **Pi Platform Docs**: https://github.com/pi-apps/pi-platform-docs
- **Pi Platform API**: https://github.com/pi-apps/pi-platform-docs/blob/master/platform_API.md
- **Payment Flow Details**: https://github.com/pi-apps/pi-platform-docs/blob/master/payments.md
- **Demo App**: https://github.com/pi-apps/demo

## 🎯 Next Steps

1. ✅ Get PI_API_KEY from Pi Developer Portal
2. ✅ Add to Vercel environment variables
3. ✅ Redeploy application
4. ✅ Test payment flow in Pi Browser
5. ✅ Update backend to grant user access after payment
6. ✅ Add payment UI to your app pages

## 💡 Tips

- **Start with Testnet**: Use Pi Testnet for testing (free Test-Pi)
- **Test Thoroughly**: Test the complete payment flow before going live
- **Handle Errors**: Always handle payment cancellation and errors gracefully
- **Keep Records**: Store payment IDs and txids for audit trail
- **Monitor Usage**: Track payment success rates and user behavior

---

**Need Help?**
- Check Vercel function logs for detailed error messages
- Review Pi Platform documentation
- Test in Pi Browser (not regular browsers)
