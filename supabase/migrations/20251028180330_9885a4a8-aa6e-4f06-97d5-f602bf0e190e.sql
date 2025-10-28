-- Allow public read access to template itineraries (booking_id_key IS NULL)
-- This preserves privacy of user-specific itineraries while enabling recommendations

-- Ensure RLS is enabled (it already is, but this is safe to run)
ALTER TABLE public.travel_itineraries ENABLE ROW LEVEL SECURITY;

-- Create policy for public to view only template itineraries
CREATE POLICY "Public can view template travel itineraries"
ON public.travel_itineraries
FOR SELECT
USING (booking_id_key IS NULL);
