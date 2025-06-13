
-- Update the specific record to contain default demonstration data
UPDATE public.combined SET
  guest_name = 'Иван',
  apartment_name = 'Апартаменты "Вальс"',
  main_image_url = 'https://i.postimg.cc/NFprr3hY/valse.png',
  room_number = '305',
  visible_to_guests = true,
  is_archived = false,
  booking_status = 'demo'
WHERE id_key = 'c10fe304-7db8-4ee3-a72a-f9dc5418ceac';

-- If the record doesn't exist, create it with default demo data
INSERT INTO public.combined (
  id_key,
  guest_name,
  apartment_name,
  main_image_url,
  room_number,
  visible_to_guests,
  is_archived,
  booking_status
)
SELECT 
  'c10fe304-7db8-4ee3-a72a-f9dc5418ceac',
  'Иван',
  'Апартаменты "Вальс"',
  'https://i.postimg.cc/NFprr3hY/valse.png',
  '305',
  true,
  false,
  'demo'
WHERE NOT EXISTS (
  SELECT 1 FROM public.combined WHERE id_key = 'c10fe304-7db8-4ee3-a72a-f9dc5418ceac'
);
