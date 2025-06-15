
-- Add a 'city' column to the travel_itineraries table
ALTER TABLE public.travel_itineraries ADD COLUMN city TEXT;

-- Update existing template itineraries with a default city (e.g., 'Сочи')
-- This ensures that newly generated itineraries will have a city.
UPDATE public.travel_itineraries
SET city = 'Сочи'
WHERE booking_id_key IS NULL;
