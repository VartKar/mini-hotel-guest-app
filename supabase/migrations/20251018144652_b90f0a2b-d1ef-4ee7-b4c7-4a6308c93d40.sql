-- Add is_default_guest field to bookings table
ALTER TABLE public.bookings 
ADD COLUMN is_default_guest boolean NOT NULL DEFAULT false;

-- Create default bookings for all active rooms
INSERT INTO public.bookings (
  room_id,
  guest_name,
  guest_email,
  booking_id,
  booking_status,
  visible_to_guests,
  visible_to_hosts,
  visible_to_admin,
  is_archived,
  is_default_guest,
  access_token,
  check_in_date,
  check_out_date,
  number_of_guests
)
SELECT 
  r.id,
  'Гость комнаты ' || r.room_number,
  'guest.room' || r.room_number || '@default.local',
  'DEFAULT-' || r.property_id || '-' || r.room_number,
  'confirmed',
  true,
  true,
  true,
  false,
  true,
  encode(gen_random_bytes(32), 'hex'),
  NULL,
  NULL,
  1
FROM public.rooms r
WHERE r.is_active = true
ON CONFLICT DO NOTHING;