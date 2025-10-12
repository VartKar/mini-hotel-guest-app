-- Drop the unused combined table
-- This table is redundant - all functionality uses the bookings table
-- and combined_view provides the same joined data when needed
DROP TABLE IF EXISTS public.combined CASCADE;