-- Add new hotel services: late checkout, early check-in, and flowers
INSERT INTO hotel_services (title, description, category, base_price, city, is_active, has_details, icon_type)
VALUES 
  ('Поздний выезд', 'Продление времени пребывания до 14:00', 'Услуги размещения', 2000, 'Сочи', true, false, 'Clock'),
  ('Ранний заезд', 'Заезд в номер с 10:00', 'Услуги размещения', 1500, 'Сочи', true, false, 'Clock'),
  ('Цветы в номер', 'Свежий букет цветов при заезде', 'Дополнительные услуги', 2000, 'Сочи', true, false, 'Flower');