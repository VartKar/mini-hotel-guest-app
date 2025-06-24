
-- Add city field to the combined table to link with travel activities
ALTER TABLE combined ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Сочи';

-- Update existing records to have a default city
UPDATE combined SET city = 'Сочи' WHERE city IS NULL;

-- Add index on city for better performance when joining with travel_itineraries
CREATE INDEX IF NOT EXISTS idx_combined_city ON combined(city);

-- The travel_service_orders table already exists with the correct structure for storing orders
-- Let's make sure it has all the fields we need and add any missing ones
ALTER TABLE travel_service_orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add index for better admin queries
CREATE INDEX IF NOT EXISTS idx_travel_service_orders_status ON travel_service_orders(order_status);
CREATE INDEX IF NOT EXISTS idx_travel_service_orders_created_at ON travel_service_orders(created_at DESC);
