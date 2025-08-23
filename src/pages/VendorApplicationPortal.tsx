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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Plus, Send, Eye, Clock, CheckCircle, XCircle, AlertTriangle, CalendarIcon } from 'lucide-react';

interface VendorCompany {
  id: string;
  company_name: string;
  company_email: string;
  company_address: string;
  contact_person: string;
  contact_phone: string;
  status: 'profile_pending' | 'profile_approved' | 'profile_rejected' | 'onboarding_in_progress' | 'fully_approved' | 'pending' | 'approved' | 'rejected' | 'suspended';
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
    vendor_companies: {
      id: string;
      company_name: string;
      company_email: string;
      status: 'profile_pending' | 'profile_approved' | 'profile_rejected' | 'onboarding_in_progress' | 'fully_approved' | 'pending' | 'approved' | 'rejected' | 'suspended';
    };
}

export default function VendorApplicationPortal() {
  const [vendors, setVendors] = useState<VendorCompany[]>([]);
  const [invitations, setInvitations] = useState<VendorInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<VendorCompany | null>(null);
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const { toast } = useToast();

  // Form states
  const [newVendor, setNewVendor] = useState({
    company_name: '',
    company_email: '',
    company_address: '',
    contact_person: '',
    contact_phone: '',
    status: 'profile_pending' as const,
    risk_level: 'medium' as const,
    performance_score: 0,
    contract_start_date: '',
    contract_end_date: '',
  });

  // Date states for the calendar components
  const [contractStartDate, setContractStartDate] = useState<Date>();
  const [contractEndDate, setContractEndDate] = useState<Date>();

  useEffect(() => {
    fetchVendors();
    fetchInvitations();
  }, []);

  const fetchVendors = async () => {
    try {
      console.log('Fetching vendors...');
      const { data, error } = await supabase
        .from('vendor_companies')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Vendors data:', data);
      console.log('Vendors error:', error);

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
      // Prepare vendor data with proper date formatting
      const vendorData = {
        ...newVendor,
        contract_start_date: contractStartDate ? format(contractStartDate, 'yyyy-MM-dd') : null,
        contract_end_date: contractEndDate ? format(contractEndDate, 'yyyy-MM-dd') : null,
      };

      const { data, error } = await supabase
        .from('vendor_companies')
        .insert([vendorData])
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
        status: 'profile_pending',
        risk_level: 'medium',
        performance_score: 0,
        contract_start_date: '',
        contract_end_date: '',
      });
      setContractStartDate(undefined);
      setContractEndDate(undefined);

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

      // Get vendor company details for the email
      const vendor = vendors.find(v => v.id === vendorId);
      if (!vendor) {
        throw new Error('Vendor company not found');
      }

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
      setGeneratedLink(inviteLink);

      // Send the invitation email
      try {
        const emailResponse = await supabase.functions.invoke('send-invitation-email', {
          body: {
            recipientEmail: email,
            companyName: vendor.company_name,
            invitationLink: inviteLink,
            contactPerson: vendor.contact_person
          }
        });

        if (emailResponse.error) {
          console.error('Email sending error:', emailResponse.error);
          toast({
            title: "Invitation Created",
            description: "Invitation link generated, but email sending failed. Please copy the link manually.",
            variant: "destructive",
          });
        } else {
          console.log('Email sent successfully:', emailResponse.data);
          toast({
            title: "Invitation Sent",
            description: `Invitation email sent successfully to ${email}`,
          });
        }
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        toast({
          title: "Invitation Created",
          description: "Invitation link generated, but email sending failed. Please copy the link manually.",
          variant: "destructive",
        });
      }

      fetchInvitations();
    } catch (error) {
      console.error('Error creating invitation:', error);
      toast({
        title: "Error",
        description: "Failed to create invitation",
        variant: "destructive",
      });
    }
  };

  const updateVendorStatus = async (vendorId: string, status: 'profile_pending' | 'profile_approved' | 'profile_rejected' | 'onboarding_in_progress' | 'fully_approved' | 'pending' | 'approved' | 'rejected' | 'suspended') => {
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
      profile_pending: { variant: "outline", icon: Clock },
      profile_approved: { variant: "default", icon: CheckCircle },
      profile_rejected: { variant: "destructive", icon: XCircle },
      onboarding_in_progress: { variant: "secondary", icon: Clock },
      fully_approved: { variant: "default", icon: CheckCircle },
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
                  {vendors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No vendor companies found. Click "Add Vendor Company" to create your first vendor.
                      </TableCell>
                    </TableRow>
                  ) : (
                    vendors.map((vendor) => (
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
                            {vendor.status === 'profile_pending' && (
                              <>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => updateVendorStatus(vendor.id, 'profile_approved')}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => updateVendorStatus(vendor.id, 'profile_rejected')}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
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
                    ))
                  )}
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
              <Label>Contract Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !contractStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {contractStartDate ? format(contractStartDate, "PPP") : <span>Pick a start date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={contractStartDate}
                    onSelect={setContractStartDate}
                    disabled={(date) =>
                      contractEndDate ? date > contractEndDate : false
                    }
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Contract End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !contractEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {contractEndDate ? format(contractEndDate, "PPP") : <span>Pick an end date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={contractEndDate}
                    onSelect={setContractEndDate}
                    disabled={(date) =>
                      contractStartDate ? date < contractStartDate : false
                    }
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
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
      <Dialog open={showInviteDialog} onOpenChange={(open) => {
        setShowInviteDialog(open);
        if (!open) {
          setGeneratedLink(null);
        }
      }}>
        <DialogContent className="max-w-md">
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
            
            {generatedLink && (
              <div className="space-y-2">
                <Label>Generated Invitation Link</Label>
                <div className="flex gap-2">
                  <Input 
                    value={generatedLink}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedLink);
                      toast({
                        title: "Copied!",
                        description: "Link copied to clipboard",
                      });
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Link expires in 7 days. Send this to the vendor to complete their onboarding.
                </p>
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setShowInviteDialog(false);
                setGeneratedLink(null);
              }}>
                {generatedLink ? 'Close' : 'Cancel'}
              </Button>
              {!generatedLink && (
                <Button 
                  onClick={() => selectedVendor && createInvitation(selectedVendor.id, selectedVendor.company_email)}
                >
                  Generate Invitation Link
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}