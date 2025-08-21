-- Allow vendors to create their own company profile
CREATE POLICY "Vendors can create their own company" 
ON public.vendor_companies 
FOR INSERT 
WITH CHECK (true);

-- Allow vendors to update their own company
CREATE POLICY "Vendors can update their own company" 
ON public.vendor_companies 
FOR UPDATE 
USING (id = get_user_vendor_company_id(auth.uid()));

-- Allow vendors to insert their own user association
CREATE POLICY "Vendors can create their own user association" 
ON public.vendor_users 
FOR INSERT 
WITH CHECK (user_id = auth.uid());