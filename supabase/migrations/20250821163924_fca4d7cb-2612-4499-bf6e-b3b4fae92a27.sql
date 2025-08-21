-- Update the handle_new_user function to use the new admin email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  user_role user_role := 'vendor'; -- default role
BEGIN
  -- Check if this email should be an admin
  IF NEW.email = 'hikarigeranium@gmail.com' THEN
    user_role := 'bpi_admin';
  END IF;
  
  -- Override role if specified in metadata
  IF NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
    user_role := (NEW.raw_user_meta_data->>'role')::user_role;
  END IF;

  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    user_role
  );
  RETURN NEW;
END;
$$;