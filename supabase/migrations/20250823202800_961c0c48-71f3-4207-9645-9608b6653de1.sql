-- Add category field to vendor_companies table
ALTER TABLE public.vendor_companies ADD COLUMN category text;

-- Insert dummy IT solution companies
INSERT INTO public.vendor_companies (
  company_name,
  company_email, 
  category,
  status,
  risk_level,
  company_address,
  contact_person,
  contact_phone,
  contract_start_date,
  contract_end_date,
  performance_score
) VALUES 
(
  'TechCorp Solutions',
  'contact@techcorp.com',
  'Software Development',
  'active'::vendor_status,
  'low'::risk_level,
  'San Francisco, CA',
  'John Smith',
  '+1-555-0123',
  '2024-01-01',
  '2024-12-31',
  85
),
(
  'SecureData Inc',
  'info@securedata.com', 
  'Cybersecurity',
  'active'::vendor_status,
  'medium'::risk_level,
  'Austin, TX',
  'Sarah Johnson',
  '+1-555-0124',
  '2024-02-01',
  '2024-09-15',
  92
),
(
  'CloudHost Pro',
  'support@cloudhost.com',
  'Infrastructure', 
  'under_review'::vendor_status,
  'low'::risk_level,
  'Seattle, WA',
  'Mike Davis',
  '+1-555-0125',
  '2024-03-01',
  '2025-03-20',
  78
),
(
  'DataAnalytics Plus',
  'hello@dataanalytics.com',
  'Analytics',
  'active'::vendor_status,
  'high'::risk_level,
  'New York, NY',
  'Emma Wilson',
  '+1-555-0126',
  '2024-01-15',
  '2024-11-10',
  95
),
(
  'DevOps Masters',
  'team@devopsmasters.com',
  'DevOps & Automation',
  'active'::vendor_status,
  'low'::risk_level,
  'Denver, CO', 
  'Alex Chen',
  '+1-555-0127',
  '2024-02-15',
  '2025-02-15',
  88
),
(
  'AI Solutions Ltd',
  'contact@aisolutions.com',
  'Artificial Intelligence',
  'pending'::vendor_status,
  'medium'::risk_level,
  'Boston, MA',
  'Dr. Lisa Park',
  '+1-555-0128',
  '2024-06-01',
  '2025-06-01',
  0
);