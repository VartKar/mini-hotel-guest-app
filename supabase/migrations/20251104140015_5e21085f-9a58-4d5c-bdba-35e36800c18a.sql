-- Fix email comparison in can_view_guest to be case/whitespace-insensitive
CREATE OR REPLACE FUNCTION public.can_view_guest(_guest_id uuid, _guest_email text)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  jwt_email text;
BEGIN
  -- Extract email from JWT claims (may be null for anon)
  jwt_email := (current_setting('request.jwt.claims', true)::json ->> 'email');

  -- Admins can view everyone
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN true;
  END IF;

  -- Guests can view their own profile by email (case/trim insensitive)
  IF jwt_email IS NOT NULL AND lower(TRIM(BOTH FROM jwt_email)) = lower(TRIM(BOTH FROM _guest_email)) THEN
    RETURN true;
  END IF;

  -- Hosts can view guests who have bookings in their rooms (case/trim insensitive)
  IF public.has_role(auth.uid(), 'host') THEN
    RETURN EXISTS (
      SELECT 1
      FROM public.bookings b
      JOIN public.rooms r ON r.id = b.room_id
      WHERE lower(TRIM(BOTH FROM b.guest_email)) = lower(TRIM(BOTH FROM _guest_email))
        AND lower(TRIM(BOTH FROM r.host_email)) = lower(TRIM(BOTH FROM jwt_email))
      LIMIT 1
    );
  END IF;

  RETURN false;
END;
$function$;