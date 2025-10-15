-- Step 1: Add new columns
ALTER TABLE public.travel_itineraries
ADD COLUMN travel_service_id UUID NULL,
ADD COLUMN service_price_override NUMERIC NULL;

-- Step 2: Create Foreign Key constraint with ON DELETE SET NULL for safety
ALTER TABLE public.travel_itineraries
ADD CONSTRAINT fk_travel_itineraries_service
FOREIGN KEY (travel_service_id)
REFERENCES public.travel_services(id)
ON DELETE SET NULL;

-- Step 3: Migrate existing data (map service_title to travel_service_id)
UPDATE public.travel_itineraries ti
SET travel_service_id = ts.id,
    service_price_override = CASE 
      WHEN ti.service_price IS NOT NULL AND ti.service_price <> ts.base_price 
      THEN ti.service_price 
      ELSE NULL 
    END
FROM public.travel_services ts
WHERE ti.service_title IS NOT NULL 
  AND LOWER(TRIM(ti.service_title)) = LOWER(TRIM(ts.title))
  AND ti.city = ts.city;

-- Step 4: Drop old redundant columns (after data migration)
ALTER TABLE public.travel_itineraries
DROP COLUMN IF EXISTS service_title,
DROP COLUMN IF EXISTS service_description,
DROP COLUMN IF EXISTS service_price,
DROP COLUMN IF EXISTS service_image_url,
DROP COLUMN IF EXISTS duration_hours,
DROP COLUMN IF EXISTS difficulty_level;

-- Step 5: Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_travel_itineraries_service_id 
ON public.travel_itineraries(travel_service_id);

-- Step 6: Add trigger to update updated_at
CREATE TRIGGER update_travel_itineraries_updated_at
BEFORE UPDATE ON public.travel_itineraries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();