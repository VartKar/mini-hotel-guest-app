
-- Create RLS policies for admin access to the combined table
-- Policy for admins to view all bookings
CREATE POLICY "Admins can view all bookings"
ON public.combined
FOR SELECT
TO authenticated
USING (true);

-- Policy for admins to update all bookings
CREATE POLICY "Admins can update all bookings"
ON public.combined
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy for admins to insert new bookings
CREATE POLICY "Admins can insert bookings"
ON public.combined
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy for admins to delete bookings
CREATE POLICY "Admins can delete bookings"
ON public.combined
FOR DELETE
TO authenticated
USING (true);

-- Also allow anonymous access for certain operations (for host access)
CREATE POLICY "Anonymous can view visible bookings"
ON public.combined
FOR SELECT
TO anon
USING (
  visible_to_hosts = true
  AND is_archived = false
);
