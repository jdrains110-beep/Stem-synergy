# Stem Synergy - Pi Network App

AI-powered STEM blueprint generator with 3D visualizations.

## Quick Setup

### After Uploading to Pi App Studio:

1. **Visit `/setup` page** - The app will automatically redirect here if PI_API_KEY is not configured
2. **Follow setup instructions** - Add PI_API_KEY environment variable
3. **Redeploy** - Trigger new deployment
4. **Launch app** - Visit `/setup` again to verify, then launch

### Manual Setup

1. **Install**: `npm install`
2. **Configure**: Set `PI_API_KEY` in environment variables (not .env.local for production)
3. **Run**: `npm run dev`
4. **Build**: `npm run build`

## Environment Variable (REQUIRED)

```env
PI_API_KEY=f3eqqvo6a8iwcpe3bactyauoslzvsjkeudefmoqy7i48whlkcyjviodvbixttvyy
```

**CRITICAL**: App will not work without this environment variable set in Pi App Studio.

## Pi Network Integration

- Authentication via Pi SDK 2.0
- Payment processing for premium features
- Domain: stemsynergy1368.pinet.com

## Features

- Pi Network login & payments
- AI blueprint generation
- 3D visualizations
- 677 corporate STEM data points

## Troubleshooting

- **"Server error. Please ensure PI_API_KEY is configured"** → Visit `/setup` page for instructions
- **Authentication fails** → Check PI_API_KEY in environment variables
- **"Request failed"** → Visit `/diagnostics` to check configuration

## Tech

Next.js 16 • React 19 • TypeScript • Tailwind • Three.js

See [pi-app-studio.json](pi-app-studio.json) for complete app details.

