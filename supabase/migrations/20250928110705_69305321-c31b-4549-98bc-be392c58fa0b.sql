-- Drop existing restrictive storage policies
DROP POLICY IF EXISTS "Vendors can upload documents to their folder" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can delete their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage all documents" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for documents" ON storage.objects;

-- Create completely public storage policies for demo purposes
-- Allow anyone to list buckets (needed for bucket detection)
CREATE POLICY "Allow public bucket listing" 
ON storage.buckets 
FOR SELECT 
USING (true);

-- Allow anyone to upload documents (demo mode)
CREATE POLICY "Public upload access to documents bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'documents');

-- Allow anyone to view documents (demo mode)
CREATE POLICY "Public read access to documents bucket" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'documents');

-- Allow anyone to update documents (demo mode)
CREATE POLICY "Public update access to documents bucket" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'documents')
WITH CHECK (bucket_id = 'documents');

-- Allow anyone to delete documents (demo mode)
CREATE POLICY "Public delete access to documents bucket" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'documents');