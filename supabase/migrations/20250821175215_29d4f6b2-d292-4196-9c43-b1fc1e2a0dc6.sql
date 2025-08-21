-- Drop the existing vendor policy that isn't working
DROP POLICY IF EXISTS "Vendors can create their own company" ON public.vendor_companies;

-- Create a more specific policy for vendors to create companies
CREATE POLICY "Vendors can create their own company" 
ON public.vendor_companies 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND get_user_role(auth.uid()) = 'vendor'::user_role
);