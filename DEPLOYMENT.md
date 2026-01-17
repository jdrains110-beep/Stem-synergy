# Stem Synergy - Deployment & Setup Guide

## 🚀 Production Deployment

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account (Free tier available at supabase.com)
- Anthropic API key (Claude Vision)
- Vercel account for hosting
- Git repository

### Step 1: Database Setup (Supabase)

1. Create a Supabase project at https://supabase.com
2. Create the following tables in SQL Editor:

```sql
-- Blueprints table
CREATE TABLE blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  rooms INTEGER,
  square_feet INTEGER,
  style TEXT,
  svg_data TEXT,
  source TEXT, -- 'description' or 'image'
  user_id UUID REFERENCES auth.users(id),
  shared BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Blueprint Collaborations table
CREATE TABLE blueprint_collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id UUID REFERENCES blueprints(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('owner', 'editor', 'viewer')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blueprint_collaborations ENABLE ROW LEVEL SECURITY;
```

3. Set up authentication in Supabase:
   - Go to Authentication > Providers
   - Enable Email/Password
   - Set up OAuth if needed (Google, GitHub, etc.)

### Step 2: Environment Variables

Create `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Step 3: Local Testing

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

### Step 4: Deploy to Vercel

#### Option A: GitHub Integration (Recommended)

1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Add environment variables in Settings
5. Deploy (Vercel auto-deploys on push)

#### Option B: CLI Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel deploy --prod
```

### Step 5: Post-Deployment

1. **Test all features:**
   - Blueprint generation
   - PDF export
   - 3D visualization
   - Real estate data

2. **Monitor performance:**
   - Check Vercel Analytics
   - Monitor Supabase usage
   - Track API response times

3. **Set up logging:**
   - Enable Sentry for error tracking (optional)
   - Set up monitoring alerts

4. **Security:**
   - Enable HTTPS (automatic with Vercel)
   - Set CORS headers if needed
   - Review Supabase RLS policies

## 🔑 API Key Setup

### Claude Vision (Anthropic)

1. Go to https://console.anthropic.com
2. Create an API key
3. Set monthly budget limits
4. Add to environment variables

### Supabase

1. Project Settings > API
2. Copy `SUPABASE_URL`
3. Copy `anon` key
4. Add to environment variables

## 📊 Database Scaling

For production, consider:

1. **Connection Pooling:**
   - Use Supabase Pooling (pgBouncer)
   - Set in Project Settings > Database

2. **Backups:**
   - Enable automatic daily backups
   - Set retention period

3. **Replication:**
   - Enable read replicas for global distribution

## ✅ Pre-Launch Checklist

- [ ] All environment variables configured
- [ ] Database tables created and tested
- [ ] Authentication working
- [ ] Blueprint generation tested
- [ ] PDF export working
- [ ] 3D visualization renders
- [ ] Real estate data displays
- [ ] Collaboration features functional
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security audit complete
- [ ] Error handling tested
- [ ] Monitoring setup
- [ ] Domain configured (if custom)
- [ ] SSL certificate installed

## 🧪 Testing in Production

```bash
# Run E2E tests against production
PLAYWRIGHT_TEST_BASE_URL=https://your-domain.com pnpm test:e2e

# Run load tests
pnpm test:load
```

## 📈 Monitoring & Maintenance

### Key Metrics to Monitor

1. **Performance:**
   - Page load time < 2s
   - API response time < 500ms
   - 3D rendering performance

2. **Reliability:**
   - Uptime > 99.9%
   - Error rate < 0.1%
   - Database connection status

3. **Usage:**
   - Blueprints generated/day
   - Active users
   - Storage usage

### Alerts to Set Up

```
- High error rate (>1%)
- API response time > 1s
- Database connection failures
- Supabase quota exceeded
- Vercel deployment failures
```

## 🔄 Continuous Integration/Deployment

### GitHub Actions Workflow

The project includes GitHub Actions for:
- Running tests on PR
- Building on merge
- Deploying to production
- Performance monitoring

## 🆘 Troubleshooting

### Common Issues

1. **Supabase Connection Fails**
   ```
   - Verify API keys are correct
   - Check Supabase project is active
   - Verify CORS settings
   ```

2. **Claude Vision API Errors**
   ```
   - Check API key is valid
   - Verify monthly quota not exceeded
   - Check image format is supported
   ```

3. **3D Rendering Issues**
   ```
   - Verify WebGL is supported
   - Check Three.js version compatibility
   - Test with simpler models first
   ```

## 📚 Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Docs](https://supabase.com/docs)
- [Anthropic API Docs](https://docs.anthropic.com)
- [Vercel Docs](https://vercel.com/docs)

## 📞 Support

For issues:
1. Check the GitHub Issues page
2. Review deployment logs
3. Contact support teams
