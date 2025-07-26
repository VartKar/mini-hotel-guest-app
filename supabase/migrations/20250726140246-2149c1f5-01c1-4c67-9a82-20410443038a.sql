
-- Создаем таблицу для доступа по номерам
CREATE TABLE public.room_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id TEXT NOT NULL UNIQUE, -- Уникальный ID номера (property_id + room_number)
  property_id TEXT NOT NULL,
  room_number TEXT NOT NULL,
  apartment_name TEXT,
  access_token TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL DEFAULT 'Сочи',
  
  -- Базовая информация о номере
  wifi_network TEXT,
  wifi_password TEXT,
  checkout_time TEXT,
  main_image_url TEXT,
  room_image_url TEXT,
  
  -- Инструкции для номера
  ac_instructions TEXT,
  coffee_instructions TEXT,
  tv_instructions TEXT,
  safe_instructions TEXT,
  parking_info TEXT,
  extra_bed_info TEXT,
  notes_for_guests TEXT,
  
  -- Информация о хосте
  host_name TEXT,
  host_phone TEXT,
  host_email TEXT,
  property_manager_name TEXT,
  property_manager_phone TEXT,
  property_manager_email TEXT,
  
  -- Управление доступом
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Составной уникальный ключ для property_id + room_number
  UNIQUE(property_id, room_number)
);

-- Добавляем RLS
ALTER TABLE public.room_access ENABLE ROW LEVEL SECURITY;

-- Админы могут все
CREATE POLICY "Admin can manage room access" 
  ON public.room_access 
  FOR ALL 
  USING (true);

-- Публичный доступ по токену для активных номеров
CREATE POLICY "Public access by token" 
  ON public.room_access 
  FOR SELECT 
  USING (is_active = true);

-- Создаем таблицу для регистрации гостей в номерах
CREATE TABLE public.room_guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_access_id UUID NOT NULL REFERENCES room_access(id) ON DELETE CASCADE,
  guest_email TEXT,
  guest_phone TEXT,
  guest_name TEXT,
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_access_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Один email/телефон может быть только в одном активном номере
  UNIQUE(guest_email),
  UNIQUE(guest_phone)
);

-- Добавляем RLS для гостей
ALTER TABLE public.room_guests ENABLE ROW LEVEL SECURITY;

-- Админы могут все
CREATE POLICY "Admin can manage room guests" 
  ON public.room_guests 
  FOR ALL 
  USING (true);

-- Публичный доступ для создания регистрации
CREATE POLICY "Public can register as guest" 
  ON public.room_guests 
  FOR INSERT 
  WITH CHECK (true);

-- Гости могут видеть только свою регистрацию
CREATE POLICY "Guests can view their own registration" 
  ON public.room_guests 
  FOR SELECT 
  USING (guest_email = current_setting('request.jwt.claims', true)::json ->> 'email' OR 
         guest_phone = current_setting('request.jwt.claims', true)::json ->> 'phone');

-- Создаем индексы для производительности
CREATE INDEX idx_room_access_token ON room_access(access_token);
CREATE INDEX idx_room_access_room_id ON room_access(room_id);
CREATE INDEX idx_room_guests_email ON room_guests(guest_email);
CREATE INDEX idx_room_guests_phone ON room_guests(guest_phone);
