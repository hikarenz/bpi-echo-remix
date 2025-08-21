-- Create the missing helper function that RLS policies reference
CREATE OR REPLACE FUNCTION public.get_user_vendor_company_id(user_uuid uuid)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT vendor_company_id FROM public.vendor_users WHERE user_id = user_uuid LIMIT 1;
$function$;

-- Drop and recreate RLS policies to fix any issues
DROP POLICY IF EXISTS "Authenticated users can insert vendor companies" ON public.vendor_companies;
DROP POLICY IF EXISTS "Users can view their own vendor company" ON public.vendor_companies;
DROP POLICY IF EXISTS "Users can update their own vendor company" ON public.vendor_companies;
DROP POLICY IF EXISTS "Users can insert their own vendor association" ON public.vendor_users;
DROP POLICY IF EXISTS "Users can update their own vendor association" ON public.vendor_users;

-- Create working RLS policies for vendor_companies
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

CREATE POLICY "Admins can manage all vendor companies" 
ON public.vendor_companies 
FOR ALL 
TO authenticated 
USING (get_user_role(auth.uid()) = 'bpi_admin'::user_role);

-- Create working RLS policies for vendor_users
CREATE POLICY "Users can insert their own vendor association" 
ON public.vendor_users 
FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own vendor association" 
ON public.vendor_users 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own vendor association" 
ON public.vendor_users 
FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage vendor users" 
ON public.vendor_users 
FOR ALL 
TO authenticated 
USING (get_user_role(auth.uid()) = 'bpi_admin'::user_role);