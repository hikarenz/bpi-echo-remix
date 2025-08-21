import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { 
  LayoutDashboard, 
  LogOut,
  BookOpen,
  Menu
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

interface VendorStatus {
  status: string;
}

export function VendorSidebar() {
  const { user, signOut } = useAuth();
  const { state } = useSidebar();
  const location = useLocation();
  const [vendorStatus, setVendorStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const collapsed = state === 'collapsed';

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

  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50";

  if (loading) {
    return (
      <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
        <SidebarContent>
          <div className="p-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="p-4 flex items-center gap-3">
          {!collapsed && (
            <>
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">V</span>
              </div>
              <span className="font-semibold text-sidebar-foreground">Vendor Hub</span>
            </>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
              <span className="text-sm font-bold text-primary-foreground">V</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.href} 
                      end 
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.name}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <LogOut className="h-4 w-4" />
                {!collapsed && <span>Sign Out</span>}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}