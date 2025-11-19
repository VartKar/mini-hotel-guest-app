-- Allow public read access to service-images bucket
CREATE POLICY "Public can view service images"
ON storage.objects FOR SELECT
USING (bucket_id = 'service-images');

-- Allow anyone to upload service images (we'll rely on app-level validation)
CREATE POLICY "Anyone can upload service images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'service-images');

-- Allow anyone to update service images
CREATE POLICY "Anyone can update service images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'service-images');