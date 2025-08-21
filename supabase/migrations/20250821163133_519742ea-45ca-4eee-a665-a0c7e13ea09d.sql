-- Add RLS policy to allow BPI admins to create vendor companies
CREATE POLICY "Admins can create vendor companies" 
ON public.vendor_companies 
FOR INSERT 
WITH CHECK (get_user_role(auth.uid()) = 'bpi_admin'::user_role);