import { supabase } from '@/integrations/supabase/client';

export async function setupStorageBucket() {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      throw new Error(`Failed to list buckets: ${listError.message}`);
    }

    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket) {
      // Create the documents bucket
      const { error: createError } = await supabase.storage.createBucket('documents', {
        public: false,
        allowedMimeTypes: [
          'application/pdf',
          'application/msword', 
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/png',
          'image/jpg'
        ],
        fileSizeLimit: 10485760 // 10MB
      });

      if (createError) {
        throw new Error(`Failed to create bucket: ${createError.message}`);
      }

      console.log('Documents storage bucket created successfully');
      return { success: true, message: 'Documents storage bucket created successfully' };
    }

    return { success: true, message: 'Documents storage bucket already exists' };
  } catch (error: any) {
    console.error('Storage setup error:', error);
    return { success: false, error: error.message };
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