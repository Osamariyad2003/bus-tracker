# 🔄 Database Migration Guide

## Adding Supervisor Name Field

If you've already set up your database using the original `database_setup.sql`, you'll need to run this migration to add the new **Supervisor Name** field.

---

## ⚡ Quick Migration (30 seconds)

### Step 1: Open Supabase SQL Editor
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **SQL Editor** (lightning icon in left sidebar)

### Step 2: Run the Migration
1. Click **+ New Query**
2. Copy the SQL from `database_migration_add_supervisor.sql`
3. Paste it into the editor
4. Click **Run** (or press Ctrl+Enter)

### Step 3: Verify
You should see: **"Success. No rows returned"**

✅ **Done!** The supervisor_name field is now available.

---

## 📝 What Changed

### New Field Added:
- **`supervisor_name`** - TEXT field in the `buses` table
- Stores the name of the person responsible for the bus
- Optional field (can be left blank)

### Where It Appears:
- ✅ Add Bus dialog form
- ✅ Bus detail views (when implemented)
- ✅ Bus management screens

---

## 🔧 Migration SQL

If you prefer to run it manually, here's the SQL:

```sql
-- Add supervisor_name column to buses table
ALTER TABLE buses 
ADD COLUMN IF NOT EXISTS supervisor_name TEXT;

-- Add a comment to the column
COMMENT ON COLUMN buses.supervisor_name IS 'Name of the person responsible for supervising this bus';
```

---

## ❓ Do I Need This Migration?

### ✅ YES - Run the migration if:
- You already have buses in your database
- You set up the database before November 15, 2025
- You're getting errors when adding buses with supervisor names

### ❌ NO - Skip the migration if:
- You're setting up the database for the first time
- You're running the complete `database_setup.sql` script
- The supervisor_name field already exists

---

## 🚨 Troubleshooting

### Error: "column already exists"
✅ **Solution:** The field is already there. No action needed!

### Error: "relation buses does not exist"
❌ **Problem:** The buses table hasn't been created yet.
✅ **Solution:** Run the full `database_setup.sql` script instead.

### Error: "permission denied"
❌ **Problem:** Insufficient permissions.
✅ **Solution:** Make sure you're logged in as the project owner in Supabase.

---

## 🔄 Rolling Back

If you need to remove the supervisor_name field:

```sql
-- Remove supervisor_name column (use with caution!)
ALTER TABLE buses DROP COLUMN IF EXISTS supervisor_name;
```

⚠️ **Warning:** This will permanently delete all supervisor name data!

---

## 📚 Related Files

- **`database_migration_add_supervisor.sql`** - The migration script
- **`database_setup.sql`** - Complete database setup (already includes this field)
- **`client/components/dialogs/AddBusDialog.tsx`** - Form with supervisor name field
- **`client/lib/supabase.ts`** - TypeScript interface with supervisor_name

---

## ✨ After Migration

Once the migration is complete:

1. **Restart your dev server** (if running)
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Test the Add Bus form**
   - Go to Buses page
   - Click "Add Bus"
   - You should see "Supervisor Name" field
   - Add a bus with a supervisor name
   - Verify it saves successfully

3. **Verify the data**
   - Go to Supabase → Table Editor
   - Select "buses" table
   - Check that supervisor_name column exists
   - Check that your test data includes the supervisor name

---

## 🎉 Migration Complete!

Your database now supports the supervisor name field. You can:
- ✅ Add buses with supervisor information
- ✅ Track who's responsible for each bus
- ✅ Use this field for reports and notifications

---

*Last Updated: November 15, 2025*

