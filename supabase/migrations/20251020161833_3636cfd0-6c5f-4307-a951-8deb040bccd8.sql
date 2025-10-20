-- Migration: Add guest_id to order tables and consent fields to guests

-- Add guest_id column to shop_orders
ALTER TABLE shop_orders 
ADD COLUMN IF NOT EXISTS guest_id UUID REFERENCES guests(id) ON DELETE CASCADE;

-- Add guest_id column to travel_service_orders
ALTER TABLE travel_service_orders 
ADD COLUMN IF NOT EXISTS guest_id UUID REFERENCES guests(id) ON DELETE CASCADE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_shop_orders_guest_id ON shop_orders(guest_id);
CREATE INDEX IF NOT EXISTS idx_travel_service_orders_guest_id ON travel_service_orders(guest_id);

-- Add consent fields to guests table
ALTER TABLE guests 
ADD COLUMN IF NOT EXISTS consent_given BOOLEAN DEFAULT false;

ALTER TABLE guests 
ADD COLUMN IF NOT EXISTS consent_date TIMESTAMP WITH TIME ZONE;

-- Add guest_id to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS guest_id UUID REFERENCES guests(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_bookings_guest_id ON bookings(guest_id);

-- Add guest_type enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'guest_type_enum') THEN
        CREATE TYPE guest_type_enum AS ENUM ('booked', 'walk_in', 'family_member');
    END IF;
END $$;

ALTER TABLE guests 
ADD COLUMN IF NOT EXISTS guest_type guest_type_enum DEFAULT 'walk_in';

-- Update RLS policies to allow guests to view their own orders by guest_id
DROP POLICY IF EXISTS "Guests can view their own shop orders by guest_id" ON shop_orders;
CREATE POLICY "Guests can view their own shop orders by guest_id"
ON shop_orders FOR SELECT
USING (
  guest_id IS NOT NULL AND 
  guest_id IN (
    SELECT id FROM guests 
    WHERE email = (current_setting('request.jwt.claims'::text, true)::json ->> 'email')
  )
);

DROP POLICY IF EXISTS "Guests can view their own travel orders by guest_id" ON travel_service_orders;
CREATE POLICY "Guests can view their own travel orders by guest_id"
ON travel_service_orders FOR SELECT
USING (
  guest_id IS NOT NULL AND 
  guest_id IN (
    SELECT id FROM guests 
    WHERE email = (current_setting('request.jwt.claims'::text, true)::json ->> 'email')
  )
);