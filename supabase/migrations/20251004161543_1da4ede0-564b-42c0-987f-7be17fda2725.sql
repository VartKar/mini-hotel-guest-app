-- Create the update function first (if it doesn't exist)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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