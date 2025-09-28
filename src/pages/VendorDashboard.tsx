import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertCircle, Building, Calendar, MapPin, LogOut, TrendingUp, Users, Award } from 'lucide-react';
import { VendorLifecycleTimeline } from '@/components/vendor/VendorLifecycleTimeline';
import { VendorDocumentPanel } from '@/components/vendor/VendorDocumentPanel';
import { VendorMetricsPanel } from '@/components/vendor/VendorMetricsPanel';
import { VendorNotificationsPanel } from '@/components/vendor/VendorNotificationsPanel';

interface VendorCompany {
  id: string;
  company_name: string;
  company_email: string;
  company_address: string | null;
  contact_person: string | null;
  contact_phone: string | null;
  status: 'profile_pending' | 'profile_approved' | 'profile_rejected' | 'onboarding_in_progress' | 'fully_approved' | 'pending' | 'approved' | 'rejected' | 'suspended';
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  contract_start_date: string | null;
  contract_end_date: string | null;
  created_at: string;
  profile_submitted_at?: string;
  profile_approved_at?: string;
  onboarding_started_at?: string;
  fully_approved_at?: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'profile_approved':
    case 'fully_approved':
    case 'approved':
      return CheckCircle;
    case 'profile_rejected':
    case 'rejected':
    case 'suspended':
      return AlertCircle;
    default:
      return Clock;
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'profile_approved':
    case 'fully_approved':
    case 'approved':
      return 'default';
    case 'profile_rejected':
    case 'rejected':
    case 'suspended':
      return 'destructive';
    case 'onboarding_in_progress':
      return 'secondary';
    default:
      return 'outline';
  }
};

const getStatusMessage = (status: string) => {
  switch (status) {
    case 'profile_pending':
      return 'Your vendor profile has been submitted and is awaiting admin review.';
    case 'profile_approved':
      return 'Your vendor profile has been approved! You can now access the onboarding workflow.';
    case 'profile_rejected':
      return 'Your vendor profile was rejected. Please contact support and resubmit with corrections.';
    case 'onboarding_in_progress':
      return 'Your onboarding is in progress. Complete all required steps to become fully approved.';
    case 'fully_approved':
      return 'Congratulations! You are now a fully approved vendor in our system.';
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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient">Vendor Dashboard</h1>
            <p className="text-muted-foreground">
              Complete view of your vendor lifecycle and performance
            </p>
          </div>
        </div>

        {/* Main Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Status Card */}
          <Card className="card-glossy-hover lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <StatusIcon className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle className="flex items-center gap-3 text-gradient">
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

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card className="card-glossy-hover">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Performance</p>
                    <p className="text-2xl font-bold text-success">
                      {vendorCompany.status === 'fully_approved' ? '95%' : 
                       vendorCompany.status === 'onboarding_in_progress' ? '70%' : '50%'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-glossy-hover">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-info/10 rounded-lg">
                    <Users className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Risk Level</p>
                    <p className={`text-2xl font-bold ${
                      vendorCompany.risk_level === 'low' ? 'text-success' :
                      vendorCompany.risk_level === 'medium' ? 'text-warning' :
                      'text-destructive'
                    }`}>
                      {vendorCompany.risk_level.toUpperCase()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-glossy-hover">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <Award className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-sm font-bold capitalize">
                      {vendorCompany.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lifecycle Timeline */}
        <VendorLifecycleTimeline
          vendorStatus={vendorCompany.status}
          createdAt={vendorCompany.created_at}
          profileSubmittedAt={vendorCompany.profile_submitted_at}
          profileApprovedAt={vendorCompany.profile_approved_at}
          onboardingStartedAt={vendorCompany.onboarding_started_at}
          fullyApprovedAt={vendorCompany.fully_approved_at}
          contractStartDate={vendorCompany.contract_start_date}
          contractEndDate={vendorCompany.contract_end_date}
        />

        {/* Performance Metrics */}
        <VendorMetricsPanel
          riskLevel={vendorCompany.risk_level}
          status={vendorCompany.status}
          contractStartDate={vendorCompany.contract_start_date}
          contractEndDate={vendorCompany.contract_end_date}
        />

        {/* Document Management */}
        <VendorDocumentPanel vendorCompanyId={vendorCompany.id} />

        {/* Notifications */}
        <VendorNotificationsPanel userId={user?.id || ''} />

        {/* Status-specific action cards */}
        {vendorCompany.status === 'profile_approved' && (
          <Card className="card-glossy-hover">
            <CardHeader>
              <CardTitle className="text-success">✓ Profile Approved!</CardTitle>
              <CardDescription>
                Your vendor profile has been approved. You can now proceed with the onboarding workflow.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/vendors/onboarding')}
                className="w-full"
              >
                Start Onboarding Process
              </Button>
            </CardContent>
          </Card>
        )}

        {vendorCompany.status === 'onboarding_in_progress' && (
          <Card className="card-glossy-hover">
            <CardHeader>
              <CardTitle className="text-info">📋 Onboarding in Progress</CardTitle>
              <CardDescription>
                Complete all onboarding steps to become a fully approved vendor.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/vendors/onboarding')}
                className="w-full"
                variant="outline"
              >
                Continue Onboarding
              </Button>
            </CardContent>
          </Card>
        )}

        {vendorCompany.status === 'fully_approved' && (
          <Card className="card-glossy-hover">
            <CardHeader>
              <CardTitle className="text-success">🎉 Fully Approved!</CardTitle>
              <CardDescription>
                Congratulations! You are now a fully approved vendor in our system. Your contract is active and you can begin providing services.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline">
                  View Contract Details
                </Button>
                <Button variant="outline">
                  Access Vendor Portal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {vendorCompany.status === 'profile_rejected' && (
          <Card className="card-glossy-hover">
            <CardHeader>
              <CardTitle className="text-destructive">❌ Profile Rejected</CardTitle>
              <CardDescription>
                Your vendor profile was rejected. Please review the feedback, make necessary corrections, and resubmit for review.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="destructive">
                  View Rejection Details
                </Button>
                <Button variant="outline">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}