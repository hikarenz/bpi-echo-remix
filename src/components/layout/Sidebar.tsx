import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  UserPlus, 
  Activity, 
  RefreshCw, 
  UserX,
  Bot,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Evaluation', href: '/evaluation', icon: ClipboardCheck },
  { name: 'Onboarding', href: '/onboarding', icon: UserPlus },
  { name: 'Active Management', href: '/active-management', icon: Activity },
  { name: 'Renewal/Exit', href: '/renewal-exit', icon: RefreshCw },
  { name: 'Offboarding', href: '/offboarding', icon: UserX },
  { name: 'Echo AI', href: '/echo-ai', icon: Bot },
];

export function Sidebar({ open, onToggle }: SidebarProps) {
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
            <span className="font-semibold text-sidebar-foreground">VendorPro</span>
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

      {open && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="bg-sidebar-accent rounded-lg p-3 text-sm">
            <p className="font-medium text-sidebar-accent-foreground mb-1">Need Help?</p>
            <p className="text-xs text-muted-foreground">
              Check our documentation or contact support.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}