-- Add service_image_url column to travel_itineraries table
ALTER TABLE public.travel_itineraries 
ADD COLUMN service_image_url text;