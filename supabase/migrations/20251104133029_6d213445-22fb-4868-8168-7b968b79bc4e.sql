-- Allow hosts to view shop orders for their guests
CREATE POLICY "Hosts can view shop orders for their guests"
ON public.shop_orders
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'host')
  AND booking_id_key IN (
    SELECT b.id
    FROM public.bookings b
    JOIN public.rooms r ON r.id = b.room_id
    WHERE LOWER(TRIM(r.host_email)) = LOWER(TRIM((current_setting('request.jwt.claims', true)::json ->> 'email')))
  )
);

-- Allow hosts to view travel service orders for their guests
CREATE POLICY "Hosts can view travel orders for their guests"
ON public.travel_service_orders
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'host')
  AND booking_id_key IN (
    SELECT b.id
    FROM public.bookings b
    JOIN public.rooms r ON r.id = b.room_id
    WHERE LOWER(TRIM(r.host_email)) = LOWER(TRIM((current_setting('request.jwt.claims', true)::json ->> 'email')))
  )
);