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
          // If vendor is on admin routes, redirect to vendor area
          if (currentPath === '/' || currentPath.startsWith('/manage-vendors') || currentPath.startsWith('/echo-ai')) {
            navigate('/vendors');
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