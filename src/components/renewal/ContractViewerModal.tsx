import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, DollarSign, FileText, Building, AlertTriangle, CheckCircle } from 'lucide-react';

interface Contract {
  id: string;
  vendorName: string;
  contractType: string;
  value: string;
  expiryDate: string;
  status: 'expiring' | 'in-progress' | 'renewed' | 'expired';
  riskLevel: 'low' | 'medium' | 'high';
}

interface ContractViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract | null;
}

export default function ContractViewerModal({ 
  isOpen, 
  onClose, 
  contract 
}: ContractViewerModalProps) {
  if (!contract) return null;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'renewed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'expiring': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Mock detailed contract data
  const contractDetails = {
    startDate: '2022-01-15',
    endDate: contract.expiryDate,
    autoRenewal: true,
    renewalTerms: '12 months',
    paymentTerms: 'Net 30',
    terminationNotice: '90 days',
    keyTerms: [
      'Service Level Agreement: 99.9% uptime',
      'Support Response Time: 4 hours',
      'Data Security: SOC 2 Type II compliant',
      'Liability Cap: $1M per incident'
    ],
    recentActivity: [
      { date: '2024-01-15', activity: 'Contract renewal notice sent', type: 'info' },
      { date: '2024-01-10', activity: 'Performance review completed', type: 'success' },
      { date: '2023-12-20', activity: 'Price increase notification received', type: 'warning' },
      { date: '2023-11-15', activity: 'Security audit passed', type: 'success' }
    ]
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Building className="h-5 w-5" />
            Contract Details - {contract.vendorName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contract Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Contract Type</span>
              </div>
              <p className="font-semibold">{contract.contractType}</p>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Annual Value</span>
              </div>
              <p className="font-semibold">{contract.value}</p>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Expiry Date</span>
              </div>
              <p className="font-semibold">{contract.expiryDate}</p>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Risk Level</span>
              </div>
              <Badge variant={getRiskColor(contract.riskLevel)}>
                {contract.riskLevel.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Status and Key Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Contract Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Current Status:</span>
                  <Badge className={getStatusColor(contract.status)}>
                    {contract.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Auto-Renewal:</span>
                  <span className="font-medium">{contractDetails.autoRenewal ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Renewal Period:</span>
                  <span className="font-medium">{contractDetails.renewalTerms}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Key Dates</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Start Date:</span>
                  <span className="font-medium">{contractDetails.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>End Date:</span>
                  <span className="font-medium">{contractDetails.endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Notice Required:</span>
                  <span className="font-medium">{contractDetails.terminationNotice}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Key Terms */}
          <div>
            <h3 className="font-semibold mb-3">Key Contract Terms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {contractDetails.keyTerms.map((term, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{term}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Recent Activity */}
          <div>
            <h3 className="font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {contractDetails.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className={`h-2 w-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' :
                    activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.activity}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Terms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Payment Terms</h4>
              <p className="text-sm text-muted-foreground">{contractDetails.paymentTerms}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Annual Value</h4>
              <p className="text-lg font-bold">{contract.value}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Next Payment</h4>
              <p className="text-sm text-muted-foreground">March 15, 2024</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}