
-- Clean up the travel_itineraries table to keep only templates and add better structure
-- First, remove all booking-specific entries (keep only templates)
DELETE FROM travel_itineraries WHERE booking_id_key IS NOT NULL;

-- Add an index on city for better performance
CREATE INDEX IF NOT EXISTS idx_travel_itineraries_city ON travel_itineraries(city);

-- Add an index on day_number for better performance  
CREATE INDEX IF NOT EXISTS idx_travel_itineraries_day_number ON travel_itineraries(day_number);

-- Add fields for future personalization
ALTER TABLE travel_itineraries ADD COLUMN IF NOT EXISTS activity_category TEXT;
ALTER TABLE travel_itineraries ADD COLUMN IF NOT EXISTS difficulty_level TEXT;
ALTER TABLE travel_itineraries ADD COLUMN IF NOT EXISTS duration_hours INTEGER;

-- Update existing template data with some sample categories
UPDATE travel_itineraries 
SET activity_category = CASE 
    WHEN activity_title ILIKE '%исторический%' OR activity_title ILIKE '%центр%' THEN 'culture'
    WHEN activity_title ILIKE '%морская%' OR activity_title ILIKE '%катер%' THEN 'water'
    WHEN activity_title ILIKE '%горный%' OR activity_title ILIKE '%гор%' THEN 'nature'
    ELSE 'general'
END
WHERE activity_category IS NULL;

-- Set default values for new fields
UPDATE travel_itineraries 
SET 
    difficulty_level = 'easy',
    duration_hours = 4
WHERE difficulty_level IS NULL OR duration_hours IS NULL;
