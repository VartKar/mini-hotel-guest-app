-- Add wants_bonus_discount flag to shop_orders table
ALTER TABLE public.shop_orders
ADD COLUMN wants_bonus_discount boolean NOT NULL DEFAULT false;

-- Add wants_bonus_discount flag to travel_service_orders table
ALTER TABLE public.travel_service_orders
ADD COLUMN wants_bonus_discount boolean NOT NULL DEFAULT false;