# 🚀 BusTrack Quick Start

Get your bus tracking system running in **5 minutes**!

---

## ✅ Step 1: Database Setup (2 minutes)

### Go to Supabase:
1. Visit [supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in project details and wait for it to be ready

### Run the Setup SQL:
1. Click **"SQL Editor"** (left sidebar, lightning icon)
2. Click **"+ New Query"**
3. Open `database_setup.sql` file from this project
4. **Copy ALL the SQL** and paste it into Supabase
5. Click **"Run"** button (or press Ctrl+Enter)
6. Wait for "Success. No rows returned" message

✅ **Done!** Your database is ready.

---

## ✅ Step 2: Get Your API Keys (2 minutes)

### Supabase Credentials:
1. In Supabase, click **Settings** (gear icon, bottom left)
2. Click **"API"**
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public** key (long string starting with `eyJ...`)

### Google Maps API Key:
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Click **"APIs & Services"** → **"Library"**
4. Search for **"Maps JavaScript API"** and click **"Enable"**
5. Go to **"Credentials"** → **"Create Credentials"** → **"API Key"**
6. Copy the API key

✅ **Done!** You have all your keys.

---

## ✅ Step 3: Configure Environment (30 seconds)

### Create `.env` file:
Create a file named `.env` in the project root folder:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_GOOGLE_MAPS_API_KEY=AIzaSyB...
```

**Replace the values** with your actual keys from Step 2.

✅ **Done!** Configuration complete.

---

## ✅ Step 4: Start the Application (30 seconds)

### Run these commands:

```bash
# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

### Open your browser:
Go to: **http://localhost:8080**

You'll be redirected to the login page.

✅ **Done!** Your app is running!

---

## ✅ Step 4.5: Create Admin Account (30 seconds)

### Quick Method - Via Supabase:
1. Go to your Supabase Dashboard
2. Click **Authentication** → **Users**
3. Click **Add User**
4. Enter email and password
5. ✅ Check **"Auto Confirm User"**
6. Click **Create User**

### Or use the sign-up page:
1. Go to `http://localhost:8080/signup`
2. Fill in email and password
3. Click "Create Account"

**Now you can log in!** ✅

---

## 🎉 You're Ready!

Your BusTrack application is now running. Here's what you can do:

### First Steps:
1. **Add a School** - Click "Add School" button on the Schools page
2. **Add Buses** - Navigate to Buses page and add your fleet
3. **Enable GPS** - Mark buses as GPS-enabled for tracking
4. **View Live Tracking** - Go to Live Tracking to see buses on the map

### Features Available:
- ✅ **Dashboard** - Fleet overview and statistics
- ✅ **Buses** - Manage your bus fleet
- ✅ **Live Tracking** - Real-time GPS tracking
- ✅ **Schools** - Manage schools
- ✅ **Students** - Student management
- ✅ **Routes** - Route planning
- ✅ **Student Portal** - Public portal for parents

---

## ❓ Troubleshooting

### App shows "Configuration Required"
→ Your `.env` file is missing or has errors. Check Step 3.

### "Failed to add school" error
→ Database tables might not be created. Re-run Step 1.

### Map doesn't load
→ Google Maps API key issue. Check:
   - Key is correct in `.env`
   - Maps JavaScript API is enabled
   - Billing is enabled on Google Cloud

### Port already in use
→ Stop the server (Ctrl+C) or use a different port:
```bash
PORT=3000 npm run dev
```

---

## 📚 Need More Help?

- **Detailed Setup:** See `SETUP.md`
- **Environment Help:** See `ENV_TEMPLATE.md`
- **What Changed:** See `IMPROVEMENTS.md`
- **Testing Guide:** See `VERIFICATION_CHECKLIST.md`

---

## 🎯 Common Tasks

### Add Your First School:
1. Navigate to **Schools** page
2. Click **"Add School"** button
3. Fill in school name (required)
4. Add other details (optional)
5. Click **"Add School"**

### Add Your First Bus:
1. Navigate to **Buses** page
2. Click **"Add Bus"** button
3. Fill in bus details
4. Select the school
5. Enable GPS if available
6. Click **"Add Bus"**

### View on Map:
1. Go to **Live Tracking** page
2. Buses with GPS will appear on the map
3. Click on a bus marker for details

---

## 💡 Pro Tips

1. **Start Simple:** Add one school and one bus first to test
2. **Enable GPS:** Mark buses as GPS-enabled to see them on the map
3. **Use Student Portal:** Share `/student-portal` URL with parents
4. **Mobile Friendly:** Works perfectly on phones and tablets
5. **Auto-Refresh:** Tracking page updates every 3 seconds automatically

---

## 🆘 Still Stuck?

Check the browser console (F12) for error messages and refer to:
- **SETUP.md** - Complete setup guide
- **ENV_TEMPLATE.md** - Environment configuration help

---

**Happy Tracking! 🚌**

