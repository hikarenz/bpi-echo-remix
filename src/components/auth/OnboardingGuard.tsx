import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vendorStatus, setVendorStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(true);

  useEffect(() => {
    async function checkOnboardingAccess() {
      if (!user) {
        navigate('/auth');
        return;
      }

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

        // Fetch vendor company status
        const { data: company, error: companyError } = await supabase
          .from('vendor_companies')
          .select('status')
          .eq('id', vendorUser.vendor_company_id)
          .single();

        if (companyError) throw companyError;

        setVendorStatus(company.status);
        setLoading(false);

        // Check if vendor can access onboarding
        const allowedStatuses = ['profile_approved', 'onboarding_in_progress', 'fully_approved'];
        if (!allowedStatuses.includes(company.status)) {
          navigate('/vendors');
          return;
        }

      } catch (error) {
        console.error('Error checking onboarding access:', error);
        navigate('/vendors');
      }
    }

    checkOnboardingAccess();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    navigate('/vendors/complete-profile');
    return null;
  }

  const allowedStatuses = ['profile_approved', 'onboarding_in_progress', 'fully_approved'];
  if (!vendorStatus || !allowedStatuses.includes(vendorStatus)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <CardTitle>Access Restricted</CardTitle>
            </div>
            <CardDescription>
              You cannot access onboarding at this time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {vendorStatus === 'profile_pending' && (
                <p>Your vendor profile is currently awaiting admin review. You will be notified once approved.</p>
              )}
              {vendorStatus === 'profile_rejected' && (
                <p>Your vendor profile was rejected. Please contact support for assistance and resubmit your profile.</p>
              )}
              {!vendorStatus && (
                <p>Please complete your vendor profile first.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}