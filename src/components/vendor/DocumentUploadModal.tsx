import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DocumentUpload } from './DocumentUpload';
import { uploadDocument } from '@/utils/documentManagement';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  vendorCompanyId: string;
  onUploadComplete?: () => void;
}

export function DocumentUploadModal({
  isOpen,
  onClose,
  documentName,
  vendorCompanyId,
  onUploadComplete
}: DocumentUploadModalProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadDocument(vendorCompanyId, documentName, file);
      
      if (result.success) {
        onUploadComplete?.();
        onClose();
      } else {
        console.error('Upload failed:', result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <DocumentUpload
          documentName={documentName}
          vendorCompanyId={vendorCompanyId}
          onUploadComplete={(filePath: string) => {
            console.log('Document uploaded successfully:', filePath);
            onUploadComplete?.();
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}