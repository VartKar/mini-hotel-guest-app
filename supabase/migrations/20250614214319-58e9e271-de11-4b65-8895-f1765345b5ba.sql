
-- Create travel_itineraries table to store dynamic travel plans
CREATE TABLE public.travel_itineraries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id_key UUID REFERENCES public.combined(id_key) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  activity_title TEXT NOT NULL,
  activity_description TEXT,
  service_title TEXT,
  service_description TEXT,
  service_price NUMERIC(10,2),
  icon_type TEXT DEFAULT 'MapPin',
  is_service_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_travel_itineraries_booking_id ON public.travel_itineraries(booking_id_key);
CREATE INDEX idx_travel_itineraries_day_number ON public.travel_itineraries(booking_id_key, day_number);

-- Enable RLS
ALTER TABLE public.travel_itineraries ENABLE ROW LEVEL SECURITY;

-- RLS policies for travel_itineraries
CREATE POLICY "Admin can view all travel itineraries"
ON public.travel_itineraries
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Admin can update all travel itineraries"
ON public.travel_itineraries
FOR UPDATE
TO anon
USING (true);

CREATE POLICY "Admin can insert travel itineraries"
ON public.travel_itineraries
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Admin can delete travel itineraries"
ON public.travel_itineraries
FOR DELETE
TO anon
USING (true);

-- Insert some default travel itinerary templates
INSERT INTO public.travel_itineraries (booking_id_key, day_number, activity_title, activity_description, service_title, service_description, service_price, icon_type) VALUES
-- These will be used as templates (booking_id_key will be NULL for templates)
(NULL, 1, 'Исторический центр', 'Посещение главных достопримечательностей исторического центра города.', 'Индивидуальный гид', 'Профессиональный гид с глубокими знаниями истории города. 2 часа.', 2000.00, 'MapPin'),
(NULL, 2, 'Морская экскурсия', 'Прогулка на катере вдоль живописного побережья.', 'Аренда частного катера', 'Комфортабельный катер с капитаном на 4 часа. Напитки включены.', 8000.00, 'Compass'),
(NULL, 3, 'Горный маршрут', 'Поездка в горы с посещением смотровых площадок.', 'Джип-тур в горы', 'Полный день на джипе с опытным водителем. Обед включен.', 5500.00, 'Sun');
