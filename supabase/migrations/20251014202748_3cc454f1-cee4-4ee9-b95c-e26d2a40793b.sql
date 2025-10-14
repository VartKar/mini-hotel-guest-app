-- Create travel-services storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('travel-services', 'travel-services', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for travel-services bucket
CREATE POLICY "Travel service images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'travel-services');

CREATE POLICY "Admin can upload travel service images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'travel-services');

CREATE POLICY "Admin can update travel service images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'travel-services');

CREATE POLICY "Admin can delete travel service images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'travel-services');