
-- Add main image field to the combined table
ALTER TABLE public.combined 
ADD COLUMN main_image_url TEXT;

-- Update existing records with the current default image
UPDATE public.combined SET
  main_image_url = 'https://i.postimg.cc/NFprr3hY/valse.png'
WHERE main_image_url IS NULL;
