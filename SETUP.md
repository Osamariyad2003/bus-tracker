# BusTrack Setup Guide

Welcome to BusTrack! This guide will help you set up and configure your bus tracking application.

## ⚡ Quick Start (5 Minutes!)

### 1. Set up Supabase Database
1. Go to [Supabase Dashboard](https://app.supabase.com) and create a new project
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire content of `database_setup.sql` (in project root)
5. Click **Run** or press Ctrl+Enter
6. ✅ Database is ready!

### 2. Configure Environment Variables
1. Copy `.env.example` or `ENV_TEMPLATE.md` template
2. Get your Supabase credentials from **Settings** → **API**
3. Get your Google Maps API key from [Google Cloud Console](https://console.cloud.google.com)
4. Create `.env` file in project root with your values
5. ✅ Configuration is ready!

### 3. Start the Application
```bash
npm install
npm run dev
```
6. Open `http://localhost:8080`
7. ✅ Start tracking!

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **pnpm** (pnpm v8+ recommended)
- **Supabase account** (free tier available)
- **Google Cloud account** (for Maps API)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
```

### 3. Run Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:8080`

---

## 🗄️ Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Click "New Project"
3. Fill in your project details

### Step 2: Get Your API Credentials

1. Go to **Project Settings** → **API**
2. Copy your **Project URL** → This is your `VITE_SUPABASE_URL`
3. Copy your **anon/public key** → This is your `VITE_SUPABASE_ANON_KEY`

### Step 3: Set Up Database Tables

Run these SQL queries in your Supabase SQL Editor:

```sql
-- Schools Table
CREATE TABLE schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'USA',
  phone TEXT,
  email TEXT,
  website TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buses Table
CREATE TABLE buses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bus_number TEXT UNIQUE NOT NULL,
  license_plate TEXT,
  capacity INTEGER DEFAULT 40,
  model TEXT,
  manufacturer TEXT,
  year INTEGER,
  vin TEXT,
  color TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
  has_wheelchair_lift BOOLEAN DEFAULT false,
  has_gps BOOLEAN DEFAULT false,
  last_maintenance_date DATE,
  current_mileage INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bus Locations Table (for GPS tracking)
CREATE TABLE bus_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bus_id UUID REFERENCES buses(id) ON DELETE CASCADE,
  location JSONB NOT NULL, -- { "lat": 0, "lng": 0 }
  speed_kmh DECIMAL(5,2) DEFAULT 0,
  heading_degrees INTEGER DEFAULT 0,
  accuracy_meters DECIMAL(6,2),
  altitude_meters DECIMAL(8,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bus Routes Table
CREATE TABLE bus_routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  route_type TEXT DEFAULT 'morning' CHECK (route_type IN ('morning', 'afternoon', 'field_trip')),
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Route Stops Table
CREATE TABLE route_stops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID REFERENCES bus_routes(id) ON DELETE CASCADE,
  stop_address TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  sequence_order INTEGER NOT NULL,
  estimated_arrival_time TIME,
  distance_km DECIMAL(8,2),
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students Table
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  student_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  grade_level TEXT,
  gender TEXT,
  photo_url TEXT,
  medical_notes TEXT,
  special_needs TEXT,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_buses_school_id ON buses(school_id);
CREATE INDEX idx_bus_locations_bus_id ON bus_locations(bus_id);
CREATE INDEX idx_bus_routes_school_id ON bus_routes(school_id);
CREATE INDEX idx_students_school_id ON students(school_id);

-- Enable Row Level Security (Optional but recommended)
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create policies (example - adjust based on your needs)
CREATE POLICY "Public read access" ON schools FOR SELECT USING (true);
CREATE POLICY "Public read access" ON buses FOR SELECT USING (true);
CREATE POLICY "Public read access" ON bus_locations FOR SELECT USING (true);
```

---

## 🗺️ Google Maps API Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one

### Step 2: Enable Required APIs

1. Go to **APIs & Services** → **Library**
2. Enable the following APIs:
   - **Maps JavaScript API** (required)
   - **Places API** (optional, for address autocomplete)

### Step 3: Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API Key**
3. Copy the API key → This is your `VITE_GOOGLE_MAPS_API_KEY`

### Step 4: Restrict Your API Key (Recommended)

1. Click on your API key to edit it
2. Under **Application restrictions**:
   - Choose **HTTP referrers**
   - Add your domain (e.g., `localhost:8080`, `yourdomain.com`)
3. Under **API restrictions**:
   - Choose **Restrict key**
   - Select only the APIs you enabled

---

## 🎨 Features Overview

### Admin Dashboard
- Real-time fleet overview
- Active bus monitoring
- GPS tracking status
- Quick statistics

### Bus Management
- Add/edit buses
- Track bus locations in real-time
- View bus details and status
- Monitor GPS-enabled buses

### Live Tracking
- Real-time GPS tracking map
- Bus speed and heading information
- Online/offline status
- Auto-refresh every 3 seconds

### Student Portal
- Public-facing portal for parents/students
- School selection
- Bus locations and status
- No authentication required

### Schools Management
- Manage multiple schools
- School details and contacts
- Bus assignments per school

### Routes Management
- Create and manage bus routes
- Define stops and sequences
- Morning/afternoon routes

---

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-friendly sidebar that collapses on small screens
- Touch-optimized controls
- Adaptive layouts for all screen sizes
- Mobile menu with hamburger icon

---

## 🔧 Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run tests
pnpm test

# Type checking
pnpm typecheck
```

### Project Structure

```
bus-tracker/
├── client/                 # Frontend React app
│   ├── components/
│   │   ├── layout/        # Layout components (Sidebar, AdminLayout)
│   │   ├── map/           # Map components (BusMap)
│   │   └── ui/            # Reusable UI components
│   ├── lib/               # Utilities and configurations
│   │   ├── env.ts         # Environment validation
│   │   └── supabase.ts    # Supabase client
│   ├── pages/             # Route pages
│   └── App.tsx            # Main app with routing
├── server/                # Express backend
├── shared/                # Shared types between client/server
└── .env                   # Environment variables (create this!)
```

---

## 🚨 Troubleshooting

### Environment Variables Not Loading

**Problem:** The app shows a configuration error screen.

**Solution:**
1. Ensure `.env` file is in the project root (not in `client/` or `server/`)
2. Variables must start with `VITE_` for Vite to expose them to the client
3. Restart the dev server after changing `.env`

### Map Not Loading

**Problem:** Google Maps shows "Failed to load" error.

**Solution:**
1. Verify your Google Maps API key is correct
2. Ensure Maps JavaScript API is enabled in Google Cloud Console
3. Check API key restrictions aren't blocking localhost
4. Verify billing is enabled on your Google Cloud project

### Supabase Connection Issues

**Problem:** Data not loading or connection errors.

**Solution:**
1. Verify your Supabase URL and anon key are correct
2. Check that your database tables are created
3. Verify Row Level Security policies allow public read access
4. Check Supabase project status (not paused)

### Port Already in Use

**Problem:** Dev server won't start due to port conflict.

**Solution:**
```bash
# Use a different port
PORT=3000 pnpm dev
```

---

## 🔒 Security Notes

- Never commit your `.env` file to version control
- The `.env.example` template is for reference only
- Use environment-specific keys for development vs production
- Restrict your Google Maps API key to specific domains
- Implement proper authentication for admin routes in production
- Review and adjust Supabase Row Level Security policies

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Google Maps Platform](https://developers.google.com/maps)
- [React Router Documentation](https://reactrouter.com)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev)

---

## 🤝 Support

If you encounter issues:
1. Check this setup guide
2. Review the troubleshooting section
3. Check the console for error messages
4. Verify all environment variables are set correctly

---

## 🎉 You're Ready!

Once configured, you can:
1. Add schools from the Schools page
2. Add buses and assign them to schools
3. Enable GPS tracking for buses
4. View real-time tracking on the map
5. Share the Student Portal with parents

Happy tracking! 🚌

