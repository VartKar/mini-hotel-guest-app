-- Phase 1: Remove completely unused tables
-- These tables have no code references and no dependencies

-- Drop room_guests table (2 rows, no code usage)
DROP TABLE IF EXISTS public.room_guests CASCADE;

-- Drop room_access table (17 rows, no code usage)
DROP TABLE IF EXISTS public.room_access CASCADE;