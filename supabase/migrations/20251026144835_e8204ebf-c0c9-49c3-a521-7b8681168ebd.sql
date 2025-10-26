-- Allow authenticated users to self-assign host role
CREATE POLICY "Users can self-assign host role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() AND role = 'host'::app_role);

-- Create trigger to automatically assign host role on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_host_signup();