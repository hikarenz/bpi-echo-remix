import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Eye, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { downloadDocument, getDocumentViewUrl, getDocumentStatusInfo } from '@/utils/documentManagement';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id: string;
    document_name: string;
    document_type: string;
    file_path: string;
    status: string;
    submitted_at: string;
    reviewed_at?: string;
    review_notes?: string;
  } | null;
}

export function DocumentViewer({ isOpen, onClose, document }: DocumentViewerProps) {
  const [downloading, setDownloading] = useState(false);

  if (!document) return null;

  const statusInfo = getDocumentStatusInfo(document.status);

  const getStatusColor = (status: string) => {
    const info = getDocumentStatusInfo(status);
    switch (info.color) {
      case 'green': return 'bg-green-100 text-green-800 border-green-200';
      case 'red': return 'bg-red-100 text-red-800 border-red-200';
      case 'blue': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const success = await downloadDocument(document.file_path, document.document_name);
      if (success) {
        toast.success('Document downloaded successfully');
      } else {
        toast.error('Failed to download document');
      }
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error('Failed to download document');
    } finally {
      setDownloading(false);
    }
  };

  const handleView = async () => {
    try {
      const signedUrl = await getDocumentViewUrl(document.file_path);
      if (signedUrl) {
        window.open(signedUrl, '_blank');
      } else {
        toast.error('Failed to view document');
      }
    } catch (error: any) {
      console.error('View error:', error);
      toast.error('Failed to view document');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {document.document_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={getStatusColor(document.status)}>
                {statusInfo.label}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Submitted</p>
              <p className="text-sm font-medium">
                {new Date(document.submitted_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Review Notes */}
          {document.review_notes && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Review Notes</p>
                  <p className="text-sm text-amber-700 mt-1">{document.review_notes}</p>
                  {document.reviewed_at && (
                    <p className="text-xs text-amber-600 mt-2">
                      Reviewed on {new Date(document.reviewed_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Document Actions */}
          <div className="flex gap-3">
            <Button onClick={handleView} variant="outline" className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              View Document
            </Button>
            <Button 
              onClick={handleDownload} 
              disabled={downloading}
              variant="outline" 
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              {downloading ? 'Downloading...' : 'Download'}
            </Button>
          </div>

          {/* Document Details */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Document Type</p>
              <p className="text-sm font-medium">{document.document_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">File Path</p>
              <p className="text-xs font-mono text-muted-foreground truncate">
                {document.file_path}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}