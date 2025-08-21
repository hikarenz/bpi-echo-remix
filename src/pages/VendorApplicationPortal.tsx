import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Send, Eye, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface VendorCompany {
  id: string;
  company_name: string;
  company_email: string;
  company_address: string;
  contact_person: string;
  contact_phone: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  performance_score: number;
  contract_start_date: string;
  contract_end_date: string;
  created_at: string;
}

interface VendorInvitation {
  id: string;
  vendor_company_id: string;
  invited_email: string;
  invitation_token: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
  vendor_companies: VendorCompany;
}

export default function VendorApplicationPortal() {
  const [vendors, setVendors] = useState<VendorCompany[]>([]);
  const [invitations, setInvitations] = useState<VendorInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<VendorCompany | null>(null);
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const { toast } = useToast();

  // Form states
  const [newVendor, setNewVendor] = useState({
    company_name: '',
    company_email: '',
    company_address: '',
    contact_person: '',
    contact_phone: '',
    status: 'pending' as const,
    risk_level: 'medium' as const,
    performance_score: 0,
    contract_start_date: '',
    contract_end_date: '',
  });

  useEffect(() => {
    fetchVendors();
    fetchInvitations();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch vendors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_invitations')
        .select(`
          *,
          vendor_companies (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    }
  };

  const createVendor = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_companies')
        .insert([newVendor])
        .select()
        .single();

      if (error) throw error;

      setVendors([data, ...vendors]);
      setShowAddVendor(false);
      setNewVendor({
        company_name: '',
        company_email: '',
        company_address: '',
        contact_person: '',
        contact_phone: '',
        status: 'pending',
        risk_level: 'medium',
        performance_score: 0,
        contract_start_date: '',
        contract_end_date: '',
      });

      toast({
        title: "Success",
        description: "Vendor company created successfully",
      });
    } catch (error) {
      console.error('Error creating vendor:', error);
      toast({
        title: "Error",
        description: "Failed to create vendor",
        variant: "destructive",
      });
    }
  };

  const createInvitation = async (vendorId: string, email: string) => {
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
      
      const invitationToken = crypto.randomUUID();

      const { data, error } = await supabase
        .from('vendor_invitations')
        .insert([{
          vendor_company_id: vendorId,
          invited_email: email,
          invitation_token: invitationToken,
          expires_at: expiresAt.toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;

      const inviteLink = `${window.location.origin}/auth?token=${invitationToken}`;
      
      toast({
        title: "Invitation Created",
        description: "Copy this secure link to send to the vendor:",
      });

      // Copy to clipboard
      navigator.clipboard.writeText(inviteLink);

      fetchInvitations();
      setShowInviteDialog(false);
    } catch (error) {
      console.error('Error creating invitation:', error);
      toast({
        title: "Error",
        description: "Failed to create invitation",
        variant: "destructive",
      });
    }
  };

  const updateVendorStatus = async (vendorId: string, status: 'pending' | 'approved' | 'rejected' | 'suspended') => {
    try {
      const { error } = await supabase
        .from('vendor_companies')
        .update({ status })
        .eq('id', vendorId);

      if (error) throw error;

      setVendors(vendors.map(v => 
        v.id === vendorId ? { ...v, status } : v
      ));

      toast({
        title: "Success",
        description: `Vendor status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating vendor status:', error);
      toast({
        title: "Error",
        description: "Failed to update vendor status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: "outline", icon: Clock },
      approved: { variant: "default", icon: CheckCircle },
      rejected: { variant: "destructive", icon: XCircle },
      suspended: { variant: "secondary", icon: AlertTriangle }
    };
    
    const config = variants[status] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRiskBadge = (risk: string) => {
    const variants: Record<string, string> = {
      low: "default",
      medium: "secondary", 
      high: "outline",
      critical: "destructive"
    };
    
    return (
      <Badge variant={variants[risk] as any}>
        {risk.charAt(0).toUpperCase() + risk.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor Application Portal</h1>
          <p className="text-muted-foreground">
            Manage vendor applications, invitations, and onboarding
          </p>
        </div>
        <Button onClick={() => setShowAddVendor(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor Company
        </Button>
      </div>

      <Tabs defaultValue="vendors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vendors">Vendor Companies</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
        </TabsList>

        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Companies</CardTitle>
              <CardDescription>
                Manage all vendor companies and their application status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{vendor.company_name}</div>
                          <div className="text-sm text-muted-foreground">{vendor.company_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{vendor.contact_person}</div>
                          <div className="text-sm text-muted-foreground">{vendor.contact_phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                      <TableCell>{getRiskBadge(vendor.risk_level)}</TableCell>
                      <TableCell>{vendor.performance_score}%</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedVendor(vendor)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedVendor(vendor);
                              setShowInviteDialog(true);
                            }}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Invitations</CardTitle>
              <CardDescription>
                Track sent invitations and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Invited Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell>{invitation.vendor_companies?.company_name}</TableCell>
                      <TableCell>{invitation.invited_email}</TableCell>
                      <TableCell>
                        <Badge variant={invitation.used_at ? "default" : "outline"}>
                          {invitation.used_at ? "Used" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(invitation.expires_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(invitation.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Vendor Dialog */}
      <Dialog open={showAddVendor} onOpenChange={setShowAddVendor}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Vendor Company</DialogTitle>
            <DialogDescription>
              Create a new vendor company profile for onboarding
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={newVendor.company_name}
                onChange={(e) => setNewVendor({ ...newVendor, company_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_email">Company Email</Label>
              <Input
                id="company_email"
                type="email"
                value={newVendor.company_email}
                onChange={(e) => setNewVendor({ ...newVendor, company_email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_person">Contact Person</Label>
              <Input
                id="contact_person"
                value={newVendor.contact_person}
                onChange={(e) => setNewVendor({ ...newVendor, contact_person: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                value={newVendor.contact_phone}
                onChange={(e) => setNewVendor({ ...newVendor, contact_phone: e.target.value })}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="company_address">Company Address</Label>
              <Textarea
                id="company_address"
                value={newVendor.company_address}
                onChange={(e) => setNewVendor({ ...newVendor, company_address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contract_start_date">Contract Start Date</Label>
              <Input
                id="contract_start_date"
                type="date"
                value={newVendor.contract_start_date}
                onChange={(e) => setNewVendor({ ...newVendor, contract_start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contract_end_date">Contract End Date</Label>
              <Input
                id="contract_end_date"
                type="date"
                value={newVendor.contract_end_date}
                onChange={(e) => setNewVendor({ ...newVendor, contract_end_date: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddVendor(false)}>
              Cancel
            </Button>
            <Button onClick={createVendor}>
              Create Vendor
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Invitation Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Vendor Invitation</DialogTitle>
            <DialogDescription>
              Generate a secure invitation link for {selectedVendor?.company_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Vendor Email</Label>
              <Input 
                value={selectedVendor?.company_email || ''}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => selectedVendor && createInvitation(selectedVendor.id, selectedVendor.company_email)}
              >
                Generate Invitation Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}