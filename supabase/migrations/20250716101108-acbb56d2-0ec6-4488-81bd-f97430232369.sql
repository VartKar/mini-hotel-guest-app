
-- Add access_token field to combined table for link-based authentication
ALTER TABLE public.combined 
ADD COLUMN IF NOT EXISTS access_token text UNIQUE;

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_combined_access_token ON public.combined(access_token);

-- Add RLS policy for token-based access
CREATE POLICY "Token-based guest access" 
ON public.combined 
FOR SELECT 
USING (
  (access_token IS NOT NULL AND access_token != '') AND
  (visible_to_guests = true) AND 
  (is_archived = false) AND 
  (booking_status IN ('confirmed', 'pending', 'demo'))
);
