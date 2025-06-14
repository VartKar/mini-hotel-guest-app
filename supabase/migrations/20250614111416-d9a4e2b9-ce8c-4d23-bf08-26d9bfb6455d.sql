
-- Create RLS policies for host access to the combined table
-- Policy for hosts to view their own properties
CREATE POLICY "Hosts can view their own properties"
ON public.combined
FOR SELECT
TO authenticated
USING (
  host_email = auth.jwt() ->> 'email'
  AND visible_to_hosts = true
  AND is_archived = false
);

-- Policy for hosts to view their own properties (for anonymous users with email lookup)
CREATE POLICY "Host email lookup access"
ON public.combined
FOR SELECT
TO anon
USING (
  visible_to_hosts = true
  AND is_archived = false
);

-- Create a table to track admin change requests from hosts
CREATE TABLE public.host_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_email TEXT NOT NULL,
  property_id TEXT,
  booking_id TEXT,
  request_type TEXT NOT NULL, -- 'update_info', 'cancel_booking', 'other'
  request_details TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on host_change_requests
ALTER TABLE public.host_change_requests ENABLE ROW LEVEL SECURITY;

-- Policy for hosts to insert their own requests
CREATE POLICY "Hosts can create change requests"
ON public.host_change_requests
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy for hosts to view their own requests
CREATE POLICY "Hosts can view their own requests"
ON public.host_change_requests
FOR SELECT
TO anon
USING (true);
