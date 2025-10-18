-- Update shop_orders by matching room_number with the most recent active booking
UPDATE shop_orders so
SET booking_id_key = (
  SELECT b.id
  FROM bookings b
  JOIN rooms r ON b.room_id = r.id
  WHERE so.room_number = r.room_number
    AND b.is_archived = false
    AND b.booking_status = 'confirmed'
  ORDER BY b.created_at DESC
  LIMIT 1
)
WHERE so.booking_id_key IS NULL
  AND so.room_number IS NOT NULL;

-- Update travel_service_orders by matching customer_phone with the most recent active booking
UPDATE travel_service_orders tso
SET booking_id_key = (
  SELECT b.id
  FROM bookings b
  WHERE tso.customer_phone = b.guest_phone
    AND b.is_archived = false
    AND b.booking_status = 'confirmed'
  ORDER BY b.created_at DESC
  LIMIT 1
)
WHERE tso.booking_id_key IS NULL
  AND tso.customer_phone IS NOT NULL;