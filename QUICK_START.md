# ⚡ Stem Synergy - Quick Start Guide

Get your AI blueprint platform running in **5 minutes**!

## 🚀 Step 1: Clone & Install (1 min)

```bash
# Clone the repository
git clone https://github.com/yourusername/stem-synergy.git
cd stem-synergy

# Install dependencies
pnpm install
```

## 🔑 Step 2: Configure Environment (2 min)

Create `.env.local` and add these keys:

```bash
# 1. Supabase (https://supabase.com)
# Create free account → Get your keys from Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# 2. Claude Vision API (https://console.anthropic.com)
# Get your API key from Account Settings
ANTHROPIC_API_KEY=sk-ant-your_key_here
```

## 💻 Step 3: Run Development Server (1 min)

```bash
pnpm dev
```

Open http://localhost:3000 in your browser!

## 🧪 Step 4: Test Features (1 min)

### Try Blueprint Generation
1. Click **"Blueprint Generator"** in sidebar
2. Enter project name: `"My Dream Home"`
3. Paste description: `"4-bedroom, 2-bath modern home with open kitchen"`
4. Click **"Generate Blueprint"**
5. See your blueprint instantly!

### Try 3D Visualization
- After generation, scroll down to see **3D Floor Plan**
- Click **"Top View"** to switch perspectives
- Rooms are color-coded!

### Try Export
- Click **"Save to Gallery"**
- Click on saved blueprint
- Download as **SVG**, **PNG**, or **PDF**

## 🌍 Step 5: Deploy (Optional)

### Deploy to Vercel (Easiest)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod
```

### Or use GitHub + Vercel
1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Add environment variables
5. Deploy!

---

## 📸 Feature Overview

### ✨ Text-to-Blueprint
```
Input: "5-bedroom luxury home with pool"
Output: Professional floor plan + 3D visualization
```

### 📷 Image-to-Blueprint  
```
Input: Sketch or inspiration image
Output: Analyzed layout + generated blueprint
```

### 💰 Real Estate Data
```
Shows: Market comparables, pricing, trends
```

### 👥 Collaboration
```
Share blueprints → Invite team → Comment & edit
```

---

## 🎮 API Examples

### Generate Blueprint (cURL)
```bash
curl -X POST http://localhost:3000/api/blueprints/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "description",
    "name": "Modern Home",
    "description": "4-bedroom modern home with open kitchen"
  }'
```

### Response
```json
{
  "id": "bp_123...",
  "name": "Modern Home",
  "rooms": 4,
  "squareFeet": 2800,
  "style": "Modern",
  "svgData": "...",
  "createdAt": "2026-01-16T..."
}
```

---

## 🧪 Run Tests

```bash
# Run all E2E tests
pnpm test

# Run tests in UI mode
pnpm test:ui

# Debug mode
pnpm test:debug
```

---

## 📊 Project Structure

```
stem-synergy/
├── components/          # React components
│   ├── blueprint-generator.tsx
│   ├── blueprint-gallery.tsx
│   ├── blueprint-viewer-3d.tsx
│   └── blueprint-collaboration.tsx
├── app/
│   ├── page.tsx        # Main dashboard
│   ├── api/            # API routes
│   │   └── blueprints/
│   │       ├── generate/
│   │       └── generate-from-image/
│   └── layout.tsx
├── lib/                # Utilities
│   ├── supabase-client.ts
│   ├── claude-vision.ts
│   ├── pdf-export.ts
│   └── real-estate-data.ts
└── tests/              # E2E tests
    └── blueprint.spec.ts
```

---

## ⚙️ Configuration

### Enable/Disable Features

Edit `.env.local`:

```env
# 3D Visualization
NEXT_PUBLIC_ENABLE_3D_VISUALIZATION=true

# Collaboration
NEXT_PUBLIC_ENABLE_COLLABORATION=true

# Real Estate Data
NEXT_PUBLIC_ENABLE_REAL_ESTATE_DATA=true

# PDF Export
NEXT_PUBLIC_ENABLE_PDF_EXPORT=true
```

---

## 🆘 Troubleshooting

### Port 3000 Already in Use
```bash
# Use different port
pnpm dev -- -p 3001
```

### Supabase Connection Error
```bash
# Check credentials in .env.local
# Verify Supabase project is active
# Test: curl $NEXT_PUBLIC_SUPABASE_URL
```

### Claude Vision API Error
```bash
# Verify API key is correct
# Check API key has quota
# Review API docs: https://docs.anthropic.com
```

### Build Fails
```bash
# Clear cache and reinstall
rm -rf .next node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

---

## 📚 Learn More

- **Full Documentation**: See [README_FULL.md](README_FULL.md)
- **Deployment Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Implementation Details**: See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

---

## 🎯 Next Steps

1. ✅ Get API keys configured
2. ✅ Run local development
3. ✅ Test features
4. ✅ Set up Supabase database
5. ✅ Deploy to production

## 📞 Need Help?

- 📖 Check documentation files
- 🐛 Report issues on GitHub
- 💬 Join community Discord
- 📧 Email support@stem-synergy.com

---

**Happy blueprint building! 🏠✨**

*Stem Synergy v1.0.0 - The Future of Architectural Design*
