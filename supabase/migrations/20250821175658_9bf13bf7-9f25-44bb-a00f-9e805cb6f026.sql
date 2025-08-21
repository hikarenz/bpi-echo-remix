-- Drop the current vendor policy
DROP POLICY IF EXISTS "Vendors can create their own company" ON public.vendor_companies;

-- Create a simple policy that allows any authenticated user to insert
CREATE POLICY "Authenticated users can create vendor companies" 
ON public.vendor_companies 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);