# 🚀 GitHub Setup Guide for Stem Synergy

## Step-by-Step Instructions to Create & Push Repository

### Prerequisites
- Git installed on your computer
- GitHub account
- Access to terminal/command line

---

## 📋 STEP 1: Create Repository on GitHub

### Option A: Via GitHub Web Interface (Easiest)

1. **Go to GitHub**: https://github.com/new
2. **Fill in repository details**:
   - Owner: Select `jdrains110-beep`
   - Repository name: `stem-synergy`
   - Description: "AI-powered housing blueprint platform with Claude Vision, 3D visualization, and real estate integration"
   - Visibility: Select "Public"
3. **Initialize repository**:
   - ❌ DO NOT check "Initialize this repository with:"
   - ❌ DO NOT add README, .gitignore, or license (we have them)
4. **Click "Create repository"**

### Option B: Via GitHub CLI

```bash
# Install GitHub CLI if needed
# See: https://cli.github.com/

# Authenticate
gh auth login

# Create repository
gh repo create stem-synergy \
  --public \
  --description "AI-powered housing blueprint platform with Claude Vision, 3D visualization, and real estate integration"

# This will ask if you want to clone it - select 'Yes'
```

---

## 🔄 STEP 2: Initialize Git & Push Code

Open your terminal and navigate to the project directory:

```bash
cd c:\Users\13865\Downloads\stem-synergy
```

### Initialize Git repository:

```bash
# Initialize Git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: initial commit - stem synergy v1.0.0 production ready"
```

### Add remote and push:

```bash
# Replace jdrains110-beep with your username if different
git remote add origin https://github.com/jdrains110-beep/stem-synergy.git

# Verify remote is correct
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🔐 STEP 3: Configure GitHub Secrets (for CI/CD)

For automated Vercel deployments, add these secrets:

1. **Go to**: GitHub → Settings → Secrets and variables → Actions
2. **Add these secrets**:
   - `VERCEL_TOKEN` - Get from https://vercel.com/account/tokens
   - `VERCEL_ORG_ID` - Get from Vercel dashboard
   - `VERCEL_PROJECT_ID` - Get from Vercel dashboard

### How to get Vercel credentials:
```bash
# Using Vercel CLI
vercel login
vercel link
# This creates .vercel/project.json with org and project IDs
```

---

## 📝 STEP 4: Configure Repository Settings

### Enable Branch Protection (Main)

1. **Go to**: GitHub → Settings → Branches
2. **Add rule for `main` branch**:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date
   - ✅ Require code reviews
   - ✅ Dismiss stale reviews

### Configure GitHub Pages (Optional)

For documentation site:
1. **Go to**: Settings → Pages
2. **Select**: Deploy from a branch
3. **Branch**: main, /docs folder (or root)

---

## 🏷️ STEP 5: Create Release Tags

```bash
# Create first release tag
git tag -a v1.0.0 -m "Production release v1.0.0"

# Push tags to GitHub
git push origin v1.0.0

# Or push all tags
git push origin --tags
```

Then create release on GitHub:
1. **Go to**: Releases → Draft a new release
2. **Tag version**: v1.0.0
3. **Release title**: Stem Synergy v1.0.0
4. **Description**: Copy from CHANGELOG.md
5. **Publish release**

---

## 🔄 STEP 6: Set Up GitHub Workflows

Workflows are already configured in `.github/workflows/`:

### Available workflows:
- **build-test.yml** - Runs on push/PR, builds and tests
- **security.yml** - CodeQL security scanning

View status:
1. **Go to**: GitHub → Actions
2. **Monitor** workflow runs
3. **Fix** any failing checks

---

## ⚙️ STEP 7: Configure GitHub Settings

### General Settings
1. **Go to**: Settings → General
2. **Set default branch**: `main`
3. **Disable**: Merge commits (use Squash merging)

### Discussion Settings (Optional)
1. **Go to**: Settings → Discussions
2. **Enable** for community discussions

### Issue Templates (Optional)
Create `.github/ISSUE_TEMPLATE/` directory with:
- `bug_report.md`
- `feature_request.md`

---

## 🚀 STEP 8: Add GitHub Topics (SEO)

1. **Go to**: Repository → About (gear icon)
2. **Add topics**:
   - `blueprint`
   - `housing-design`
   - `ai-powered`
   - `3d-visualization`
   - `real-estate`
   - `claude-vision`
   - `nextjs`
   - `typescript`

---

## 📊 STEP 9: Monitor Repository

### Track stats:
- **Insights** → View traffic and commits
- **Issues** → Manage bugs and features
- **Pull Requests** → Review code changes
- **Actions** → Monitor CI/CD runs

---

## 🎯 COMPLETE GITHUB SETUP CHECKLIST

- [x] Repository created on GitHub
- [x] Code pushed to main branch
- [x] GitHub Actions workflows configured
- [x] Security scanning enabled
- [x] Branch protection rules set
- [x] GitHub secrets configured
- [x] Topics/tags added
- [x] README visible
- [x] LICENSE configured
- [x] CONTRIBUTING guidelines added
- [x] CODE_OF_CONDUCT added
- [x] First release tagged

---

## 📚 USEFUL GIT COMMANDS

### Regular workflow:
```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git add .
git commit -m "feat: add amazing feature"

# Push branch
git push origin feature/amazing-feature

# Create PR on GitHub, then merge
# Delete local branch after merge
git checkout main
git pull origin main
git branch -d feature/amazing-feature
```

### View changes:
```bash
# View status
git status

# View recent commits
git log --oneline -10

# View diff
git diff

# View branches
git branch -a
```

### Troubleshooting:
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Fix commit message
git commit --amend

# Sync with remote
git pull origin main
```

---

## 🌍 SHARE YOUR REPOSITORY

Once pushed, share with:

1. **GitHub Link**: https://github.com/jdrains110-beep/stem-synergy
2. **README badge**:
   ```markdown
   [![GitHub](https://img.shields.io/badge/GitHub-stem--synergy-blue?logo=github)](https://github.com/jdrains110-beep/stem-synergy)
   ```
3. **Social media**: Tweet, LinkedIn, etc.

---

## 🔧 ADVANCED SETUP (Optional)

### Set up local git hooks:
```bash
# Create .git/hooks/pre-commit
echo "#!/bin/sh
pnpm lint
pnpm type-check
" > .git/hooks/pre-commit

chmod +x .git/hooks/pre-commit
```

### Create PR template:
Create `.github/pull_request_template.md`:
```markdown
## Description
[Describe your changes]

## Related Issues
Closes #[issue number]

## Testing
- [ ] Tested locally
- [ ] Tests pass
- [ ] No console errors

## Types of Changes
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
```

---

## 📞 NEXT STEPS

1. ✅ Create repository using Step 1
2. ✅ Push code using Step 2
3. ✅ Configure secrets using Step 3
4. ✅ Set branch protection using Step 4
5. ✅ Create first release using Step 5
6. ✅ Monitor actions using Step 9
7. ✅ Share with community!

---

**Your Stem Synergy repository is now ready for collaboration and contribution!** 🎉

For questions or issues, check GitHub documentation or ask in Discussions.
