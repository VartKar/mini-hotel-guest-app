
-- Проверяем все записи в таблице room_access
SELECT id, room_id, property_id, room_number, apartment_name, access_token, city, is_active
FROM room_access
ORDER BY created_at DESC;
