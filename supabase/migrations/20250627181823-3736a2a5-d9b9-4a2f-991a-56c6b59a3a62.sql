
-- Create a hotel_services table for hotel services (separate from travel_services)
CREATE TABLE IF NOT EXISTS public.hotel_services (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL, -- 'cleaning', 'food', 'laundry', 'spa', etc.
  base_price numeric DEFAULT 0, -- Some services might be free
  city text NOT NULL DEFAULT 'Сочи',
  has_details boolean DEFAULT false, -- Whether this service has detailed menu/info
  details_content text, -- Detailed menu or service information
  icon_type text DEFAULT 'Bed', -- Icon identifier for frontend
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert the basic hotel services only if the table is empty
INSERT INTO public.hotel_services (title, description, category, base_price, has_details, details_content, icon_type) 
SELECT * FROM (VALUES
  ('Уборка номера', 'Заказать дополнительную уборку номера или замену полотенец.', 'cleaning', 0, false, null, 'Bed'),
  ('Еда в номер', 'Широкий выбор блюд и напитков с доставкой в ваш номер.', 'food', 0, true, 
'**МЕНЮ ДОСТАВКИ В НОМЕР**

**Завтраки (8:00-11:00)**
• Континентальный завтрак - 850₽
• Омлет с беконом - 450₽
• Блинчики с медом - 380₽
• Каша овсяная - 250₽

**Обеды и ужины (12:00-22:00)**
• Борщ украинский - 320₽
• Стейк из говядины - 1200₽
• Паста карбонара - 680₽
• Салат Цезарь - 520₽

**Напитки**
• Кофе американо - 180₽
• Чай травяной - 150₽
• Сок апельсиновый - 220₽
• Вода минеральная - 120₽

**Десерты**
• Тирамису - 420₽
• Мороженое - 280₽
• Фруктовая тарелка - 350₽

*Доставка в номер бесплатно при заказе от 500₽*', 'UtensilsCrossed'),
  ('Услуги прачечной', 'Стирка и глажка вашей одежды в течение дня.', 'laundry', 0, false, null, 'Shirt'),
  ('Спа-услуги', 'Расслабляющие процедуры и массаж в номере или спа-центре.', 'spa', 0, true,
'**СПА-УСЛУГИ**

**Массаж**
• Классический массаж (60 мин) - 2500₽
• Расслабляющий массаж (90 мин) - 3200₽
• Массаж стоп (30 мин) - 1200₽
• Антицеллюлитный массаж (60 мин) - 2800₽

**Процедуры для лица**
• Очищающая маска - 1500₽
• Увлажняющая процедура - 1800₽
• Антивозрастной уход - 2200₽

**Процедуры для тела**
• Скраб для тела - 1600₽
• Обертывание водорослями - 2000₽
• Ароматерапия - 1400₽

**Специальные предложения**
• Скидка 10% по средам на все услуги
• Парный массаж - скидка 15%
• Комплекс "Релакс" (3 процедуры) - 5500₽

*Процедуры доступны в спа-центре или в номере по запросу*', 'Award')
) AS new_services(title, description, category, base_price, has_details, details_content, icon_type)
WHERE NOT EXISTS (SELECT 1 FROM public.hotel_services LIMIT 1);

-- Create indexes for performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_hotel_services_city ON public.hotel_services(city);
CREATE INDEX IF NOT EXISTS idx_hotel_services_category ON public.hotel_services(category);
