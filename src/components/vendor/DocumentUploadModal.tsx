import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DocumentUpload } from './DocumentUpload';

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
  const handleUploadComplete = (filePath: string) => {
    console.log('Document uploaded successfully:', filePath);
    onUploadComplete?.();
    onClose();
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
          onUploadComplete={handleUploadComplete}
        />
      </DialogContent>
    </Dialog>
  );
}