-- ============================================================================
-- Database Migration: Add Supervisor Name to Buses
-- ============================================================================
-- Run this SQL in your Supabase SQL Editor if you already have the buses table
-- This adds the supervisor_name column to existing buses table
-- ============================================================================

-- Add supervisor_name column to buses table
ALTER TABLE buses 
ADD COLUMN IF NOT EXISTS supervisor_name TEXT;

-- Add a comment to the column
COMMENT ON COLUMN buses.supervisor_name IS 'Name of the person responsible for supervising this bus';

-- ============================================================================
-- MIGRATION COMPLETE!
-- ============================================================================
-- The supervisor_name field has been added to your buses table.
-- You can now use the Add Bus form with the supervisor name field.
-- ============================================================================

