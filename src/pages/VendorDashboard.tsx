import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertCircle, Building, Calendar, MapPin, LogOut } from 'lucide-react';

interface VendorCompany {
  id: string;
  company_name: string;
  company_email: string;
  company_address: string | null;
  contact_person: string | null;
  contact_phone: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  contract_start_date: string | null;
  contract_end_date: string | null;
  created_at: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return CheckCircle;
    case 'rejected':
      return AlertCircle;
    case 'suspended':
      return AlertCircle;
    default:
      return Clock;
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'approved':
      return 'default';
    case 'rejected':
      return 'destructive';
    case 'suspended':
      return 'destructive';
    default:
      return 'outline';
  }
};

const getStatusMessage = (status: string) => {
  switch (status) {
    case 'approved':
      return 'Your vendor profile has been approved. You are now an active vendor.';
    case 'rejected':
      return 'Your vendor profile was rejected. Please contact support for more information.';
    case 'suspended':
      return 'Your vendor account has been suspended. Please contact support.';
    default:
      return 'Your vendor profile has been submitted and is awaiting review.';
  }
};

export default function VendorDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [vendorCompany, setVendorCompany] = useState<VendorCompany | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(true);

  useEffect(() => {
    async function fetchVendorData() {
      if (!user) return;

      try {
        // Check if user has a vendor company association
        const { data: vendorUser, error: vendorUserError } = await supabase
          .from('vendor_users')
          .select('vendor_company_id')
          .eq('user_id', user.id)
          .single();

        if (vendorUserError || !vendorUser) {
          setHasProfile(false);
          setLoading(false);
          return;
        }

        // Fetch vendor company data
        const { data: company, error: companyError } = await supabase
          .from('vendor_companies')
          .select('*')
          .eq('id', vendorUser.vendor_company_id)
          .single();

        if (companyError) throw companyError;

        setVendorCompany(company);
      } catch (error) {
        console.error('Error fetching vendor data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchVendorData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    navigate('/vendors/complete-profile');
    return null;
  }

  if (!vendorCompany) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No vendor profile found.</p>
        </div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(vendorCompany.status);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Vendor Status</h1>
            <p className="text-muted-foreground">
              View your current vendor profile and approval status
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <StatusIcon className="h-6 w-6" />
              <div>
                <CardTitle className="flex items-center gap-3">
                  {vendorCompany.company_name}
                  <Badge variant={getStatusBadgeVariant(vendorCompany.status)}>
                    {vendorCompany.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {getStatusMessage(vendorCompany.status)}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Company Email:</span>
                  <span className="text-muted-foreground">{vendorCompany.company_email}</span>
                </div>
                {vendorCompany.company_address && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="font-medium">Address:</span>
                      <p className="text-muted-foreground">{vendorCompany.company_address}</p>
                    </div>
                  </div>
                )}
                {vendorCompany.contact_person && (
                  <div className="text-sm">
                    <span className="font-medium">Contact Person:</span>
                    <span className="text-muted-foreground ml-2">{vendorCompany.contact_person}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="text-sm">
                  <span className="font-medium">Submitted:</span>
                  <span className="text-muted-foreground ml-2">
                    {new Date(vendorCompany.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                {vendorCompany.status === 'approved' && vendorCompany.contract_start_date && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Contract Start:</span>
                      <span className="text-muted-foreground">
                        {new Date(vendorCompany.contract_start_date).toLocaleDateString()}
                      </span>
                    </div>
                    {vendorCompany.contract_end_date && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Contract End:</span>
                        <span className="text-muted-foreground">
                          {new Date(vendorCompany.contract_end_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {vendorCompany.status === 'approved' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">✓ Congratulations!</CardTitle>
              <CardDescription>
                Your vendor profile has been approved. You are now an active vendor in our system.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}