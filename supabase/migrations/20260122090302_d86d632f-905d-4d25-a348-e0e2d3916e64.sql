-- Step 1: Fix existing bookings - link them to guests by email
UPDATE bookings b
SET guest_id = g.id
FROM guests g
WHERE LOWER(TRIM(b.guest_email)) = LOWER(TRIM(g.email))
  AND b.guest_id IS NULL
  AND b.is_default_guest = false;

-- Step 2: Create function to auto-link bookings to guests
CREATE OR REPLACE FUNCTION public.link_booking_to_guest()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only try to link if guest_id is not set and we have an email
  IF NEW.guest_id IS NULL AND NEW.guest_email IS NOT NULL AND NEW.is_default_guest = false THEN
    SELECT id INTO NEW.guest_id
    FROM guests
    WHERE LOWER(TRIM(email)) = LOWER(TRIM(NEW.guest_email))
    LIMIT 1;
  END IF;
  RETURN NEW;
END;
$$;

-- Step 3: Create trigger for automatic linking on insert/update
DROP TRIGGER IF EXISTS booking_auto_link_guest ON bookings;
CREATE TRIGGER booking_auto_link_guest
BEFORE INSERT OR UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION public.link_booking_to_guest();