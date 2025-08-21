-- Update the existing profile role for the admin user
UPDATE public.profiles 
SET role = 'bpi_admin'
WHERE email = 'hikarigeranium@gmail.com';