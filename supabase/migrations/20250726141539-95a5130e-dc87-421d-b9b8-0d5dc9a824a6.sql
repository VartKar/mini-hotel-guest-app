
-- Копируем существующие комнаты из таблицы combined в room_access
INSERT INTO public.room_access (
  room_id, property_id, room_number, apartment_name, access_token, city,
  wifi_network, wifi_password, checkout_time, main_image_url, room_image_url,
  ac_instructions, coffee_instructions, tv_instructions, safe_instructions,
  parking_info, extra_bed_info, notes_for_guests,
  host_name, host_phone, host_email,
  property_manager_name, property_manager_phone, property_manager_email
)
SELECT 
  COALESCE(property_id, 'unknown') || '-' || COALESCE(room_number, 'room') as room_id,
  COALESCE(property_id, 'unknown') as property_id,
  COALESCE(room_number, 'Номер') as room_number,
  apartment_name,
  -- Генерируем уникальные токены для каждой комнаты
  CASE 
    WHEN id_key IS NOT NULL THEN 
      substr(replace(id_key::text, '-', ''), 1, 16) || 
      substr(md5(random()::text), 1, 8)
    ELSE 
      substr(md5(random()::text), 1, 24)
  END as access_token,
  COALESCE(city, 'Сочи') as city,
  wifi_network,
  wifi_password,
  checkout_time,
  main_image_url,
  room_image_url,
  ac_instructions,
  coffee_instructions,
  tv_instructions,
  safe_instructions,
  parking_info,
  extra_bed_info,
  notes_for_guests,
  host_name,
  host_phone,
  host_email,
  property_manager_name,
  property_manager_phone,
  property_manager_email
FROM public.combined 
WHERE 
  visible_to_guests = true 
  AND is_archived = false 
  AND room_number IS NOT NULL
  AND room_number != ''
ON CONFLICT (property_id, room_number) DO NOTHING;
