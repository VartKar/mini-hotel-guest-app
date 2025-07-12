
-- Add hotel_service_id column to property_service_pricing table
ALTER TABLE public.property_service_pricing 
ADD COLUMN hotel_service_id uuid REFERENCES public.hotel_services(id) ON DELETE CASCADE;

-- Make travel_service_id nullable since now we can have either hotel_service_id OR travel_service_id
ALTER TABLE public.property_service_pricing 
ALTER COLUMN travel_service_id DROP NOT NULL;

-- Add constraint to ensure exactly one service type is specified
ALTER TABLE public.property_service_pricing 
ADD CONSTRAINT check_one_service_type 
CHECK (
  (hotel_service_id IS NOT NULL AND travel_service_id IS NULL) OR 
  (hotel_service_id IS NULL AND travel_service_id IS NOT NULL)
);

-- Insert property pricing for hotel services for prop_1002
INSERT INTO public.property_service_pricing (property_id, hotel_service_id, price_override, is_available)
SELECT 'prop_1002', id, base_price, true
FROM public.hotel_services
WHERE is_active = true;
