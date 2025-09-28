-- Add unique constraint for vendor_company_id and document_name combination
-- This allows upsert operations with ON CONFLICT to work properly
ALTER TABLE public.compliance_documents 
ADD CONSTRAINT unique_vendor_document 
UNIQUE (vendor_company_id, document_name);