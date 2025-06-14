
-- Create RLS policies for admin access to the combined table
-- First, enable RLS on the combined table if not already enabled
ALTER TABLE public.combined ENABLE ROW LEVEL SECURITY;

-- Policy for admin to view all records
CREATE POLICY "Admin can view all records"
ON public.combined
FOR SELECT
TO anon
USING (true);

-- Policy for admin to update all records
CREATE POLICY "Admin can update all records"
ON public.combined
FOR UPDATE
TO anon
USING (true);

-- Policy for admin to insert records
CREATE POLICY "Admin can insert records"
ON public.combined
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy for admin to delete records
CREATE POLICY "Admin can delete records"
ON public.combined
FOR DELETE
TO anon
USING (true);
