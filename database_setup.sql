-- ============================================================================
-- BusTrack Database Setup
-- ============================================================================
-- Run this SQL in your Supabase SQL Editor to create all required tables
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. SCHOOLS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS schools (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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

-- ============================================================================
-- 2. BUSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS buses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  supervisor_name TEXT,
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

-- ============================================================================
-- 3. BUS LOCATIONS TABLE (for GPS tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS bus_locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bus_id UUID REFERENCES buses(id) ON DELETE CASCADE,
  location JSONB NOT NULL, -- { "lat": 0, "lng": 0 }
  speed_kmh DECIMAL(5,2) DEFAULT 0,
  heading_degrees INTEGER DEFAULT 0,
  accuracy_meters DECIMAL(6,2),
  altitude_meters DECIMAL(8,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 4. BUS ROUTES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS bus_routes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  route_type TEXT DEFAULT 'morning' CHECK (route_type IN ('morning', 'afternoon', 'field_trip')),
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 5. ROUTE STOPS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS route_stops (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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

-- ============================================================================
-- 6. STUDENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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

-- ============================================================================
-- 7. CREATE INDEXES for better performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_buses_school_id ON buses(school_id);
CREATE INDEX IF NOT EXISTS idx_bus_locations_bus_id ON bus_locations(bus_id);
CREATE INDEX IF NOT EXISTS idx_bus_routes_school_id ON bus_routes(school_id);
CREATE INDEX IF NOT EXISTS idx_route_stops_route_id ON route_stops(route_id);
CREATE INDEX IF NOT EXISTS idx_students_school_id ON students(school_id);

-- ============================================================================
-- 8. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 9. CREATE PUBLIC ACCESS POLICIES (for demo/development)
-- ============================================================================
-- WARNING: These policies allow anyone to read/write data
-- Adjust these for production based on your authentication needs

-- Schools policies
DROP POLICY IF EXISTS "Public read access" ON schools;
CREATE POLICY "Public read access" ON schools FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert access" ON schools;
CREATE POLICY "Public insert access" ON schools FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update access" ON schools;
CREATE POLICY "Public update access" ON schools FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public delete access" ON schools;
CREATE POLICY "Public delete access" ON schools FOR DELETE USING (true);

-- Buses policies
DROP POLICY IF EXISTS "Public read access" ON buses;
CREATE POLICY "Public read access" ON buses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert access" ON buses;
CREATE POLICY "Public insert access" ON buses FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update access" ON buses;
CREATE POLICY "Public update access" ON buses FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public delete access" ON buses;
CREATE POLICY "Public delete access" ON buses FOR DELETE USING (true);

-- Bus locations policies
DROP POLICY IF EXISTS "Public read access" ON bus_locations;
CREATE POLICY "Public read access" ON bus_locations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert access" ON bus_locations;
CREATE POLICY "Public insert access" ON bus_locations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update access" ON bus_locations;
CREATE POLICY "Public update access" ON bus_locations FOR UPDATE USING (true);

-- Bus routes policies
DROP POLICY IF EXISTS "Public read access" ON bus_routes;
CREATE POLICY "Public read access" ON bus_routes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert access" ON bus_routes;
CREATE POLICY "Public insert access" ON bus_routes FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update access" ON bus_routes;
CREATE POLICY "Public update access" ON bus_routes FOR UPDATE USING (true);

-- Route stops policies
DROP POLICY IF EXISTS "Public read access" ON route_stops;
CREATE POLICY "Public read access" ON route_stops FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert access" ON route_stops;
CREATE POLICY "Public insert access" ON route_stops FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update access" ON route_stops;
CREATE POLICY "Public update access" ON route_stops FOR UPDATE USING (true);

-- Students policies
DROP POLICY IF EXISTS "Public read access" ON students;
CREATE POLICY "Public read access" ON students FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert access" ON students;
CREATE POLICY "Public insert access" ON students FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update access" ON students;
CREATE POLICY "Public update access" ON students FOR UPDATE USING (true);

-- ============================================================================
-- 10. INSERT SAMPLE DATA (optional)
-- ============================================================================
-- Uncomment to add sample data

-- INSERT INTO schools (name, address, city, state, postal_code, country, phone, email, website)
-- VALUES 
--   ('Springfield Elementary', '123 Main St', 'Springfield', 'IL', '62701', 'USA', '+1 (555) 123-4567', 'admin@springfield-elem.edu', 'https://springfield-elem.edu'),
--   ('Riverside High School', '456 River Rd', 'Riverside', 'CA', '92501', 'USA', '+1 (555) 987-6543', 'info@riverside-hs.edu', 'https://riverside-hs.edu');

-- ============================================================================
-- SETUP COMPLETE! 
-- ============================================================================
-- Your database is now ready to use with the BusTrack application.
-- 
-- Next steps:
-- 1. Copy this SQL
-- 2. Go to your Supabase dashboard
-- 3. Click "SQL Editor" in the left sidebar
-- 4. Click "New Query"
-- 5. Paste this SQL
-- 6. Click "Run" or press Ctrl+Enter
-- 7. Refresh your BusTrack application
-- 
-- The "Add School" functionality should now work!
-- ============================================================================

