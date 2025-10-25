-- Create trigger function to assign host role on signup
CREATE OR REPLACE FUNCTION public.handle_host_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user metadata indicates host registration
  IF NEW.raw_user_meta_data->>'role' = 'host' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'host'::app_role);
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for host role assignment
DROP TRIGGER IF EXISTS on_host_user_created ON auth.users;
CREATE TRIGGER on_host_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_host_signup();