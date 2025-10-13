-- Create restaurant_recommendations table
CREATE TABLE public.restaurant_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cuisine_type TEXT,
  city TEXT NOT NULL DEFAULT 'Сочи',
  category TEXT, -- breakfast, lunch, dinner, universal
  image_url TEXT,
  price_range TEXT, -- ₽, ₽₽, ₽₽₽
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add restaurant_id to travel_itineraries
ALTER TABLE public.travel_itineraries
ADD COLUMN restaurant_id UUID REFERENCES public.restaurant_recommendations(id);

-- Enable RLS
ALTER TABLE public.restaurant_recommendations ENABLE ROW LEVEL SECURITY;

-- Allow public to view active restaurants
CREATE POLICY "Public can view active restaurants"
ON public.restaurant_recommendations
FOR SELECT
USING (is_active = true);

-- Allow admin to manage restaurants
CREATE POLICY "Admin can manage restaurants"
ON public.restaurant_recommendations
FOR ALL
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_restaurant_recommendations_updated_at
BEFORE UPDATE ON public.restaurant_recommendations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for better performance
CREATE INDEX idx_restaurant_recommendations_city ON public.restaurant_recommendations(city);
CREATE INDEX idx_restaurant_recommendations_active ON public.restaurant_recommendations(is_active);