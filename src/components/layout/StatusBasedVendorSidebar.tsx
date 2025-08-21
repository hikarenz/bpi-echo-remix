import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { 
  LayoutDashboard, 
  ChevronLeft,
  LogOut,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VendorSidebarProps {
  open: boolean;
  onToggle: () => void;
}

interface VendorStatus {
  status: string;
}

export function StatusBasedVendorSidebar({ open, onToggle }: VendorSidebarProps) {
  const { user, signOut } = useAuth();
  const [vendorStatus, setVendorStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVendorStatus() {
      if (!user) return;

      try {
        // Check if user has a vendor company association
        const { data: vendorUser, error: vendorUserError } = await supabase
          .from('vendor_users')
          .select('vendor_company_id')
          .eq('user_id', user.id)
          .single();

        if (vendorUserError || !vendorUser) {
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
      } catch (error) {
        console.error('Error fetching vendor status:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchVendorStatus();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  // Base navigation items
  const baseNavigationItems = [
    { name: 'My Status', href: '/vendors', icon: LayoutDashboard },
  ];

  // Conditionally add onboarding if status allows
  const navigationItems = [...baseNavigationItems];
  
  if (vendorStatus === 'profile_approved' || vendorStatus === 'onboarding_in_progress' || vendorStatus === 'fully_approved') {
    navigationItems.push(
      { name: 'Onboarding', href: '/vendors/onboarding', icon: BookOpen }
    );
  }

  if (loading) {
    return (
      <aside className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        open ? "w-64" : "w-16"
      )}>
        <div className="p-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        open ? "w-64" : "w-16",
        "lg:relative absolute lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        {open && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">V</span>
            </div>
            <span className="font-semibold text-sidebar-foreground">Vendor Hub</span>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="hidden lg:flex"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", !open && "rotate-180")} />
        </Button>
      </div>

      <nav className="flex-1 px-4 py-2">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground"
                  )
                }
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {open && <span className="truncate">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {open && <span className="ml-3">Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
}