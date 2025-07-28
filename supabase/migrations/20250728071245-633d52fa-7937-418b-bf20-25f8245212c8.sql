
-- First, let's create the new clean structure

-- 1. Create rooms table for static room configuration
CREATE TABLE public.rooms (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_number text NOT NULL,
  apartment_name text,
  property_id text NOT NULL,
  city text NOT NULL DEFAULT 'Сочи',
  wifi_network text,
  wifi_password text,
  checkout_time text,
  main_image_url text,
  room_image_url text,
  ac_instructions text,
  coffee_instructions text,
  tv_instructions text,
  safe_instructions text,
  parking_info text,
  extra_bed_info text,
  notes_for_guests text,
  host_name text,
  host_phone text,
  host_email text,
  property_manager_name text,
  property_manager_phone text,
  property_manager_email text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(room_number, property_id)
);

-- 2. Create bookings table for booking instances
CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id text UNIQUE,
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  guest_phone text,
  number_of_guests integer DEFAULT 2,
  check_in_date date,
  check_out_date date,
  stay_duration text,
  booking_status text NOT NULL DEFAULT 'confirmed',
  access_token text UNIQUE,
  notes_internal text,
  visible_to_guests boolean NOT NULL DEFAULT true,
  visible_to_hosts boolean NOT NULL DEFAULT true,
  visible_to_admin boolean NOT NULL DEFAULT true,
  is_archived boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  last_updated_by text,
  last_updated_at timestamp with time zone DEFAULT now()
);

-- 3. Create guest_sessions table for active sessions (both registered and walk-in)
CREATE TABLE public.guest_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token text UNIQUE NOT NULL,
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
  guest_name text NOT NULL,
  guest_email text,
  guest_phone text,
  session_type text NOT NULL CHECK (session_type IN ('registered', 'walk_in')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone,
  last_accessed_at timestamp with time zone DEFAULT now()
);

-- 4. Create indexes for better performance
CREATE INDEX idx_bookings_guest_email ON public.bookings(guest_email);
CREATE INDEX idx_bookings_access_token ON public.bookings(access_token);
CREATE INDEX idx_guest_sessions_session_token ON public.guest_sessions(session_token);
CREATE INDEX idx_guest_sessions_booking_id ON public.guest_sessions(booking_id);
CREATE INDEX idx_rooms_property_id ON public.rooms(property_id);

-- 5. Enable RLS on all tables
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_sessions ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for rooms
CREATE POLICY "Admin can manage rooms" ON public.rooms FOR ALL USING (true);
CREATE POLICY "Public can view active rooms" ON public.rooms FOR SELECT USING (is_active = true);

-- 7. Create RLS policies for bookings
CREATE POLICY "Admin can manage bookings" ON public.bookings FOR ALL USING (true);
CREATE POLICY "Guests can view their bookings by email" ON public.bookings 
  FOR SELECT USING (visible_to_guests = true AND is_archived = false);
CREATE POLICY "Token-based booking access" ON public.bookings 
  FOR SELECT USING (access_token IS NOT NULL AND access_token <> '' AND visible_to_guests = true AND is_archived = false);

-- 8. Create RLS policies for guest_sessions
CREATE POLICY "Admin can manage guest sessions" ON public.guest_sessions FOR ALL USING (true);
CREATE POLICY "Guests can view their own sessions" ON public.guest_sessions 
  FOR SELECT USING (is_active = true);
CREATE POLICY "Public can create sessions" ON public.guest_sessions 
  FOR INSERT WITH CHECK (true);

-- 9. Migrate existing data from combined table to new structure
INSERT INTO public.rooms (
  room_number, apartment_name, property_id, city, wifi_network, wifi_password,
  checkout_time, main_image_url, room_image_url, ac_instructions, coffee_instructions,
  tv_instructions, safe_instructions, parking_info, extra_bed_info, notes_for_guests,
  host_name, host_phone, host_email, property_manager_name, property_manager_phone,
  property_manager_email, created_at, updated_at
)
SELECT DISTINCT
  COALESCE(room_number, 'Unknown'),
  apartment_name,
  COALESCE(property_id, 'default'),
  COALESCE(city, 'Сочи'),
  wifi_network,
  wifi_password,
  checkout_time,
  main_image_url,
  room_image_url,
  ac_instructions,
  coffee_instructions,
  tv_instructions,
  safe_instructions,
  parking_info,
  extra_bed_info,
  notes_for_guests,
  host_name,
  host_phone,
  host_email,
  property_manager_name,
  property_manager_phone,
  property_manager_email,
  now(),
  now()
FROM public.combined
WHERE room_number IS NOT NULL;

-- 10. Migrate bookings data
INSERT INTO public.bookings (
  booking_id, room_id, guest_name, guest_email, number_of_guests,
  check_in_date, check_out_date, stay_duration, booking_status,
  access_token, notes_internal, visible_to_guests, visible_to_hosts,
  visible_to_admin, is_archived, created_at, updated_at,
  last_updated_by, last_updated_at
)
SELECT 
  c.booking_id,
  r.id,
  COALESCE(c.guest_name, 'Unknown Guest'),
  c.guest_email,
  COALESCE(c.number_of_guests, 2),
  CASE WHEN c.check_in_date ~ '^\d{4}-\d{2}-\d{2}' THEN c.check_in_date::date ELSE NULL END,
  CASE WHEN c.check_out_date ~ '^\d{4}-\d{2}-\d{2}' THEN c.check_out_date::date ELSE NULL END,
  c.stay_duration,
  COALESCE(c.booking_status, 'confirmed'),
  c.access_token,
  c.notes_internal,
  COALESCE(c.visible_to_guests, true),
  COALESCE(c.visible_to_hosts, true),
  COALESCE(c.visible_to_admin, true),
  COALESCE(c.is_archived, false),
  now(),
  COALESCE(c.last_updated_at::timestamp with time zone, now()),
  c.last_updated_by,
  COALESCE(c.last_updated_at::timestamp with time zone, now())
FROM public.combined c
JOIN public.rooms r ON r.room_number = COALESCE(c.room_number, 'Unknown') 
  AND r.property_id = COALESCE(c.property_id, 'default')
WHERE c.guest_email IS NOT NULL;

-- 11. Create view for backward compatibility (temporary)
CREATE OR REPLACE VIEW public.combined_view AS
SELECT 
  b.id as id_key,
  r.property_id,
  b.booking_id,
  b.guest_email,
  b.guest_name,
  r.room_number,
  b.stay_duration,
  b.check_in_date::text,
  b.check_out_date::text,
  r.wifi_network,
  r.wifi_password,
  r.checkout_time,
  r.room_image_url,
  r.ac_instructions,
  r.coffee_instructions,
  r.tv_instructions,
  r.safe_instructions,
  r.parking_info,
  r.extra_bed_info,
  r.apartment_name,
  r.host_name,
  r.host_email,
  r.host_phone,
  r.property_manager_name,
  r.property_manager_phone,
  r.property_manager_email,
  b.visible_to_guests,
  b.visible_to_hosts,
  b.visible_to_admin,
  b.is_archived,
  b.booking_status,
  b.last_updated_by,
  b.last_updated_at,
  b.notes_internal,
  r.notes_for_guests,
  r.main_image_url,
  r.city,
  b.number_of_guests,
  b.access_token
FROM public.bookings b
JOIN public.rooms r ON r.id = b.room_id;
