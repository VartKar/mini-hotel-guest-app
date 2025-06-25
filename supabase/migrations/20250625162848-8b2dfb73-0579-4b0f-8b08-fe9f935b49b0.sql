
-- Phase 1: Add number_of_guests to combined table
ALTER TABLE public.combined 
ADD COLUMN number_of_guests integer DEFAULT 2;

-- Phase 2: Create new tables for items and services system

-- Create shop_items table (city-based templates)
CREATE TABLE public.shop_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  base_price numeric NOT NULL,
  city text NOT NULL DEFAULT 'Сочи',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create travel_services table (separate from travel_itineraries for service templates)
CREATE TABLE public.travel_services (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  category text,
  base_price numeric NOT NULL,
  city text NOT NULL DEFAULT 'Сочи',
  duration_hours integer,
  difficulty_level text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create property_item_pricing table (property-specific price overrides for shop items)
CREATE TABLE public.property_item_pricing (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id text NOT NULL,
  shop_item_id uuid NOT NULL REFERENCES public.shop_items(id) ON DELETE CASCADE,
  price_override numeric NOT NULL,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(property_id, shop_item_id)
);

-- Create property_service_pricing table (property-specific price overrides for travel services)
CREATE TABLE public.property_service_pricing (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id text NOT NULL,
  travel_service_id uuid NOT NULL REFERENCES public.travel_services(id) ON DELETE CASCADE,
  price_override numeric NOT NULL,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(property_id, travel_service_id)
);

-- Insert sample shop items for Сочи
INSERT INTO public.shop_items (name, description, category, base_price, city) VALUES
('Магнит ''Морская Звезда''', 'Сувенирный магнит с символикой Сочи', 'Сувениры', 250, 'Сочи'),
('Футболка с логотипом', 'Качественная футболка с логотипом отеля', 'Сувениры', 1200, 'Сочи'),
('Пляжная сумка', 'Удобная сумка для пляжного отдыха', 'Сувениры', 850, 'Сочи'),
('Вода (негазированная)', 'Питьевая вода 0.5л', 'Мини-бар', 120, 'Сочи'),
('Ассорти орехов', 'Смесь различных орехов', 'Мини-бар', 280, 'Сочи'),
('Шоколад', 'Молочный шоколад премиум класса', 'Мини-бар', 200, 'Сочи'),
('Домашнее варенье', 'Варенье из местных фруктов', 'Локальные продукты', 350, 'Сочи'),
('Местный сыр', 'Сыр от местных производителей', 'Локальные продукты', 450, 'Сочи'),
('Вино из местных сортов', 'Вино из винограда Краснодарского края', 'Локальные продукты', 1500, 'Сочи');

-- Insert sample travel services for Сочи
INSERT INTO public.travel_services (title, description, category, base_price, city, duration_hours, difficulty_level) VALUES
('Экскурсия по Дендрарию', 'Прогулка по знаменитому Сочинскому дендрарию', 'Экскурсии', 800, 'Сочи', 3, 'Легкий'),
('Канатная дорога на Ахун', 'Поездка на смотровую башню Ахун', 'Развлечения', 600, 'Сочи', 2, 'Легкий'),
('Рафтинг по реке Мзымта', 'Сплав по горной реке с инструктором', 'Активный отдых', 2500, 'Сочи', 4, 'Сложный'),
('Дегустация вин', 'Дегустация местных вин с закусками', 'Гастрономия', 1200, 'Сочи', 2, 'Легкий'),
('Конная прогулка', 'Верховая езда по живописным местам', 'Активный отдых', 1800, 'Сочи', 3, 'Средний'),
('Спа-процедуры', 'Релакс в спа-центре отеля', 'Здоровье', 3500, 'Сочи', 4, 'Легкий');

-- Create indexes for better performance
CREATE INDEX idx_shop_items_city ON public.shop_items(city);
CREATE INDEX idx_shop_items_category ON public.shop_items(category);
CREATE INDEX idx_travel_services_city ON public.travel_services(city);
CREATE INDEX idx_travel_services_category ON public.travel_services(category);
CREATE INDEX idx_property_item_pricing_property ON public.property_item_pricing(property_id);
CREATE INDEX idx_property_service_pricing_property ON public.property_service_pricing(property_id);
