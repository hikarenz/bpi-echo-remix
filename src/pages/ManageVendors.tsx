import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building, MapPin, Calendar, Pencil, Trash2, Plus, Search } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Vendor {
  id: string;
  name: string;
  category: string;
  status: string;
  location: string;
  contractEnd: string;
  riskLevel: string;
}

interface EditVendorData {
  company_name: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended' | 'profile_pending' | 'profile_approved' | 'profile_rejected' | 'onboarding_in_progress';
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  company_address: string;
  contact_person: string;
  contact_phone: string;
  contract_end_date: string;
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'approved':
      return 'default';
    case 'profile_pending':
    case 'onboarding_in_progress':
      return 'secondary';
    case 'pending':
      return 'outline';
    case 'rejected':
    case 'suspended':
      return 'destructive';
    default:
      return 'default';
  }
};

const getRiskBadgeVariant = (risk: string) => {
  switch (risk) {
    case 'low':
      return 'default';
    case 'medium':
      return 'secondary';
    case 'high':
      return 'destructive';
    case 'critical':
      return 'destructive';
    default:
      return 'default';
  }
};

const formatStatus = (status: string) => {
  switch (status) {
    case 'approved':
      return 'Active';
    case 'profile_pending':
      return 'Profile Pending';
    case 'onboarding_in_progress':
      return 'Onboarding';
    case 'pending':
      return 'Pending';
    case 'rejected':
      return 'Rejected';
    case 'suspended':
      return 'Suspended';
    default:
      return status;
  }
};

const formatRiskLevel = (risk: string) => {
  return risk.charAt(0).toUpperCase() + risk.slice(1);
};

export default function ManageVendors() {
  const [searchTerm, setSearchTerm] = useState('');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<EditVendorData>({
    company_name: '',
    category: '',
    status: 'pending',
    risk_level: 'medium',
    company_address: '',
    contact_person: '',
    contact_phone: '',
    contract_end_date: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_companies')
        .select('*')
        .order('company_name');

      if (error) throw error;

      const transformedVendors: Vendor[] = data.map(vendor => ({
        id: vendor.id,
        name: vendor.company_name,
        category: vendor.category || 'Uncategorized',
        status: vendor.status,
        location: vendor.company_address || 'No address provided',
        contractEnd: vendor.contract_end_date || 'No end date',
        riskLevel: vendor.risk_level,
      }));
      setVendors(transformedVendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch vendors. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVendor = async (vendorId: string, vendorName: string) => {
    try {
      const { error } = await supabase
        .from('vendor_companies')
        .delete()
        .eq('id', vendorId);

      if (error) throw error;

      // Remove vendor from local state
      setVendors(vendors.filter(vendor => vendor.id !== vendorId));
      
      toast({
        title: "Vendor Deleted",
        description: `${vendorName} has been successfully deleted.`,
      });
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast({
        title: "Error",
        description: "Failed to delete vendor. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    // Fetch full vendor data for editing
    fetchVendorDetails(vendor.id);
    setEditDialogOpen(true);
  };

  const fetchVendorDetails = async (vendorId: string) => {
    try {
      const { data, error } = await supabase
        .from('vendor_companies')
        .select('*')
        .eq('id', vendorId)
        .single();

      if (error) throw error;

      setEditFormData({
        company_name: data.company_name || '',
        category: data.category || '',
        status: (data.status as EditVendorData['status']) || 'pending',
        risk_level: (data.risk_level as EditVendorData['risk_level']) || 'medium',
        company_address: data.company_address || '',
        contact_person: data.contact_person || '',
        contact_phone: data.contact_phone || '',
        contract_end_date: data.contract_end_date || '',
      });
    } catch (error) {
      console.error('Error fetching vendor details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch vendor details.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateVendor = async () => {
    if (!editingVendor) return;

    try {
      const { error } = await supabase
        .from('vendor_companies')
        .update(editFormData)
        .eq('id', editingVendor.id);

      if (error) throw error;

      // Update local state
      setVendors(vendors.map(vendor => 
        vendor.id === editingVendor.id 
          ? {
              ...vendor,
              name: editFormData.company_name,
              category: editFormData.category,
              status: editFormData.status,
              location: editFormData.company_address,
              contractEnd: editFormData.contract_end_date,
              riskLevel: editFormData.risk_level,
            }
          : vendor
      ));

      setEditDialogOpen(false);
      setEditingVendor(null);
      
      toast({
        title: "Vendor Updated",
        description: `${editFormData.company_name} has been successfully updated.`,
      });
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast({
        title: "Error",
        description: "Failed to update vendor. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Vendors</h1>
            <p className="text-muted-foreground">Loading vendors...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Vendors</h1>
          <p className="text-muted-foreground">
            Add, edit, and manage your vendor relationships
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <Card key={vendor.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{vendor.name}</CardTitle>
                  <CardDescription>{vendor.category}</CardDescription>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge variant={getStatusBadgeVariant(vendor.status)}>
                    {formatStatus(vendor.status)}
                  </Badge>
                  <Badge variant={getRiskBadgeVariant(vendor.riskLevel)}>
                    {formatRiskLevel(vendor.riskLevel)} Risk
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {vendor.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Contract ends: {vendor.contractEnd}
                </div>
                <div className="flex gap-2 pt-2">
                  <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => handleEditVendor(vendor)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Vendor</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="company_name">Company Name</Label>
                          <Input
                            id="company_name"
                            value={editFormData.company_name}
                            onChange={(e) => setEditFormData({...editFormData, company_name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            value={editFormData.category}
                            onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Select value={editFormData.status} onValueChange={(value: EditVendorData['status']) => setEditFormData({...editFormData, status: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="profile_pending">Profile Pending</SelectItem>
                              <SelectItem value="onboarding_in_progress">Onboarding</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="risk_level">Risk Level</Label>
                          <Select value={editFormData.risk_level} onValueChange={(value: EditVendorData['risk_level']) => setEditFormData({...editFormData, risk_level: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="company_address">Address</Label>
                          <Input
                            id="company_address"
                            value={editFormData.company_address}
                            onChange={(e) => setEditFormData({...editFormData, company_address: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="contact_person">Contact Person</Label>
                          <Input
                            id="contact_person"
                            value={editFormData.contact_person}
                            onChange={(e) => setEditFormData({...editFormData, contact_person: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="contact_phone">Contact Phone</Label>
                          <Input
                            id="contact_phone"
                            value={editFormData.contact_phone}
                            onChange={(e) => setEditFormData({...editFormData, contact_phone: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="contract_end_date">Contract End Date</Label>
                          <Input
                            id="contract_end_date"
                            type="date"
                            value={editFormData.contract_end_date}
                            onChange={(e) => setEditFormData({...editFormData, contract_end_date: e.target.value})}
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button onClick={handleUpdateVendor} className="flex-1">
                            Update Vendor
                          </Button>
                          <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="flex-1">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Vendor</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {vendor.name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => handleDeleteVendor(vendor.id, vendor.name)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}