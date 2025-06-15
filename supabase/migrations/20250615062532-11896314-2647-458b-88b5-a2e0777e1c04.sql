
-- First, let's clean up any duplicate entries in the travel_itineraries table
-- We'll keep only the most recent entry for each booking_id_key + day_number combination
DELETE FROM travel_itineraries 
WHERE id NOT IN (
  SELECT DISTINCT ON (booking_id_key, day_number) id
  FROM travel_itineraries
  ORDER BY booking_id_key, day_number, created_at DESC
);

-- Also clean up any template duplicates (where booking_id_key is NULL)
DELETE FROM travel_itineraries 
WHERE booking_id_key IS NULL 
AND id NOT IN (
  SELECT DISTINCT ON (day_number) id
  FROM travel_itineraries
  WHERE booking_id_key IS NULL
  ORDER BY day_number, created_at DESC
);
