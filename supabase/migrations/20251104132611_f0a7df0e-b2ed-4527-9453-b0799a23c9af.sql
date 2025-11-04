-- Allow hosts to view bookings for their rooms
CREATE POLICY "Hosts can view bookings for their rooms"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  visible_to_hosts = true 
  AND is_archived = false
  AND has_role(auth.uid(), 'host')
  AND EXISTS (
    SELECT 1 FROM public.rooms
    WHERE rooms.id = bookings.room_id
    AND LOWER(TRIM(rooms.host_email)) = LOWER(TRIM((current_setting('request.jwt.claims', true)::json ->> 'email')))
  )
);