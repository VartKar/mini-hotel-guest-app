-- Add partner_link column to restaurant_recommendations
ALTER TABLE public.restaurant_recommendations 
ADD COLUMN IF NOT EXISTS partner_link TEXT;

-- Add partner links to existing restaurants
UPDATE public.restaurant_recommendations SET partner_link = 'https://partner.link/la-luna?ref=guestapp' WHERE name = 'La Luna';
UPDATE public.restaurant_recommendations SET partner_link = 'https://partner.link/nino?ref=guestapp' WHERE name = 'Nino Restaurant';
UPDATE public.restaurant_recommendations SET partner_link = 'https://partner.link/delmar?ref=guestapp' WHERE name = 'Del Mar';
UPDATE public.restaurant_recommendations SET partner_link = 'https://partner.link/prichal?ref=guestapp' WHERE name = 'Причал';
UPDATE public.restaurant_recommendations SET partner_link = 'https://partner.link/mayak?ref=guestapp' WHERE name = 'Маяк';
UPDATE public.restaurant_recommendations SET partner_link = 'https://partner.link/baran-rapan?ref=guestapp' WHERE name = 'Баран-Рапан';
UPDATE public.restaurant_recommendations SET partner_link = 'https://partner.link/fettuccine?ref=guestapp' WHERE name = 'Феттучине';
UPDATE public.restaurant_recommendations SET partner_link = 'https://partner.link/hinkalnaya?ref=guestapp' WHERE name = 'Хинкальная';

-- Link restaurants to remaining itineraries
UPDATE public.travel_itineraries 
SET restaurant_id = (SELECT id FROM public.restaurant_recommendations WHERE name = 'Del Mar' LIMIT 1)
WHERE activity_title = 'Свободный день' AND booking_id_key IS NULL;

UPDATE public.travel_itineraries 
SET restaurant_id = (SELECT id FROM public.restaurant_recommendations WHERE name = 'Феттучине' LIMIT 1)
WHERE activity_title = 'Шоппинг и сувениры' AND booking_id_key IS NULL;

UPDATE public.travel_itineraries 
SET restaurant_id = (SELECT id FROM public.restaurant_recommendations WHERE name = 'Причал' LIMIT 1)
WHERE activity_title = 'Водные развлечения' AND booking_id_key IS NULL;

UPDATE public.travel_itineraries 
SET restaurant_id = (SELECT id FROM public.restaurant_recommendations WHERE name = 'Маяк' LIMIT 1)
WHERE activity_title = 'Фотосессия' AND booking_id_key IS NULL;

UPDATE public.travel_itineraries 
SET restaurant_id = (SELECT id FROM public.restaurant_recommendations WHERE name = 'Баран-Рапан' LIMIT 1)
WHERE activity_title = 'Винные дегустации' AND booking_id_key IS NULL;

UPDATE public.travel_itineraries 
SET restaurant_id = (SELECT id FROM public.restaurant_recommendations WHERE name = 'Nino Restaurant' LIMIT 1)
WHERE activity_title = 'Прощальная прогулка' AND booking_id_key IS NULL;