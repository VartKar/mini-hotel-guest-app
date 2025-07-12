
-- Add image_url column to hotel_services table
ALTER TABLE public.hotel_services 
ADD COLUMN image_url text;

-- Add image_url column to shop_items table  
ALTER TABLE public.shop_items 
ADD COLUMN image_url text;

-- Add image_url column to travel_services table
ALTER TABLE public.travel_services 
ADD COLUMN image_url text;

-- Update hotel_services with placeholder images
UPDATE public.hotel_services 
SET image_url = CASE 
  WHEN category = 'cleaning' THEN 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop'
  WHEN category = 'food' THEN 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop'
  WHEN category = 'laundry' THEN 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop'
  WHEN category = 'spa' THEN 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop'
  ELSE 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop'
END;

-- Update shop_items with placeholder images
UPDATE public.shop_items 
SET image_url = CASE 
  WHEN category = 'Сувениры' THEN 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop'
  WHEN category = 'Мини-бар' THEN 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop'
  WHEN category = 'Локальные продукты' THEN 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop'
  ELSE 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop'
END;

-- Update travel_services with placeholder images
UPDATE public.travel_services 
SET image_url = CASE 
  WHEN category = 'Экскурсии' THEN 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop'
  WHEN category = 'Развлечения' THEN 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop'
  WHEN category = 'Активный отдых' THEN 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop'
  WHEN category = 'Гастрономия' THEN 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop'
  WHEN category = 'Здоровье' THEN 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop'
  ELSE 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop'
END;

-- Insert property pricing for hotel services for prop_1002
INSERT INTO public.property_service_pricing (property_id, travel_service_id, price_override, is_available)
SELECT 'prop_1002', id, base_price, true
FROM public.travel_services
WHERE is_active = true;

-- Insert property pricing for shop items for prop_1002  
INSERT INTO public.property_item_pricing (property_id, shop_item_id, price_override, is_available)
SELECT 'prop_1002', id, base_price, true
FROM public.shop_items
WHERE is_active = true;

-- Note: We still need to add hotel_service_id column to property_service_pricing for hotel services
-- But let's first see if the above resolves the immediate issue
