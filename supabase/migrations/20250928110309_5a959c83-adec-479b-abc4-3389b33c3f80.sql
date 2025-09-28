-- Create storage policies for the documents bucket to allow vendor access

-- Policy for vendors to upload their own documents
CREATE POLICY "Vendors can upload documents to their folder" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = 'compliance_documents'
);

-- Policy for vendors to view their own uploaded documents
CREATE POLICY "Vendors can view their own documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'documents' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = 'compliance_documents'
);

-- Policy for vendors to update/replace their own documents
CREATE POLICY "Vendors can update their own documents" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'documents' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = 'compliance_documents'
) 
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = 'compliance_documents'
);

-- Policy for vendors to delete their own documents
CREATE POLICY "Vendors can delete their own documents" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'documents' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = 'compliance_documents'
);

-- Policy for admins to access all documents
CREATE POLICY "Admins can manage all documents" 
ON storage.objects 
FOR ALL 
USING (
  bucket_id = 'documents' 
  AND get_user_role(auth.uid()) = 'bpi_admin'::user_role
);

-- Policy for public read access if needed (optional - remove if not needed)
CREATE POLICY "Public read access for documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'documents');