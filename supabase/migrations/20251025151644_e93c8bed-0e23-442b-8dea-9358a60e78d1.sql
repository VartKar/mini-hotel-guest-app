-- Create helper function to avoid recursion and use in guests policy
CREATE OR REPLACE FUNCTION public.can_view_guest(_guest_id uuid, _guest_email text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  jwt_email text;
BEGIN
  -- Extract email from JWT claims (may be null for anon)
  jwt_email := (current_setting('request.jwt.claims', true)::json ->> 'email');

  -- Admins can view everyone
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN true;
  END IF;

  -- Guests can view their own profile by email
  IF jwt_email IS NOT NULL AND jwt_email = _guest_email THEN
    RETURN true;
  END IF;

  -- Hosts can view guests who have bookings in their rooms
  IF public.has_role(auth.uid(), 'host') THEN
    RETURN EXISTS (
      SELECT 1
      FROM public.bookings b
      JOIN public.rooms r ON r.id = b.room_id
      WHERE b.guest_email = _guest_email
        AND r.host_email = jwt_email
      LIMIT 1
    );
  END IF;

  RETURN false;
END;
$$;

-- Replace policy to call the function and avoid referencing guests inside policy
DROP POLICY IF EXISTS "Guests can view own profile" ON public.guests;
CREATE POLICY "Guests can view own profile"
ON public.guests
FOR SELECT
USING (public.can_view_guest(id, email));