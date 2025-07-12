
-- Update the city from "Ладога" to "Сочи" for the booking with email "infoit2@mail.ru"
UPDATE public.combined 
SET city = 'Сочи' 
WHERE guest_email = 'infoit2@mail.ru';
