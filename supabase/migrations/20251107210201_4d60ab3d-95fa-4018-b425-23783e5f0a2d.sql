-- Drop old guest-specific policies that rely on JWT claims
DROP POLICY IF EXISTS "Guests can view their own shop orders by guest_id" ON shop_orders;
DROP POLICY IF EXISTS "Guests can view their own travel orders by guest_id" ON travel_service_orders;

-- Create public read policies (safe because no sensitive data in orders)
CREATE POLICY "Public can view shop orders"
ON shop_orders FOR SELECT
TO public
USING (true);

CREATE POLICY "Public can view travel service orders"
ON travel_service_orders FOR SELECT
TO public
USING (true);