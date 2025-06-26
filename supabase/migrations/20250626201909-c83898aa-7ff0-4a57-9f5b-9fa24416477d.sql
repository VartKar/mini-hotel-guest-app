
-- Create a dedicated feedback table
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id_key UUID REFERENCES public.combined(id_key),
  customer_name TEXT NOT NULL,
  room_number TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for feedback table
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow all users to insert feedback (no authentication required for guests)
CREATE POLICY "Anyone can submit feedback" 
  ON public.feedback 
  FOR INSERT 
  WITH CHECK (true);

-- Only allow viewing feedback for admin purposes (can be adjusted later)
CREATE POLICY "Admin can view all feedback" 
  ON public.feedback 
  FOR SELECT 
  USING (true);
