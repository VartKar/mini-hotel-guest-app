
-- Create table for travel service orders
CREATE TABLE public.travel_service_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id_key UUID REFERENCES public.combined(id_key),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_comment TEXT,
  selected_services JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  order_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for shop orders
CREATE TABLE public.shop_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id_key UUID REFERENCES public.combined(id_key),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  room_number TEXT,
  ordered_items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  order_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to both tables
ALTER TABLE public.travel_service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for travel_service_orders (allow admin access and public insert)
CREATE POLICY "Allow public insert for travel service orders" 
  ON public.travel_service_orders 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow admin access to travel service orders" 
  ON public.travel_service_orders 
  FOR ALL 
  USING (true);

-- Create policies for shop_orders (allow admin access and public insert)
CREATE POLICY "Allow public insert for shop orders" 
  ON public.shop_orders 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow admin access to shop orders" 
  ON public.shop_orders 
  FOR ALL 
  USING (true);

-- Add indexes for better performance
CREATE INDEX idx_travel_service_orders_booking_id ON public.travel_service_orders(booking_id_key);
CREATE INDEX idx_travel_service_orders_status ON public.travel_service_orders(order_status);
CREATE INDEX idx_travel_service_orders_created_at ON public.travel_service_orders(created_at DESC);

CREATE INDEX idx_shop_orders_booking_id ON public.shop_orders(booking_id_key);
CREATE INDEX idx_shop_orders_status ON public.shop_orders(order_status);
CREATE INDEX idx_shop_orders_created_at ON public.shop_orders(created_at DESC);
