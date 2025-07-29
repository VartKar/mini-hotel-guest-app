
-- Step 1: Drop the redundant tables that are causing confusion
-- These tables duplicate functionality that's already handled by rooms + bookings + guest_sessions

-- Drop the combined_view (it's a view, so safe to drop)
DROP VIEW IF EXISTS combined_view;

-- Drop the combined table (appears to be legacy mixing rooms + bookings)
DROP TABLE IF EXISTS combined;

-- Drop room_access table (functionality moved to guest_sessions)
DROP TABLE IF EXISTS room_access;

-- Drop room_guests table (functionality moved to guest_sessions) 
DROP TABLE IF EXISTS room_guests;

-- Drop property_item_pricing and property_service_pricing (seem unused)
DROP TABLE IF EXISTS property_item_pricing;
DROP TABLE IF EXISTS property_service_pricing;
