# ⚡ Authentication Quick Setup (2 Minutes)

Get your login system running in just 2 minutes!

---

## Step 1: Verify Supabase Auth is Enabled (30 seconds)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **Authentication** (shield icon in left sidebar)
4. Click **Providers**
5. Verify **Email** is enabled ✅ (should be on by default)

**Done!** Auth is ready.

---

## Step 2: Create Your Admin Account (1 minute)

### Option A: Via Supabase Dashboard (Fastest)

1. In Supabase, stay on **Authentication** page
2. Click **Users** tab
3. Click **Add User** button (top right)
4. Fill in:
   - Email: `your-email@example.com`
   - Password: `your-secure-password`
   - ✅ Check **Auto Confirm User**
5. Click **Create User**

✅ **Done!** Your admin account is ready.

### Option B: Via Sign Up Page

1. Start your app: `npm run dev`
2. Go to `http://localhost:8080/signup`
3. Enter email and password
4. Click "Create Account"
5. Check email for confirmation (if verification is enabled)
6. Click the confirmation link

✅ **Done!** Account created.

---

## Step 3: Log In (30 seconds)

1. Go to `http://localhost:8080/login`
2. Enter your email and password
3. Click **"Sign In"**
4. ✅ Success! You're now in the Dashboard

---

## 🎉 That's It!

You now have:
- ✅ Secure authentication
- ✅ Admin account ready
- ✅ Protected admin pages
- ✅ Public student portal
- ✅ Logout functionality

---

## 🧪 Quick Test

Test everything works:

```
1. Log in (/login) → Should go to Dashboard ✓
2. Visit /buses → Should show buses ✓
3. Visit /schools → Should show schools ✓
4. Click Logout → Should go to login ✓
5. Try /buses without login → Should redirect to login ✓
6. Visit /student-portal → Should work without login ✓
```

---

## 🔑 Demo Credentials

The login page shows demo credentials for testing:
```
Email: admin@bustrack.com
Password: demo123456
```

**Note:** Create a real user in Supabase to use these!

---

## 🚨 Troubleshooting

### Can't log in?
- Check email/password are correct
- Verify user exists in Supabase → Authentication → Users
- Make sure "Auto Confirm User" was checked

### Redirect loop?
- Clear browser cache
- Check Supabase URL and keys in `.env`
- Restart dev server

### Sign up not working?
- Check email provider is enabled
- Look for errors in browser console
- Check Supabase logs

---

## 📚 More Info

- **Full Guide:** See `AUTHENTICATION_GUIDE.md`
- **Setup Help:** See `SETUP.md`
- **Environment:** See `ENV_TEMPLATE.md`

---

**Ready to track! 🚌🔐**

