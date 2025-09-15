import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, X, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DocumentUploadProps {
  documentName: string;
  vendorCompanyId: string;
  onUploadComplete?: (filePath: string) => void;
  acceptedFileTypes?: string;
  maxSizeInMB?: number;
}

export function DocumentUpload({ 
  documentName, 
  vendorCompanyId, 
  onUploadComplete,
  acceptedFileTypes = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxSizeInMB = 10
}: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    
    if (file.size > maxSizeInBytes) {
      return `File size must be less than ${maxSizeInMB}MB`;
    }

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = acceptedFileTypes.split(',').map(ext => ext.trim().toLowerCase());
    
    if (!allowedExtensions.includes(fileExtension)) {
      return `File type not supported. Allowed types: ${acceptedFileTypes}`;
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create file path
      const fileExtension = selectedFile.name.split('.').pop();
      const fileName = `${documentName.replace(/\s+/g, '_')}_${Date.now()}.${fileExtension}`;
      const filePath = `compliance_documents/${vendorCompanyId}/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

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

      if (dbError) throw dbError;

      setUploadProgress(100);
      toast.success(`${documentName} uploaded successfully!`);
      
      // Reset state
      setSelectedFile(null);
      setIsUploading(false);
      
      // Notify parent component
      onUploadComplete?.(uploadData.path);

    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.message || 'Upload failed. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
      toast.error('Upload failed. Please try again.');
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">Upload {documentName}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Accepted formats: {acceptedFileTypes} (Max: {maxSizeInMB}MB)
            </p>
          </div>

          {!selectedFile && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">
                Drag and drop your file here
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse
              </p>
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                Browse Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={acceptedFileTypes}
                onChange={handleFileInputChange}
              />
            </div>
          )}

          {selectedFile && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {!isUploading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeSelectedFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-center text-muted-foreground">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}

              {!isUploading && (
                <Button 
                  onClick={uploadFile} 
                  className="w-full"
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              )}
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 p-3 bg-destructive/10 text-destructive rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}