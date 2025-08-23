import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface RoleBasedRouterProps {
  children: React.ReactNode;
}

export function RoleBasedRouter({ children }: RoleBasedRouterProps) {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      if (!user) {
        setRoleLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        setUserRole(data.role);
        
        // Redirect based on role
        const currentPath = window.location.pathname;
        
        if (data.role === 'vendor') {
          // Check if vendor has completed profile setup
          const { data: vendorUser } = await supabase
            .from('vendor_users')
            .select('vendor_company_id')
            .eq('user_id', user.id)
            .single();
          
          if (vendorUser?.vendor_company_id) {
            // Vendor is linked to a company, check company status
            const { data: company } = await supabase
              .from('vendor_companies')
              .select('status, profile_submitted_at')
              .eq('id', vendorUser.vendor_company_id)
              .single();
            
            if (company) {
              if (!company.profile_submitted_at) {
                // Redirect to profile completion
                if (currentPath !== '/vendors/profile-completion') {
                  navigate('/vendors/profile-completion');
                }
              } else if (company.status === 'pending') {
                // Redirect to onboarding
                if (currentPath !== '/vendors/onboarding') {
                  navigate('/vendors/onboarding');
                }
              } else {
                // Redirect to vendor dashboard
                if (currentPath === '/' || currentPath.startsWith('/manage-vendors') || currentPath.startsWith('/echo-ai')) {
                  navigate('/vendors');
                }
              }
            }
          } else {
            // Vendor not linked to any company - this shouldn't happen with invitations
            if (currentPath === '/' || currentPath.startsWith('/manage-vendors') || currentPath.startsWith('/echo-ai')) {
              navigate('/vendors');
            }
          }
        } else if (data.role === 'bpi_admin') {
          // If admin is on vendor routes, redirect to admin dashboard
          if (currentPath.startsWith('/vendors')) {
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setRoleLoading(false);
      }
    }

    fetchUserRole();
  }, [user, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}