import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface Contract {
  id: string;
  vendorName: string;
  contractType: string;
  currentValue: number;
  expiryDate: string;
  status: 'expiring_soon' | 'renewal_in_progress' | 'expired' | 'renewed';
  daysUntilExpiry: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export default function VendorRenewal() {
  const [activeTab, setActiveTab] = useState('expiring');

  // Mock data - in real app this would come from Supabase
  const contracts: Contract[] = [
    {
      id: '1',
      vendorName: 'TechCorp Solutions',
      contractType: 'Software License',
      currentValue: 120000,
      expiryDate: '2024-10-15',
      status: 'expiring_soon',
      daysUntilExpiry: 30,
      riskLevel: 'high'
    },
    {
      id: '2',
      vendorName: 'DataFlow Systems',
      contractType: 'Cloud Services',
      currentValue: 85000,
      expiryDate: '2024-11-22',
      status: 'expiring_soon',
      daysUntilExpiry: 68,
      riskLevel: 'medium'
    },
    {
      id: '3',
      vendorName: 'SecureNet Inc',
      contractType: 'Security Services',
      currentValue: 95000,
      expiryDate: '2024-09-30',
      status: 'renewal_in_progress',
      daysUntilExpiry: 15,
      riskLevel: 'low'
    }
  ];

  const getStatusColor = (status: Contract['status']) => {
    switch (status) {
      case 'expiring_soon': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'renewal_in_progress': return 'bg-blue-500/10 text-blue-700 border-blue-200';
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
      case 'expiring': return contracts.filter(c => c.status === 'expiring_soon');
      case 'in_progress': return contracts.filter(c => c.status === 'renewal_in_progress');
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
                    <p className="font-semibold">${contract.currentValue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expiry Date</p>
                    <p className="font-semibold">{new Date(contract.expiryDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Days Until Expiry</p>
                    <p className="font-semibold">{contract.daysUntilExpiry} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Level</p>
                    <p className="font-semibold capitalize">{contract.riskLevel}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">Start Renewal</Button>
                  <Button variant="outline" size="sm">Schedule Meeting</Button>
                  <Button variant="outline" size="sm">View Contract</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}