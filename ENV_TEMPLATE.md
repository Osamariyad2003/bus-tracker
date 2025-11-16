# Environment Variables Template

Copy this template to create your `.env` file in the project root.

## 📋 Quick Setup

```bash
# Copy this entire block to your .env file

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Supabase Configuration
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Get these from: https://app.supabase.com/project/_/settings/api

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Google Maps Configuration
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Get this from: https://console.cloud.google.com/google/maps-apis/credentials

VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
```

---

## 🔍 How to Get Each Variable

### 1. VITE_SUPABASE_URL

**Steps:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **Settings** → **API**
4. Copy the **Project URL**
5. Paste as: `VITE_SUPABASE_URL=https://xxxxx.supabase.co`

**Example:**
```bash
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
```

---

### 2. VITE_SUPABASE_ANON_KEY

**Steps:**
1. Same location as above (Settings → API)
2. Copy the **anon/public** key (NOT the service_role key!)
3. Paste as: `VITE_SUPABASE_ANON_KEY=eyJhbG...`

**Example:**
```bash
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMjUyNzg2MCwiZXhwIjoxOTI4MTAzODYwfQ.xxxxxxxxxxxxxxxxxxxxx
```

**⚠️ Important:** Use the **anon** key, not the **service_role** key!

---

### 3. VITE_GOOGLE_MAPS_API_KEY

**Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select or create a project
3. Enable **Maps JavaScript API**
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **API Key**
6. Copy the API key
7. Paste as: `VITE_GOOGLE_MAPS_API_KEY=AIza...`

**Example:**
```bash
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Required APIs to Enable:**
- Maps JavaScript API ✅ (required)
- Places API (optional)

---

## ✅ Verification

After creating your `.env` file:

1. **Check file location:** It should be in the project root, not in `client/` or `server/`

```
bus-tracker/
├── .env          ← HERE (project root)
├── client/
├── server/
└── package.json
```

2. **Restart dev server:** Environment changes require a restart
```bash
# Stop the current server (Ctrl+C)
pnpm dev
```

3. **Check for errors:** If configured correctly, the app should load without showing the configuration error page

---

## 🔒 Security Checklist

- [ ] `.env` file is in `.gitignore` (it should be by default)
- [ ] Never commit `.env` to Git
- [ ] Never share your keys publicly
- [ ] Restrict Google Maps API key to your domain
- [ ] Use different keys for development and production
- [ ] Keep your Supabase service_role key secret (don't use it in the client)

---

## 🐛 Troubleshooting

### "Configuration Required" Error Page

**Problem:** The app shows an error page about missing variables.

**Solution:**
1. Ensure `.env` is in the correct location (project root)
2. Check that all three variables are present
3. Verify there are no typos in variable names (they're case-sensitive)
4. Restart the dev server
5. Check the browser console for specific error messages

### Variables Not Loading

**Problem:** Variables are undefined even though `.env` exists.

**Solution:**
1. Variable names MUST start with `VITE_` for Vite to expose them
2. No spaces around the `=` sign
3. No quotes needed (unless the value contains spaces)
4. Restart the dev server after any `.env` changes

### Google Maps Not Showing

**Problem:** Map component shows an error.

**Solution:**
1. Verify the API key is correct
2. Ensure Maps JavaScript API is enabled
3. Check that billing is enabled on your Google Cloud project
4. Verify the API key isn't restricted to exclude localhost

---

## 📝 Example Complete `.env` File

```bash
# Real example with dummy values (replace with your actual values)

# Supabase
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMjUyNzg2MCwiZXhwIjoxOTI4MTAzODYwfQ.xxxxxxxxxxxxxxxxxxxxx

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🚀 Next Steps

After setting up your `.env`:

1. ✅ Run `pnpm dev`
2. ✅ Open `http://localhost:8080`
3. ✅ Create your first school
4. ✅ Add buses to your fleet
5. ✅ Start tracking!

---

## 📚 Need More Help?

- See [SETUP.md](./SETUP.md) for detailed setup instructions
- See [IMPROVEMENTS.md](./IMPROVEMENTS.md) for feature documentation
- Check Supabase documentation: https://supabase.com/docs
- Check Google Maps documentation: https://developers.google.com/maps

---

**Remember:** Never commit your `.env` file to version control! 🔒

