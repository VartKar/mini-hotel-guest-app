
-- Add customer_comment field to shop_orders table
ALTER TABLE public.shop_orders 
ADD COLUMN IF NOT EXISTS customer_comment text;
