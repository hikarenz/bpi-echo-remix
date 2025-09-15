-- Storage RLS Policies Setup for Documents Bucket
-- Run these commands in your Supabase SQL editor to set up proper permissions

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow vendors to upload documents to their company folder
INSERT INTO storage.policies (id, bucket_id, name, definition, check_clause, command_type)
VALUES (
  'vendor_documents_insert_policy',
  'documents',
  'Vendors can upload documents to their company folder',
  'auth.uid() IS NOT NULL AND 
   (storage.foldername(name))[1] = ''compliance_documents'' AND 
   (storage.foldername(name))[2] IN (
     SELECT vc.id::text 
     FROM vendor_companies vc 
     JOIN vendor_users vu ON vu.vendor_company_id = vc.id 
     WHERE vu.user_id = auth.uid()
   )',
  'auth.uid() IS NOT NULL AND 
   (storage.foldername(name))[1] = ''compliance_documents'' AND 
   (storage.foldername(name))[2] IN (
     SELECT vc.id::text 
     FROM vendor_companies vc 
     JOIN vendor_users vu ON vu.vendor_company_id = vc.id 
     WHERE vu.user_id = auth.uid()
   )',
  'INSERT'
)
ON CONFLICT (id) DO UPDATE SET
  definition = EXCLUDED.definition,
  check_clause = EXCLUDED.check_clause;

-- Policy 2: Allow vendors to view their own documents, admins to view all
INSERT INTO storage.policies (id, bucket_id, name, definition, check_clause, command_type)
VALUES (
  'vendor_documents_select_policy',
  'documents',
  'Vendors can view their own documents, admins can view all',
  'auth.uid() IS NOT NULL AND (
    -- Vendors can see their own company documents
    (storage.foldername(name))[1] = ''compliance_documents'' AND 
    (storage.foldername(name))[2] IN (
      SELECT vc.id::text 
      FROM vendor_companies vc 
      JOIN vendor_users vu ON vu.vendor_company_id = vc.id 
      WHERE vu.user_id = auth.uid()
    )
    OR
    -- Admins can see all documents
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = ''bpi_admin''
    )
  )',
  NULL,
  'SELECT'
)
ON CONFLICT (id) DO UPDATE SET
  definition = EXCLUDED.definition;

-- Policy 3: Allow vendors to delete/update their own documents
INSERT INTO storage.policies (id, bucket_id, name, definition, check_clause, command_type)
VALUES (
  'vendor_documents_delete_policy',
  'documents',
  'Vendors can delete their own company documents',
  'auth.uid() IS NOT NULL AND 
   (storage.foldername(name))[1] = ''compliance_documents'' AND 
   (storage.foldername(name))[2] IN (
     SELECT vc.id::text 
     FROM vendor_companies vc 
     JOIN vendor_users vu ON vu.vendor_company_id = vc.id 
     WHERE vu.user_id = auth.uid()
   )',
  NULL,
  'DELETE'
)
ON CONFLICT (id) DO UPDATE SET
  definition = EXCLUDED.definition;

-- Verify the policies were created
SELECT bucket_id, name, definition, command_type 
FROM storage.policies 
WHERE bucket_id = 'documents'
ORDER BY command_type, name;