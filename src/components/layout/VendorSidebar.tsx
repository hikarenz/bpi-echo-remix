import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  UserPlus, 
  Activity, 
  RefreshCw, 
  ArrowLeft,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VendorSidebarProps {
  open: boolean;
  onToggle: () => void;
}

const vendorNavigationItems = [
  { name: 'Vendor Dashboard', href: '/vendors', icon: LayoutDashboard },
  { name: 'Existing Dashboard', href: '/vendors/dashboard', icon: Activity },
  { name: 'Evaluation', href: '/vendors/evaluation', icon: ClipboardCheck },
  { name: 'Active Management', href: '/vendors/active-management', icon: UserPlus },
  { name: 'Renewal', href: '/vendors/renewal', icon: RefreshCw },
  { name: 'Back', href: '/', icon: ArrowLeft },
];

export function VendorSidebar({ open, onToggle }: VendorSidebarProps) {
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
          {vendorNavigationItems.map((item) => (
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

      {open && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="bg-sidebar-accent rounded-lg p-3 text-sm">
            <p className="font-medium text-sidebar-accent-foreground mb-1">Vendor Management</p>
            <p className="text-xs text-muted-foreground">
              Manage all vendor relationships and compliance.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}