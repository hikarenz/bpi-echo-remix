-- Re-enable RLS on vendor_companies table with proper policies
ALTER TABLE public.vendor_companies ENABLE ROW LEVEL SECURITY;

-- Create robust RLS policies for vendor_companies
CREATE POLICY "Authenticated users can insert vendor companies" 
ON public.vendor_companies 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own vendor company" 
ON public.vendor_companies 
FOR SELECT 
TO authenticated 
USING (id = get_user_vendor_company_id(auth.uid()));

CREATE POLICY "Users can update their own vendor company" 
ON public.vendor_companies 
FOR UPDATE 
TO authenticated 
USING (id = get_user_vendor_company_id(auth.uid()));

-- Ensure vendor_users table has proper RLS policies
CREATE POLICY "Users can insert their own vendor association" 
ON public.vendor_users 
FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own vendor association" 
ON public.vendor_users 
FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid());