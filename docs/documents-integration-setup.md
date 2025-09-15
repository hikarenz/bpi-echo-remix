# Documents Storage Integration Setup

## Overview

The documents integration allows vendors to upload, view, and manage compliance documents through the VendorPro application. This system integrates with Supabase Storage and provides secure file management with proper access controls.

## Setup Instructions

### 1. Storage Bucket Configuration

The documents storage bucket has been created in your Supabase dashboard. Now you need to set up the Row Level Security (RLS) policies for proper access control.

#### Set Up RLS Policies via Supabase Dashboard

**IMPORTANT**: Use the Supabase Dashboard to create storage policies, not SQL Editor.

1. Go to your Supabase Dashboard → **Storage** → **Policies**
2. Select the `documents` bucket
3. Create these three policies by clicking "New Policy":

**Policy 1: Allow Upload**
- Name: `Vendors can upload documents to their company folder`
- Policy command: `INSERT` 
- Target roles: `authenticated`
- Policy definition:
```sql
auth.uid() IS NOT NULL AND 
(storage.foldername(name))[1] = 'compliance_documents' AND 
(storage.foldername(name))[2] IN (
  SELECT vc.id::text 
  FROM vendor_companies vc 
  JOIN vendor_users vu ON vu.vendor_company_id = vc.id 
  WHERE vu.user_id = auth.uid()
)
```

**Policy 2: Allow View**
- Name: `Vendors can view their own documents, admins can view all`
- Policy command: `SELECT`
- Target roles: `authenticated`  
- Policy definition:
```sql
auth.uid() IS NOT NULL AND (
  (storage.foldername(name))[1] = 'compliance_documents' AND 
  (storage.foldername(name))[2] IN (
    SELECT vc.id::text 
    FROM vendor_companies vc 
    JOIN vendor_users vu ON vu.vendor_company_id = vc.id 
    WHERE vu.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'bpi_admin'
  )
)
```

**Policy 3: Allow Delete**
- Name: `Vendors can delete their own documents`
- Policy command: `DELETE`
- Target roles: `authenticated`
- Policy definition:
```sql
auth.uid() IS NOT NULL AND 
(storage.foldername(name))[1] = 'compliance_documents' AND 
(storage.foldername(name))[2] IN (
  SELECT vc.id::text 
  FROM vendor_companies vc 
  JOIN vendor_users vu ON vu.vendor_company_id = vc.id 
  WHERE vu.user_id = auth.uid()
)
```

### 2. Verify Integration

After running the RLS setup, test the integration:

1. Navigate to `/vendors/onboarding` as a vendor user
2. Try uploading a compliance document (W-9, Insurance Certificate, etc.)
3. Verify the document appears in the compliance documents list
4. Test viewing and downloading uploaded documents

### 3. Features Implemented

#### Document Upload
- **Component**: `DocumentUpload.tsx`
- **Features**: 
  - Drag & drop file upload
  - File type validation (PDF, DOC, DOCX, JPG, PNG)
  - File size validation (up to 10MB)
  - Upload progress tracking
  - Storage permissions testing

#### Document Viewer  
- **Component**: `DocumentViewer.tsx`
- **Features**:
  - View document details and status
  - Download documents
  - View documents in browser (via signed URLs)
  - Display review notes and status information

#### Document Management
- **Utilities**: `documentManagement.ts`
- **Features**:
  - Centralized document operations
  - File path organization (`compliance_documents/{vendor_id}/filename`)
  - Document status tracking
  - Error handling and validation

#### Onboarding Integration
- **Enhanced**: `VendorOnboarding.tsx`
- **Features**:
  - Real-time document status display
  - Action buttons based on document state
  - Upload modal integration
  - Document viewer integration

## File Organization

Documents are organized in the storage bucket as follows:
```
documents/
└── compliance_documents/
    └── {vendor_company_id}/
        ├── W-9_Tax_Form_1703022345678.pdf
        ├── Insurance_Certificate_1703022456789.pdf
        └── Data_Processing_Agreement_1703022567890.pdf
```

## Document Status Flow

1. **Not Submitted** → Document hasn't been uploaded yet
2. **Under Review** → Document uploaded, awaiting admin review
3. **Approved** → Document approved by admin
4. **Rejected** → Document rejected, needs revision

## Security Features

### Row Level Security Policies
- **INSERT**: Vendors can only upload to their own company folder
- **SELECT**: Vendors see their documents, admins see all
- **DELETE**: Vendors can delete their own documents
- **File Path Validation**: Ensures files go to correct folders

### Access Control
- Authentication required for all operations
- User role validation (vendor vs admin permissions)
- Company association validation
- Secure signed URLs for document viewing (1-hour expiry)

## Error Handling

The system handles various error scenarios:
- Storage bucket not found
- Permission denied (RLS policy violations)
- File upload failures
- Network connectivity issues
- File size/type validation errors

## Testing Checklist

Before deployment, verify:
- [ ] RLS policies are active and working
- [ ] Vendors can upload documents successfully
- [ ] Document status updates correctly in database
- [ ] Vendors can view/download their documents
- [ ] Admins can view all vendor documents
- [ ] File permissions prevent cross-vendor access
- [ ] Error messages are user-friendly

## Troubleshooting

### Common Issues

**"Storage permissions not configured"**
- Ensure RLS policies from `storage-rls-setup.sql` are applied
- Check that the policies reference the correct table names
- Verify `vendor_companies` and `vendor_users` tables exist

**"Upload test failed"**
- Check user authentication
- Verify user has a vendor company association
- Ensure RLS INSERT policy allows the operation

**"Failed to view document"**
- Check RLS SELECT policy
- Verify document exists at the specified path
- Ensure user has permission to access the file

### Admin Functions

Admins can manage documents through the database:
```sql
-- View all documents
SELECT * FROM compliance_documents;

-- Update document status
UPDATE compliance_documents 
SET status = 'approved', reviewed_at = NOW()
WHERE id = 'document_id';

-- Add review notes
UPDATE compliance_documents 
SET status = 'rejected', 
    review_notes = 'Please resubmit with correct tax ID',
    reviewed_at = NOW()
WHERE id = 'document_id';
```

## Next Steps

After completing this setup:
1. Test the integration thoroughly
2. Configure admin review workflows
3. Set up email notifications for status changes
4. Add document expiration tracking if needed
5. Implement bulk document operations for admins