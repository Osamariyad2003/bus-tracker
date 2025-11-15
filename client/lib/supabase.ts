import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define types based on your database schema
export interface Bus {
  id: string;
  school_id: string;
  name: string;
  bus_number: string;
  license_plate: string;
  capacity: number;
  model: string;
  manufacturer: string;
  year: number;
  vin: string;
  color: string;
  status: string;
  has_wheelchair_lift: boolean;
  has_gps: boolean;
  last_maintenance_date: string;
  current_mileage: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface BusLocation {
  id: string;
  bus_id: string;
  location: { lat: number; lng: number };
  speed_kmh: number;
  heading_degrees: number;
  accuracy_meters: number;
  altitude_meters: number;
  created_at: string;
  updated_at: string;
}

export interface BusRoute {
  id: string;
  school_id: string;
  name: string;
  route_type: string;
  is_active: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface RouteStop {
  id: string;
  route_id: string;
  stop_address: string;
  latitude: number;
  longitude: number;
  sequence_order: number;
  estimated_arrival_time: string;
  distance_km: number;
  is_active: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface School {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  school_id: string;
  student_number: string;
  full_name: string;
  date_of_birth: string;
  grade_level: string;
  gender: string;
  photo_url: string;
  medical_notes: string;
  special_needs: string;
  is_active: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Supervisor {
  id: string;
  school_id: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  title: string;
  avatar_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudentBusAssignment {
  id: string;
  student_id: string;
  bus_id: string;
  school_year_id: string;
  assignment_type: string;
  boarding_stop_id: string;
  exit_stop_id: string;
  seat_preference: string;
  special_instructions: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
