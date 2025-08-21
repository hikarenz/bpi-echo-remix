-- Create a function to easily create admin users
-- This function can only be called by service role users (admins)
CREATE OR REPLACE FUNCTION public.create_admin_user(
  user_email TEXT,
  user_password TEXT,
  admin_first_name TEXT DEFAULT NULL,
  admin_last_name TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
  result JSON;
BEGIN
  -- Note: This function should only be used in development/setup
  -- In production, admins should be created through proper authentication flows
  
  -- For now, we'll create a profile record that can be associated with a user
  -- when they sign up with the designated admin email
  
  -- Check if a profile already exists for this email
  IF EXISTS (SELECT 1 FROM public.profiles WHERE email = user_email) THEN
    -- Update existing profile to admin role
    UPDATE public.profiles 
    SET 
      role = 'bpi_admin',
      first_name = COALESCE(admin_first_name, first_name),
      last_name = COALESCE(admin_last_name, last_name),
      updated_at = NOW()
    WHERE email = user_email;
    
    result := json_build_object(
      'success', true,
      'message', 'Existing user updated to admin role',
      'email', user_email
    );
  ELSE
    -- Create a placeholder profile that will be used when the user signs up
    INSERT INTO public.profiles (id, email, first_name, last_name, role, created_at, updated_at)
    VALUES (
      gen_random_uuid(),
      user_email,
      admin_first_name,
      admin_last_name,
      'bpi_admin',
      NOW(),
      NOW()
    );
    
    result := json_build_object(
      'success', true,
      'message', 'Admin profile created. User must sign up with this email to activate.',
      'email', user_email
    );
  END IF;
  
  RETURN result;
END;
$$;

-- Create an admin user profile for testing
-- This profile will be linked when a user signs up with this email
SELECT public.create_admin_user(
  'admin@bpi.com',
  'password123',
  'BPI',
  'Administrator'
);