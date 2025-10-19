-- Add marketing fields to guests table
ALTER TABLE public.guests
ADD COLUMN guest_type text,
ADD COLUMN booking_source text,
ADD COLUMN preferred_categories jsonb DEFAULT '[]'::jsonb,
ADD COLUMN last_visit_date timestamp with time zone;

-- Add comment for clarity
COMMENT ON COLUMN public.guests.guest_type IS 'Type of guest: solo, couple, family, group';
COMMENT ON COLUMN public.guests.booking_source IS 'Booking source: booking.com, airbnb, direct, referral';
COMMENT ON COLUMN public.guests.preferred_categories IS 'Array of preferred service categories for personalization';
COMMENT ON COLUMN public.guests.last_visit_date IS 'Date of last visit for engagement tracking';