-- Create update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Phase 1: Create guests table
CREATE TABLE public.guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  loyalty_points INTEGER NOT NULL DEFAULT 0,
  loyalty_tier TEXT NOT NULL DEFAULT 'Стандарт',
  total_spent NUMERIC NOT NULL DEFAULT 0,
  email_subscribed BOOLEAN NOT NULL DEFAULT true,
  email_preferences JSONB DEFAULT '{"marketing": true, "transactional": true, "newsletters": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin can manage guests"
ON public.guests
FOR ALL
USING (true);

CREATE POLICY "Guests can view their own profile by email"
ON public.guests
FOR SELECT
USING (true);

-- Indexes for performance
CREATE INDEX idx_guests_email ON public.guests(email);
CREATE INDEX idx_guests_phone ON public.guests(phone);
CREATE INDEX idx_guests_loyalty_tier ON public.guests(loyalty_tier);

-- Trigger for updated_at
CREATE TRIGGER update_guests_updated_at
BEFORE UPDATE ON public.guests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Phase 2: Populate with existing data from bookings
INSERT INTO public.guests (email, name, phone, created_at)
SELECT DISTINCT ON (guest_email)
  guest_email,
  guest_name,
  guest_phone,
  MIN(created_at) OVER (PARTITION BY guest_email) as created_at
FROM public.bookings
WHERE guest_email IS NOT NULL 
  AND guest_email != ''
  AND guest_name IS NOT NULL
ORDER BY guest_email, created_at
ON CONFLICT (email) DO NOTHING;

-- Calculate total_spent from shop_orders
UPDATE public.guests g
SET total_spent = COALESCE((
  SELECT SUM(so.total_amount)
  FROM public.shop_orders so
  JOIN public.bookings b ON b.id = so.booking_id_key
  WHERE b.guest_email = g.email
), 0);

-- Add total from travel_service_orders
UPDATE public.guests g
SET total_spent = total_spent + COALESCE((
  SELECT SUM(tso.total_amount)
  FROM public.travel_service_orders tso
  JOIN public.bookings b ON b.id = tso.booking_id_key
  WHERE b.guest_email = g.email
), 0);

-- Assign loyalty tiers based on total_spent
UPDATE public.guests
SET loyalty_tier = CASE
  WHEN total_spent >= 100000 THEN 'Платина'
  WHEN total_spent >= 50000 THEN 'Золото'
  WHEN total_spent >= 20000 THEN 'Серебро'
  ELSE 'Стандарт'
END;

-- Calculate initial loyalty points (1 point per 100 rubles spent)
UPDATE public.guests
SET loyalty_points = FLOOR(total_spent / 100)::INTEGER;