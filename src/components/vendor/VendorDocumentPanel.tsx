import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { format } from 'date-fns';

interface ComplianceDocument {
  id: string;
  document_name: string;
  status: 'compliant' | 'non_compliant' | 'not_submitted' | 'under_review';
  submitted_at: string;
  reviewed_at?: string;
  expires_at?: string;
  review_notes?: string;
}

interface VendorDocumentPanelProps {
  vendorCompanyId: string;
}

export function VendorDocumentPanel({ vendorCompanyId }: VendorDocumentPanelProps) {
  const [documents, setDocuments] = useState<ComplianceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const { data, error } = await supabase
          .from('compliance_documents')
          .select('*')
          .eq('vendor_company_id', vendorCompanyId)
          .order('uploaded_at', { ascending: false });

        if (error) throw error;
        setDocuments(data || []);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, [vendorCompanyId]);

  const requiredDocuments = [
    'Business License',
    'Tax Certificate',
    'Insurance Certificate',
    'Company Registration',
    'Financial Statements',
    'Compliance Certificate'
  ];

  const getDocumentStatus = (docName: string) => {
    const doc = documents.find(d => d.document_name === docName);
    if (!doc) return 'missing';
    return doc.status === 'compliant' ? 'approved' : 
           doc.status === 'non_compliant' ? 'rejected' : 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <Upload className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-success/10 text-success border-success/20">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
      case 'expired':
        return <Badge variant="outline" className="text-destructive border-destructive/20">Expired</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground">Not Uploaded</Badge>;
    }
  };

  const approvedCount = requiredDocuments.filter(doc => getDocumentStatus(doc) === 'approved').length;
  const completionRate = (approvedCount / requiredDocuments.length) * 100;

  const getDocumentDetails = (docName: string) => {
    return documents.find(d => d.document_name === docName);
  };

  const isExpiringSoon = (expiresAt?: string) => {
    if (!expiresAt) return false;
    const expirationDate = new Date(expiresAt);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expirationDate <= thirtyDaysFromNow;
  };

  if (loading) {
    return (
      <Card className="card-glossy-hover">
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-glossy-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Document Management
            </CardTitle>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completion Rate</span>
                <span className="font-medium">{approvedCount}/{requiredDocuments.length} approved</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <div className="space-y-4">
            {requiredDocuments.map((docName) => {
              const status = getDocumentStatus(docName);
              const docDetails = getDocumentDetails(docName);
              const isExpiring = docDetails?.expires_at && isExpiringSoon(docDetails.expires_at);

              return (
                <div
                  key={docName}
                  className={`
                    p-4 rounded-lg border transition-colors
                    ${status === 'approved' ? 'bg-success/5 border-success/20' :
                      status === 'rejected' ? 'bg-destructive/5 border-destructive/20' :
                      status === 'pending' ? 'bg-warning/5 border-warning/20' :
                      'bg-muted/5 border-muted-foreground/20'}
                    ${isExpiring ? 'ring-2 ring-warning/50' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(status)}
                      <div>
                        <h4 className="font-medium">{docName}</h4>
                        {docDetails && (
                          <div className="text-xs text-muted-foreground mt-1 space-y-1">
                            <div>
                              Submitted: {format(new Date(docDetails.submitted_at), 'MMM dd, yyyy')}
                            </div>
                            {docDetails.expires_at && (
                              <div className={isExpiring ? 'text-warning font-medium' : ''}>
                                <Calendar className="h-3 w-3 inline mr-1" />
                                Expires: {format(new Date(docDetails.expires_at), 'MMM dd, yyyy')}
                                {isExpiring && ' (Expiring Soon!)'}
                              </div>
                            )}
                            {docDetails.reviewed_at && (
                              <div>
                                Reviewed: {format(new Date(docDetails.reviewed_at), 'MMM dd, yyyy')}
                              </div>
                            )}
                          </div>
                        )}
                        {docDetails?.review_notes && status === 'rejected' && (
                          <p className="text-xs text-destructive mt-1">
                            Notes: {docDetails.review_notes}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusBadge(status)}
                      {status === 'missing' || status === 'rejected' || isExpiring ? (
                        <Button size="sm" variant="outline">
                          <Upload className="h-3 w-3 mr-1" />
                          Upload
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {approvedCount < requiredDocuments.length && (
            <div className="mt-6 p-4 bg-info/5 border border-info/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-info mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-info">Complete Document Upload Required</p>
                  <p className="text-muted-foreground mt-1">
                    Upload and get approval for all required documents to proceed with your vendor application.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}