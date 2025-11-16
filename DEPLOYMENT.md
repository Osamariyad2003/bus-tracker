# 🚀 Deployment Guide - Bus Tracker

## GitHub Pages Deployment

### Prerequisites

1. **GitHub Account** and repository
2. **Node.js** and **pnpm** (or npm) installed
3. **Supabase Project** set up with database
4. **Google Maps API Key**

---

## Quick Deploy (Automatic)

### Method 1: Using GitHub Actions (Recommended)

This will automatically deploy on every push to main/master branch.

#### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source**: Deploy from a branch
   - **Branch**: `gh-pages` → `/ (root)`
4. Click **Save**

#### Step 2: Add Environment Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these secrets:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

#### Step 3: Update Base Path

In `vite.config.ts`, line 9, update with your repository name:

```typescript
base: mode === 'production' ? '/YOUR-REPO-NAME/' : '/',
```

Example: If your repo is `https://github.com/username/bus-tracker`, use:
```typescript
base: mode === 'production' ? '/bus-tracker/' : '/',
```

#### Step 4: Uncomment Environment Variables

In `.github/workflows/deploy.yml`, uncomment lines 33-35:

```yaml
env:
  VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
  VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
  VITE_GOOGLE_MAPS_API_KEY: ${{ secrets.VITE_GOOGLE_MAPS_API_KEY }}
  NODE_ENV: production
```

#### Step 5: Push to GitHub

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

✅ **Done!** GitHub Actions will automatically build and deploy.

Your site will be live at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

---

### Method 2: Manual Deploy

#### Step 1: Install gh-pages

```bash
npm install -g gh-pages
# or
pnpm add -D gh-pages
```

#### Step 2: Update Base Path

In `vite.config.ts`, update line 9 with your repo name:
```typescript
base: mode === 'production' ? '/YOUR-REPO-NAME/' : '/',
```

#### Step 3: Create .env.production

Create a file `.env.production` in the root:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

#### Step 4: Deploy

**Windows (PowerShell):**
```powershell
npm run deploy
```

**Mac/Linux:**
```bash
./deploy.sh
# or
npm run deploy
```

✅ **Done!** Your site is deployed.

---

## Configuration Checklist

### ✅ Before Deployment

- [ ] Update `base` path in `vite.config.ts`
- [ ] Add environment variables (secrets or .env.production)
- [ ] Test build locally: `npm run build:gh-pages`
- [ ] Verify Supabase RLS policies are configured
- [ ] Check Google Maps API key has proper restrictions
- [ ] Enable GitHub Pages in repository settings

### ✅ After Deployment

- [ ] Visit your GitHub Pages URL
- [ ] Test login/signup functionality
- [ ] Verify map loads correctly
- [ ] Check all bus data displays
- [ ] Test on mobile devices
- [ ] Monitor Supabase usage

---

## Environment Variables

### Required Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGci...` |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key | `AIzaSy...` |

### Where to Get:

**Supabase:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy **Project URL** and **anon/public key**

**Google Maps:**
1. Go to https://console.cloud.google.com/
2. Enable Maps JavaScript API
3. Create credentials (API key)
4. Restrict key to your domain

---

## Troubleshooting

### Issue: 404 Error on Refresh

**Solution:** Add `404.html` (already created)

The SPA router needs a 404.html that redirects to index.html.

### Issue: Blank Page

**Causes:**
1. Wrong `base` path in vite.config.ts
2. Missing environment variables
3. Build errors

**Solutions:**
- Check browser console for errors
- Verify `base` matches your repo name
- Check GitHub Actions logs
- Test local build: `npm run build:gh-pages`

### Issue: Map Not Loading

**Causes:**
- Google Maps API key missing/invalid
- API key restrictions too strict

**Solutions:**
- Verify API key in browser console
- Check API key restrictions in Google Cloud Console
- Ensure Maps JavaScript API is enabled

### Issue: Supabase Errors

**Causes:**
- Wrong Supabase URL/key
- RLS policies blocking access

**Solutions:**
- Verify Supabase credentials
- Check RLS policies in Supabase dashboard
- Enable anonymous access if needed

---

## Custom Domain (Optional)

### Step 1: Add CNAME File

Create `public/CNAME` with your domain:
```
yourdomain.com
```

### Step 2: Configure DNS

Add these DNS records:

**For apex domain (yourdomain.com):**
```
A     @     185.199.108.153
A     @     185.199.109.153
A     @     185.199.110.153
A     @     185.199.111.153
```

**For subdomain (www.yourdomain.com):**
```
CNAME www   YOUR-USERNAME.github.io
```

### Step 3: Update vite.config.ts

```typescript
base: mode === 'production' ? '/' : '/',
```

### Step 4: Enable in GitHub

1. Go to **Settings** → **Pages**
2. Enter your custom domain
3. Click **Save**
4. Wait for DNS check to complete
5. Enable **Enforce HTTPS**

---

## Backend Deployment (Optional)

### Option 1: Serverless (Vercel/Netlify)

Deploy the Express backend separately:

1. Create separate repo for backend
2. Deploy to Vercel/Netlify
3. Update frontend API URLs

### Option 2: Traditional Hosting

Deploy to:
- **Heroku**
- **Railway**
- **DigitalOcean**
- **AWS**

Since this app uses Supabase, you might not need a separate backend!

---

## Production Checklist

### Security:
- [ ] Environment variables secured
- [ ] Supabase RLS policies configured
- [ ] API keys restricted to domains
- [ ] HTTPS enabled
- [ ] Authentication working

### Performance:
- [ ] Images optimized
- [ ] Code splitting enabled
- [ ] Gzip compression
- [ ] CDN configured (GitHub Pages has this)

### Monitoring:
- [ ] Error tracking setup (optional)
- [ ] Analytics added (optional)
- [ ] Uptime monitoring

---

## Useful Commands

```bash
# Local development
npm run dev

# Build for production
npm run build:gh-pages

# Deploy to GitHub Pages
npm run deploy

# Test production build locally
npm run build:gh-pages && npx serve dist

# Check TypeScript
npm run typecheck
```

---

## Support

### If deployment fails:

1. **Check GitHub Actions logs:**
   - Go to **Actions** tab in your repository
   - Click on the latest workflow run
   - Check for errors

2. **Test locally:**
   ```bash
   npm run build:gh-pages
   # Should create dist/ folder without errors
   ```

3. **Verify files:**
   - Check `dist/index.html` exists
   - Check `dist/assets/` has files

4. **GitHub Pages Status:**
   - Sometimes takes 5-10 minutes to go live
   - Check **Settings** → **Pages** for status

---

## URLs

- **Development:** http://localhost:8080
- **GitHub Pages:** https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
- **Custom Domain:** https://yourdomain.com (if configured)

---

## Next Steps

After deploying:

1. ✅ Share the link with users
2. ✅ Set up custom domain (optional)
3. ✅ Monitor Supabase usage
4. ✅ Add real GPS devices
5. ✅ Train administrators
6. ✅ Gather feedback

---

**🎉 Your Bus Tracker is now live on GitHub Pages!**

For questions or issues, check the GitHub repository issues page.

