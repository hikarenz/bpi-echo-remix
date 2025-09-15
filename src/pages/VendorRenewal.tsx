import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import RenewalWorkflowModal from '@/components/renewal/RenewalWorkflowModal';
import ContractViewerModal from '@/components/renewal/ContractViewerModal';
import MeetingSchedulerModal from '@/components/renewal/MeetingSchedulerModal';

interface Contract {
  id: string;
  vendorName: string;
  contractType: string;
  value: string;
  expiryDate: string;
  status: 'expiring' | 'in-progress' | 'renewed' | 'expired';
  riskLevel: 'low' | 'medium' | 'high';
}

export default function VendorRenewal() {
  const [activeTab, setActiveTab] = useState('expiring');
  const [contracts, setContracts] = useState<Contract[]>([
    // Mock data - in real app this would come from Supabase
    { id: '1', vendorName: 'TechCorp Solutions', contractType: 'Software License', value: '$45,000', expiryDate: '2024-03-15', status: 'expiring', riskLevel: 'medium' },
    { id: '2', vendorName: 'DataFlow Systems', contractType: 'Cloud Services', value: '$78,000', expiryDate: '2024-03-20', status: 'expiring', riskLevel: 'high' },
    { id: '3', vendorName: 'SecureNet Inc', contractType: 'Security Services', value: '$32,000', expiryDate: '2024-03-25', status: 'expiring', riskLevel: 'low' },
    { id: '4', vendorName: 'CloudTech Pro', contractType: 'Infrastructure', value: '$95,000', expiryDate: '2024-04-01', status: 'in-progress', riskLevel: 'medium' },
    { id: '5', vendorName: 'DevTools Ltd', contractType: 'Development Tools', value: '$28,000', expiryDate: '2024-04-10', status: 'in-progress', riskLevel: 'low' },
    { id: '6', vendorName: 'Analytics Plus', contractType: 'Analytics Platform', value: '$65,000', expiryDate: '2024-02-28', status: 'renewed', riskLevel: 'low' },
    { id: '7', vendorName: 'Support Solutions', contractType: 'Help Desk', value: '$41,000', expiryDate: '2024-02-15', status: 'expired', riskLevel: 'high' },
  ]);
  
  const [modals, setModals] = useState({
    renewalWorkflow: false,
    contractViewer: false,
    meetingScheduler: false
  });
  
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const { toast } = useToast();

  const handleStartRenewal = (contract: Contract) => {
    setSelectedContract(contract);
    setModals(prev => ({ ...prev, renewalWorkflow: true }));
  };

  const handleScheduleMeeting = (contract: Contract) => {
    setSelectedContract(contract);
    setModals(prev => ({ ...prev, meetingScheduler: true }));
  };

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
    setModals(prev => ({ ...prev, contractViewer: true }));
  };

  const handleUpdateContract = (contractId: string, updates: Partial<Contract>) => {
    setContracts(prev => 
      prev.map(contract => 
        contract.id === contractId 
          ? { ...contract, ...updates }
          : contract
      )
    );
    
    toast({
      title: "Contract Updated",
      description: "The contract has been successfully updated.",
    });
  };

  const handleMeetingScheduled = (contract: Contract, meetingData: any) => {
    toast({
      title: "Meeting Scheduled",
      description: `Meeting scheduled with ${contract.vendorName} for ${meetingData.date} at ${meetingData.time}.`,
    });
  };

  const closeModal = (modalName: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
    setSelectedContract(null);
  };


  const getStatusColor = (status: Contract['status']) => {
    switch (status) {
      case 'expiring': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'in-progress': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'expired': return 'bg-red-500/10 text-red-700 border-red-200';
      case 'renewed': return 'bg-green-500/10 text-green-700 border-green-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getRiskIcon = (risk: Contract['riskLevel']) => {
    switch (risk) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const filterContracts = (tab: string) => {
    switch (tab) {
      case 'expiring': return contracts.filter(c => c.status === 'expiring');
      case 'in_progress': return contracts.filter(c => c.status === 'in-progress');
      case 'all': return contracts;
      default: return contracts;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Renewal Management</h1>
        <p className="text-muted-foreground">
          Track and manage vendor contract renewals and negotiations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Renewed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Expired</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="all">All Contracts</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filterContracts(activeTab).map((contract) => (
            <Card key={contract.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {contract.vendorName}
                      {getRiskIcon(contract.riskLevel)}
                    </CardTitle>
                    <CardDescription>{contract.contractType}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(contract.status)}>
                    {contract.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Contract Value</p>
                    <p className="font-semibold">{contract.value}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expiry Date</p>
                    <p className="font-semibold">{contract.expiryDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={getStatusColor(contract.status)}>
                      {contract.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Level</p>
                    <p className="font-semibold capitalize">{contract.riskLevel}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleStartRenewal(contract)}>Start Renewal</Button>
                  <Button variant="outline" size="sm" onClick={() => handleScheduleMeeting(contract)}>Schedule Meeting</Button>
                  <Button variant="outline" size="sm" onClick={() => handleViewContract(contract)}>View Contract</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <RenewalWorkflowModal
        isOpen={modals.renewalWorkflow}
        onClose={() => closeModal('renewalWorkflow')}
        contract={selectedContract}
        onUpdateContract={handleUpdateContract}
      />
      
      <ContractViewerModal
        isOpen={modals.contractViewer}
        onClose={() => closeModal('contractViewer')}
        contract={selectedContract}
      />
      
      <MeetingSchedulerModal
        isOpen={modals.meetingScheduler}
        onClose={() => closeModal('meetingScheduler')}
        contract={selectedContract}
        onScheduleMeeting={handleMeetingScheduled}
      />
    </div>
  );
}