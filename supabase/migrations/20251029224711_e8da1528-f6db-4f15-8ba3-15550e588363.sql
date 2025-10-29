-- Create function to auto-update loyalty tier based on total_spent
CREATE OR REPLACE FUNCTION public.update_loyalty_tier()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update loyalty tier based on total_spent
  IF NEW.total_spent >= 250000 THEN
    NEW.loyalty_tier := 'Платина';
  ELSIF NEW.total_spent >= 100000 THEN
    NEW.loyalty_tier := 'Золото';
  ELSIF NEW.total_spent >= 50000 THEN
    NEW.loyalty_tier := 'Серебро';
  ELSE
    NEW.loyalty_tier := 'Стандарт';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-update loyalty tier whenever total_spent changes
DROP TRIGGER IF EXISTS trigger_update_loyalty_tier ON public.guests;
CREATE TRIGGER trigger_update_loyalty_tier
  BEFORE UPDATE OF total_spent ON public.guests
  FOR EACH ROW
  WHEN (OLD.total_spent IS DISTINCT FROM NEW.total_spent)
  EXECUTE FUNCTION public.update_loyalty_tier();