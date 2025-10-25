-- Drop the unused combined_view that has SECURITY DEFINER
-- This view bypasses RLS policies and exposes sensitive data
-- It is not referenced anywhere in the application code
DROP VIEW IF EXISTS public.combined_view;