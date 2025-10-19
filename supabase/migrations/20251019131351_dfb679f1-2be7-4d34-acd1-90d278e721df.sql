-- Fill marketing data for existing guests with varied profiles

-- Couples (романтические пары)
UPDATE public.guests 
SET 
  guest_type = 'couple',
  booking_source = 'booking.com',
  preferred_categories = '["spa", "рестораны", "романтика"]'::jsonb,
  last_visit_date = (NOW() - INTERVAL '2 months')
WHERE email IN ('elena.sokolova@gmail.com', 'pavel.kozlov@gmail.com');

-- Families (семьи)
UPDATE public.guests 
SET 
  guest_type = 'family',
  booking_source = 'airbnb',
  preferred_categories = '["детские услуги", "экскурсии", "развлечения"]'::jsonb,
  last_visit_date = (NOW() - INTERVAL '4 months')
WHERE email IN ('dmitry.popov@mail.ru', 'natalia.fedorova@mail.ru', 'marina.kuznetsova@yandex.ru');

-- Solo travelers (одиночки)
UPDATE public.guests 
SET 
  guest_type = 'solo',
  booking_source = 'direct',
  preferred_categories = '["экскурсии", "рестораны", "фитнес"]'::jsonb,
  last_visit_date = (NOW() - INTERVAL '1 month')
WHERE email IN ('monaco2@ya.ru', 'nikolay.ivanov@gmail.com', 'viktor.sidorov@mail.ru');

-- Groups (группы друзей)
UPDATE public.guests 
SET 
  guest_type = 'group',
  booking_source = 'referral',
  preferred_categories = '["развлечения", "бар", "активный отдых"]'::jsonb,
  last_visit_date = (NOW() - INTERVAL '3 months')
WHERE email IN ('alexey.morozov@yandex.ru', 'olga.smirnova@mail.ru');

-- Business travelers (деловые пары)
UPDATE public.guests 
SET 
  guest_type = 'couple',
  booking_source = 'booking.com',
  preferred_categories = '["бизнес-услуги", "рестораны", "spa"]'::jsonb,
  last_visit_date = (NOW() - INTERVAL '6 weeks')
WHERE email IN ('svetlana.mikhailova@yandex.ru', 'infoit@mail.ru');

-- VIP repeat customers (постоянные клиенты)
UPDATE public.guests 
SET 
  guest_type = 'couple',
  booking_source = 'direct',
  preferred_categories = '["spa", "рестораны", "трансфер", "консьерж"]'::jsonb,
  last_visit_date = (NOW() - INTERVAL '3 weeks')
WHERE email IN ('infoit2@mail.ru', 'misha@mail.ru');