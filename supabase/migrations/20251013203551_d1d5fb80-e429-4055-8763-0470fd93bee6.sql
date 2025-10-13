-- Insert restaurant recommendations for Adler/Sochi
INSERT INTO public.restaurant_recommendations (name, description, cuisine_type, city, category, price_range, is_active) VALUES
('La Luna', 'Богатый выбор блюд кавказской, европейской и русской кухни. Особая гордость — сочные мясные блюда на гриле', 'Кавказская, Европейская', 'Сочи', 'универсальное', '₽₽', true),
('Nino Restaurant', 'Уютный ресторан с аутентичной грузинской кухней. Домашняя атмосфера и традиционные рецепты', 'Грузинская', 'Сочи', 'обед', '₽₽', true),
('Del Mar', 'Ресторан на набережной с прекрасным видом на море. Средиземноморская кухня и свежие морепродукты', 'Средиземноморская', 'Сочи', 'ужин', '₽₽₽', true),
('Причал', 'Популярное место с панорамным видом на море. Европейская кухня и свежая рыба', 'Европейская, Морепродукты', 'Сочи', 'обед', '₽₽', true),
('Маяк', 'Семейный ресторан с домашней кухней и приятной атмосферой', 'Русская, Европейская', 'Сочи', 'завтрак', '₽', true),
('Баран-Рапан', 'Известная траттория с итальянской кухней и прекрасной террасой', 'Итальянская', 'Сочи', 'ужин', '₽₽', true),
('Феттучине', 'Итальянская траттория с аутентичными блюдами и уютной атмосферой', 'Итальянская', 'Сочи', 'универсальное', '₽₽', true),
('Хинкальная', 'Традиционная грузинская кухня. Свежие хинкали и хачапури', 'Грузинская', 'Сочи', 'обед', '₽', true);

-- Link restaurants to travel itineraries
UPDATE public.travel_itineraries 
SET restaurant_id = (SELECT id FROM public.restaurant_recommendations WHERE name = 'Маяк' LIMIT 1)
WHERE activity_title = 'Активный отдых' AND booking_id_key IS NULL;

UPDATE public.travel_itineraries 
SET restaurant_id = (SELECT id FROM public.restaurant_recommendations WHERE name = 'Nino Restaurant' LIMIT 1)
WHERE activity_title = 'Исторический центр' AND booking_id_key IS NULL;

UPDATE public.travel_itineraries 
SET restaurant_id = (SELECT id FROM public.restaurant_recommendations WHERE name = 'Причал' LIMIT 1)
WHERE activity_title = 'Морская экскурсия' AND booking_id_key IS NULL;

UPDATE public.travel_itineraries 
SET restaurant_id = (SELECT id FROM public.restaurant_recommendations WHERE name = 'La Luna' LIMIT 1)
WHERE activity_title = 'Гастрономический тур' AND booking_id_key IS NULL;

UPDATE public.travel_itineraries 
SET restaurant_id = (SELECT id FROM public.restaurant_recommendations WHERE name = 'Баран-Рапан' LIMIT 1)
WHERE activity_title = 'Культурная программа' AND booking_id_key IS NULL;

UPDATE public.travel_itineraries 
SET restaurant_id = (SELECT id FROM public.restaurant_recommendations WHERE name = 'Del Mar' LIMIT 1)
WHERE activity_title = 'Пляжный отдых' AND booking_id_key IS NULL;

UPDATE public.travel_itineraries 
SET restaurant_id = (SELECT id FROM public.restaurant_recommendations WHERE name = 'Феттучине' LIMIT 1)
WHERE activity_title = 'Релакс и спа' AND booking_id_key IS NULL;

UPDATE public.travel_itineraries 
SET restaurant_id = (SELECT id FROM public.restaurant_recommendations WHERE name = 'Хинкальная' LIMIT 1)
WHERE activity_title = 'Горный маршрут' AND booking_id_key IS NULL;

UPDATE public.travel_itineraries 
SET restaurant_id = (SELECT id FROM public.restaurant_recommendations WHERE name = 'La Luna' LIMIT 1)
WHERE activity_title = 'Парки и сады' AND booking_id_key IS NULL;

UPDATE public.travel_itineraries 
SET restaurant_id = (SELECT id FROM public.restaurant_recommendations WHERE name = 'Причал' LIMIT 1)
WHERE activity_title = 'Окрестности города' AND booking_id_key IS NULL;