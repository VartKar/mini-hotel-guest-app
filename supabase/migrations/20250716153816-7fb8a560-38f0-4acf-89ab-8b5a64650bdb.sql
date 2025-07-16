
-- Генерируем токены для всех существующих бронирований, где токен отсутствует
UPDATE combined 
SET access_token = CONCAT(
  SUBSTRING(MD5(RANDOM()::TEXT), 1, 8),
  '-',
  SUBSTRING(MD5(RANDOM()::TEXT), 1, 4),
  '-',
  SUBSTRING(MD5(RANDOM()::TEXT), 1, 4),
  '-',
  SUBSTRING(MD5(RANDOM()::TEXT), 1, 12)
)
WHERE access_token IS NULL OR access_token = '';

-- Проверяем результат
SELECT 
  id_key,
  guest_name,
  room_number,
  access_token,
  CONCAT('https://your-domain.com/guest/', access_token) as guest_url
FROM combined 
WHERE access_token IS NOT NULL 
ORDER BY guest_name;
