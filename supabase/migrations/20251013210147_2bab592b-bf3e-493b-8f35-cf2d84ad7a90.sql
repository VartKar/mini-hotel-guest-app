-- Создаем публичный bucket для изображений товаров
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'shop-items', 
  'shop-items', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- Политика на чтение (публичная)
CREATE POLICY "Public can view shop item images"
ON storage.objects FOR SELECT
USING (bucket_id = 'shop-items');

-- Политика на загрузку (публичная для простоты, можно ограничить позже)
CREATE POLICY "Anyone can upload shop item images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'shop-items');

-- Политика на обновление (публичная)
CREATE POLICY "Anyone can update shop item images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'shop-items');

-- Политика на удаление (публичная)
CREATE POLICY "Anyone can delete shop item images"
ON storage.objects FOR DELETE
USING (bucket_id = 'shop-items');