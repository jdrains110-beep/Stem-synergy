# VERCEL ENVIRONMENT VARIABLES QUICK REFERENCE

Copy these to Vercel Dashboard → Project Settings → Environment Variables

## Required: NONE
All environment variables are optional. The app will run without any configuration.

## Optional Variables

### 1. Supabase Database (for data persistence)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
**Get from:** https://supabase.com/dashboard/project/_/settings/api

### 2. Anthropic Claude API (for AI blueprint generation)
```
ANTHROPIC_API_KEY=
```
**Get from:** https://console.anthropic.com/settings/keys

### 3. Feature Flags (already enabled by default)
```
NEXT_PUBLIC_ENABLE_3D_VISUALIZATION=true
NEXT_PUBLIC_ENABLE_COLLABORATION=true
NEXT_PUBLIC_ENABLE_REAL_ESTATE_DATA=true
NEXT_PUBLIC_ENABLE_PDF_EXPORT=true
```

### 4. App Configuration
```
NEXT_PUBLIC_APP_NAME=Stem Synergy
NEXT_PUBLIC_APP_URL=https://stemsynergyaaffb7467.pinet.com
```

## How to Add in Vercel

1. Go to your project on Vercel
2. Click **Settings** → **Environment Variables**
3. For each variable:
   - **Key:** Variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value:** Your actual value
   - **Environment:** Check all (Production, Preview, Development)
4. Click **Save**
5. Redeploy if already deployed

## Validation Key

**No configuration needed!** The validation key is built into the app:
- Static file: `/validation-key.txt`
- API endpoint: `/api/validation-key`
- Value: `18753f1ee789c85d80b288876d8504a8d61335b46f3c44e402bf088180554eb1df10f229114d37c131556d91f94b0b180f92e392dc9d242fa85f30920175fcf1`

## Deployment Checklist

- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Add environment variables (optional)
- [ ] Deploy
- [ ] Add custom domain: stemsynergyaaffb7467.pinet.com
- [ ] Test validation key endpoint
- [ ] Verify app is working
