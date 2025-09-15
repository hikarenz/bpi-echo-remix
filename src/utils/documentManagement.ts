import { supabase } from '@/integrations/supabase/client';

export interface DocumentInfo {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
  review_notes?: string;
  vendor_company_id: string;
}

export async function downloadDocument(filePath: string, fileName: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .download(filePath);

    if (error) throw error;

    // Create download link
    const url = URL.createObjectURL(data);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = fileName;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Download error:', error);
    return false;
  }
}

export async function getDocumentViewUrl(filePath: string, expirySeconds = 3600): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, expirySeconds);

    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    console.error('View URL error:', error);
    return null;
  }
}

export async function uploadDocument(
  vendorCompanyId: string,
  documentName: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; error?: string; filePath?: string }> {
  try {
    // Create file path with timestamp to avoid conflicts
    const fileExtension = file.name.split('.').pop();
    const fileName = `${documentName.replace(/\s+/g, '_')}_${Date.now()}.${fileExtension}`;
    const filePath = `compliance_documents/${vendorCompanyId}/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      if (uploadError.message?.includes('Bucket not found')) {
        return {
          success: false,
          error: 'Storage bucket not configured. Please contact support.'
        };
      }
      return {
        success: false,
        error: uploadError.message
      };
    }

    // Update database
    const { error: dbError } = await supabase
      .from('compliance_documents')
      .upsert({
        vendor_company_id: vendorCompanyId,
        document_name: documentName,
        document_type: documentName,
        file_path: uploadData.path,
        status: 'under_review',
        submitted_at: new Date().toISOString()
      }, {
        onConflict: 'vendor_company_id,document_name'
      });

    if (dbError) {
      return {
        success: false,
        error: dbError.message
      };
    }

    onProgress?.(100);
    return {
      success: true,
      filePath: uploadData.path
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Upload failed'
    };
  }
}

export async function deleteDocument(
  vendorCompanyId: string,
  documentName: string,
  filePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Remove from storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([filePath]);

    if (storageError) {
      console.warn('Storage deletion error:', storageError);
    }

    // Remove from database
    const { error: dbError } = await supabase
      .from('compliance_documents')
      .delete()
      .eq('vendor_company_id', vendorCompanyId)
      .eq('document_name', documentName);

    if (dbError) {
      return {
        success: false,
        error: dbError.message
      };
    }

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

export function getDocumentStatusInfo(status: string) {
  switch (status) {
    case 'approved':
    case 'compliant':
      return {
        color: 'green',
        label: 'Approved',
        description: 'Document has been reviewed and approved'
      };
    case 'rejected':
    case 'non_compliant':
      return {
        color: 'red',
        label: 'Rejected',
        description: 'Document needs revision'
      };
    case 'under_review':
      return {
        color: 'blue',
        label: 'Under Review',
        description: 'Document is being reviewed by our team'
      };
    case 'pending':
    default:
      return {
        color: 'gray',
        label: 'Not Submitted',
        description: 'Document has not been uploaded yet'
      };
  }
}