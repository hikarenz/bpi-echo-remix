-- Update the handle_new_user function to process invitation tokens
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
DECLARE
  invitation_token text;
  vendor_company_uuid uuid;
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

  -- Insert profile
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    user_role
  );

  -- Process invitation token if provided
  invitation_token := NEW.raw_user_meta_data->>'invitation_token';
  
  IF invitation_token IS NOT NULL AND user_role = 'vendor' THEN
    -- Find the vendor company associated with this invitation
    SELECT vi.vendor_company_id INTO vendor_company_uuid
    FROM public.vendor_invitations vi
    WHERE vi.invitation_token = invitation_token
      AND vi.invited_email = NEW.email
      AND vi.expires_at > NOW()
      AND vi.used_at IS NULL;
    
    -- If valid invitation found, link user to vendor company
    IF vendor_company_uuid IS NOT NULL THEN
      -- Create vendor_users association
      INSERT INTO public.vendor_users (user_id, vendor_company_id)
      VALUES (NEW.id, vendor_company_uuid);
      
      -- Mark invitation as used
      UPDATE public.vendor_invitations
      SET used_at = NOW()
      WHERE invitation_token = invitation_token;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Create function to process invitation tokens (for frontend use)
CREATE OR REPLACE FUNCTION public.process_invitation_token(
  p_invitation_token text,
  p_user_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
DECLARE
  vendor_company_uuid uuid;
  invitation_record record;
  result json;
BEGIN
  -- Find the invitation
  SELECT vi.*, vc.company_name 
  INTO invitation_record
  FROM public.vendor_invitations vi
  JOIN public.vendor_companies vc ON vi.vendor_company_id = vc.id
  WHERE vi.invitation_token = p_invitation_token
    AND vi.expires_at > NOW()
    AND vi.used_at IS NULL;
  
  -- Check if invitation exists and is valid
  IF invitation_record IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid or expired invitation token'
    );
  END IF;
  
  -- Check if user email matches invitation
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = p_user_id 
    AND email = invitation_record.invited_email
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Email does not match invitation'
    );
  END IF;
  
  -- Check if user is already linked to a vendor company
  IF EXISTS (
    SELECT 1 FROM public.vendor_users 
    WHERE user_id = p_user_id
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'User already associated with a vendor company'
    );
  END IF;
  
  -- Create vendor_users association
  INSERT INTO public.vendor_users (user_id, vendor_company_id)
  VALUES (p_user_id, invitation_record.vendor_company_id);
  
  -- Mark invitation as used
  UPDATE public.vendor_invitations
  SET used_at = NOW()
  WHERE invitation_token = p_invitation_token;
  
  RETURN json_build_object(
    'success', true,
    'vendor_company_id', invitation_record.vendor_company_id,
    'company_name', invitation_record.company_name
  );
END;
$$;