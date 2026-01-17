# Vercel Deployment Setup Guide

## ✅ Current Status

| Component | Status |
|-----------|--------|
| GitHub Actions CI | ✅ Passing |
| Code Repository | ✅ Up to date |
| Validation Key Files | ✅ In repo |
| Vercel Deployment | ⚠️ Needs Setup |

## 🚀 Vercel Setup Steps

### 1. Connect GitHub Repository to Vercel

1. **Visit Vercel Dashboard**
   - Go to: https://vercel.com/dashboard
   - Sign in with your GitHub account

2. **Import Project**
   - Click **"Add New..."** → **"Project"**
   - Select your GitHub account: `jdrains110-beep`
   - Find and select: **`Stem-synergy`**
   - Click **"Import"**

3. **Configure Project**
   ```
   Framework Preset: Next.js (auto-detected)
   Root Directory: ./
   Build Command: pnpm build
   Install Command: pnpm install
   Output Directory: .next
   Node.js Version: 20.x
   ```

4. **Deploy**
   - Click **"Deploy"**
   - Wait 1-2 minutes for initial deployment

### 2. Configure Custom Domain

After successful deployment:

1. Go to **Project Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter: `stemsynergyaaffb7467.pinet.com`
4. Follow DNS configuration instructions from Vercel
5. Add the required DNS records to your domain provider

### 3. Verify Deployment

Once deployed, test these endpoints:

```powershell
# Health check
Invoke-WebRequest -Uri "https://stemsynergyaaffb7467.pinet.com/api/health" -UseBasicParsing | Select-Object StatusCode, Content

# Validation key (static file)
Invoke-WebRequest -Uri "https://stemsynergyaaffb7467.pinet.com/validation-key.txt" -UseBasicParsing | Select-Object StatusCode, Content

# Validation key (API endpoint)  
Invoke-WebRequest -Uri "https://stemsynergyaaffb7467.pinet.com/api/validation-key" -UseBasicParsing | Select-Object StatusCode, Content
```

Expected results:
- ✅ All should return `StatusCode: 200`
- ✅ Validation key should be: `18753f1ee789c85d80b288876d8504a8d61335b46f3c44e402bf088180554eb1df10f229114d37c131556d91f94b0b180f92e392dc9d242fa85f30920175fcf1`

## 🔧 Environment Variables (Optional)

These are currently optional. Add them in Vercel dashboard if needed:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | No |
| `ANTHROPIC_API_KEY` | Claude Vision API key | No |

To add:
1. Go to **Project Settings** → **Environment Variables**
2. Add each variable with its value
3. Select environment: **Production**, **Preview**, **Development**
4. Click **"Save"**

## 🔄 Automatic Deployments

Once connected, Vercel will automatically deploy:
- ✅ Every push to `main` branch → Production
- ✅ Every pull request → Preview deployment
- ✅ No GitHub Actions configuration needed

## 📝 Important Files in Repository

- `/public/validation-key.txt` - Static validation key file
- `/app/api/validation-key/route.ts` - API endpoint for validation key
- `/app/api/health/route.ts` - Health check endpoint
- `/next.config.mjs` - Headers configuration for validation key
- `/vercel.json` - Vercel project configuration

## ❓ Troubleshooting

### Build Fails on Vercel

Check:
1. Node.js version set to 20.x in Project Settings
2. Install command is `pnpm install`
3. Build command is `pnpm build`
4. Framework preset is Next.js

### Domain Not Working

Check:
1. DNS records are correctly configured
2. SSL certificate has been provisioned (takes ~5 minutes)
3. Domain is added in Vercel project settings

### Validation Key Returns 404

Check:
1. File exists at `/public/validation-key.txt`
2. Latest code is deployed (check deployment logs)
3. Deployment was successful (no build errors)

## 📞 Next Steps

After deployment succeeds:
1. ✅ Test all endpoints
2. ✅ Verify validation key is accessible
3. ✅ Submit validation key URL for domain verification
4. ✅ Configure environment variables if needed

## 🎯 Why Previous Approach Failed

The GitHub Actions workflow tried to use `vercel/action@v5` which doesn't exist. Vercel's recommended approach is to connect the repository directly through their dashboard, which provides:
- Automatic deployments on push
- Preview deployments for PRs
- Better build caching
- Easier domain configuration
- No secret management needed
