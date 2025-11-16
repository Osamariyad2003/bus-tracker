# ⚡ Quick Deploy to GitHub Pages

## 5-Minute Deployment

### Step 1: Update Repository Name (30 seconds)

Open `vite.config.ts` and change line 9:

```typescript
base: mode === 'production' ? '/YOUR-REPO-NAME/' : '/',
```

Replace `YOUR-REPO-NAME` with your actual GitHub repository name.

Example: If your repo is `bus-tracker`, use:
```typescript
base: mode === 'production' ? '/bus-tracker/' : '/',
```

---

### Step 2: Add GitHub Secrets (2 minutes)

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these three secrets:

**Secret 1:**
- Name: `VITE_SUPABASE_URL`
- Value: Your Supabase project URL (e.g., `https://xxx.supabase.co`)

**Secret 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: Your Supabase anon key

**Secret 3:**
- Name: `VITE_GOOGLE_MAPS_API_KEY`
- Value: Your Google Maps API key

---

### Step 3: Enable Environment Variables in Workflow (30 seconds)

Open `.github/workflows/deploy.yml` and **uncomment** lines 33-37:

Change from:
```yaml
        env:
          # Add your environment variables here
          # VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          # VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          # VITE_GOOGLE_MAPS_API_KEY: ${{ secrets.VITE_GOOGLE_MAPS_API_KEY }}
          NODE_ENV: production
```

To:
```yaml
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          VITE_GOOGLE_MAPS_API_KEY: ${{ secrets.VITE_GOOGLE_MAPS_API_KEY }}
          NODE_ENV: production
```

---

### Step 4: Push to GitHub (1 minute)

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

If your branch is named `master`, use:
```bash
git push origin master
```

---

### Step 5: Enable GitHub Pages (1 minute)

1. Go to **Settings** → **Pages**
2. Under "Build and deployment":
   - **Source**: Deploy from a branch
   - **Branch**: Select `gh-pages`
   - **Folder**: Select `/ (root)`
3. Click **Save**

---

## ✅ Done!

- GitHub Actions will automatically build and deploy
- Wait 2-3 minutes for the first deployment
- Your site will be live at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

---

## Check Deployment Status

1. Go to **Actions** tab in your repository
2. Watch the "Deploy to GitHub Pages" workflow
3. Green checkmark = Success! 🎉
4. Red X = Check the logs for errors

---

## Troubleshooting

### Build Failed?

**Check these:**
1. Did you add all 3 secrets correctly?
2. Is the repo name in `vite.config.ts` correct?
3. Did you uncomment the env variables in the workflow?

**View Logs:**
- Click the failed workflow in the Actions tab
- Expand the failed step to see the error

### Site Not Loading?

**Wait:** First deployment can take 5-10 minutes

**Check:**
1. Is the `gh-pages` branch created?
2. Is GitHub Pages enabled in Settings?
3. Try clearing browser cache

### Wrong Base Path?

If your site loads but links don't work:
1. Double-check the `base` path in `vite.config.ts`
2. Make sure it matches your repository name exactly
3. Include the leading and trailing slashes: `'/repo-name/'`

---

## Manual Deploy (Alternative)

If you prefer to deploy manually:

```bash
# Install gh-pages
npm install -g gh-pages

# Build and deploy
npm run deploy
```

---

## Next Steps

After successful deployment:

1. ✅ Test the live site
2. ✅ Try logging in
3. ✅ Check if maps load
4. ✅ Verify bus data displays
5. ✅ Share the link!

---

**🚀 Your Bus Tracker is now live!**

Visit: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

