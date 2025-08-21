import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { VendorSidebar } from './VendorSidebar';

export function VendorLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Hamburger Menu in Header - Always Visible */}
        <header className="fixed top-0 left-0 right-0 h-14 bg-background border-b border-border z-50 flex items-center px-4">
          <SidebarTrigger className="mr-2" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">V</span>
            </div>
            <span className="font-semibold text-foreground">Vendor Portal</span>
          </div>
        </header>

        <div className="flex w-full pt-14">
          <VendorSidebar />
          
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}