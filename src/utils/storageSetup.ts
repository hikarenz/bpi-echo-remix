import { supabase } from '@/integrations/supabase/client';

export async function setupStorageBucket() {
  try {
    // Check if bucket exists (but don't try to create it from client side)
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.warn('Could not list storage buckets:', listError.message);
      return { 
        success: false, 
        error: 'Storage access unavailable. Please ensure the documents bucket is created in Supabase dashboard.' 
      };
    }

    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket) {
      return { 
        success: false, 
        error: 'Documents storage bucket not found. Please create a "documents" bucket in your Supabase dashboard.' 
      };
    }

    console.log('Documents bucket found, storage is ready');
    return { success: true, message: 'Documents storage bucket is ready' };
  } catch (error: any) {
    console.error('Storage setup error:', error);
    return { 
      success: false, 
      error: 'Storage setup failed. Please ensure the documents bucket exists in your Supabase dashboard.' 
    };
  }
}

export async function testUploadPermissions() {
  try {
    // Try to upload a small test file to verify permissions
    const testFile = new Blob(['test'], { type: 'text/plain' });
    const testPath = `compliance_documents/test_${Date.now()}.txt`;
    
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(testPath, testFile);
    
    if (uploadError) {
      return {
        success: false,
        error: `Upload test failed: ${uploadError.message}. Please ensure RLS policies are configured for the documents bucket.`
      };
    }
    
    // Clean up test file
    await supabase.storage
      .from('documents')
      .remove([testPath]);
    
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

export async function checkStorageSetup() {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      return { exists: false, error: error.message };
    }

    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    return { exists: !!documentsBucket };
  } catch (error: any) {
    return { exists: false, error: error.message };
  }
}