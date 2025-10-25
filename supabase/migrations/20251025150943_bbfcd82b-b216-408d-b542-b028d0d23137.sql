-- Fix guests RLS policy causing 500 by removing auth.users references
-- 1) Drop existing policy
DROP POLICY IF EXISTS "Guests can view own profile" ON public.guests;

-- 2) Recreate policy using JWT email claim and has_role()
CREATE POLICY "Guests can view own profile"
ON public.guests
FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
  OR (
    -- Hosts: can view guests who have bookings in their rooms
    id IN (
      SELECT DISTINCT g.id
      FROM public.guests g
      JOIN public.bookings b ON b.guest_email = g.email
      JOIN public.rooms r ON r.id = b.room_id
      WHERE public.has_role(auth.uid(), 'host'::app_role)
        AND r.host_email = (current_setting('request.jwt.claims', true)::json->>'email')
    )
  )
  OR (
    -- Guests: can view their own profile by email
    (current_setting('request.jwt.claims', true)::json->>'email') = email
  )
);
