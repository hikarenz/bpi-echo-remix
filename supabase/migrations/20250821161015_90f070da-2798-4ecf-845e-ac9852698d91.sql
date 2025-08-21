-- Create enum types for roles and statuses
CREATE TYPE public.user_role AS ENUM ('bpi_admin', 'vendor');
CREATE TYPE public.vendor_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE public.compliance_status AS ENUM ('compliant', 'non_compliant', 'under_review', 'not_submitted');
CREATE TYPE public.risk_level AS ENUM ('low', 'medium', 'high', 'critical');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role user_role NOT NULL DEFAULT 'vendor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendor companies table
CREATE TABLE public.vendor_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  company_email TEXT NOT NULL,
  company_address TEXT,
  contact_person TEXT,
  contact_phone TEXT,
  status vendor_status DEFAULT 'pending',
  risk_level risk_level DEFAULT 'medium',
  performance_score INTEGER DEFAULT 0 CHECK (performance_score >= 0 AND performance_score <= 100),
  contract_start_date DATE,
  contract_end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendor invitations table for secure time-bound links
CREATE TABLE public.vendor_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_company_id UUID REFERENCES public.vendor_companies(id) ON DELETE CASCADE,
  invited_email TEXT NOT NULL,
  invitation_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendor users link table
CREATE TABLE public.vendor_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  vendor_company_id UUID REFERENCES public.vendor_companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, vendor_company_id)
);

-- Create compliance documents table
CREATE TABLE public.compliance_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_company_id UUID REFERENCES public.vendor_companies(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  file_path TEXT,
  status compliance_status DEFAULT 'not_submitted',
  submitted_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES public.profiles(id),
  review_notes TEXT,
  expires_at DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = user_uuid;
$$;

-- Create security definer function to get user's vendor company
CREATE OR REPLACE FUNCTION public.get_user_vendor_company_id(user_uuid UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT vendor_company_id FROM public.vendor_users WHERE user_id = user_uuid LIMIT 1;
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'bpi_admin');

-- RLS Policies for vendor_companies
CREATE POLICY "Admins can manage all vendor companies" ON public.vendor_companies
  FOR ALL USING (public.get_user_role(auth.uid()) = 'bpi_admin');

CREATE POLICY "Vendors can view their own company" ON public.vendor_companies
  FOR SELECT USING (id = public.get_user_vendor_company_id(auth.uid()));

-- RLS Policies for vendor_invitations
CREATE POLICY "Admins can manage invitations" ON public.vendor_invitations
  FOR ALL USING (public.get_user_role(auth.uid()) = 'bpi_admin');

-- RLS Policies for vendor_users
CREATE POLICY "Admins can manage vendor users" ON public.vendor_users
  FOR ALL USING (public.get_user_role(auth.uid()) = 'bpi_admin');

CREATE POLICY "Users can view their own vendor association" ON public.vendor_users
  FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for compliance_documents
CREATE POLICY "Admins can manage all compliance documents" ON public.compliance_documents
  FOR ALL USING (public.get_user_role(auth.uid()) = 'bpi_admin');

CREATE POLICY "Vendors can manage their company documents" ON public.compliance_documents
  FOR ALL USING (vendor_company_id = public.get_user_vendor_company_id(auth.uid()));

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (recipient_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (recipient_id = auth.uid());

-- RLS Policies for audit_logs
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'bpi_admin');

-- Create trigger function to automatically update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendor_companies_updated_at
  BEFORE UPDATE ON public.vendor_companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_compliance_documents_updated_at
  BEFORE UPDATE ON public.compliance_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger function for profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'vendor')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();