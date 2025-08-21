import { Search, Bell, User, Plus, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TopNavigationProps {
  onSidebarToggle: () => void;
}

export function TopNavigation({ onSidebarToggle }: TopNavigationProps) {
  return (
    <header className="nav-glass h-16 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSidebarToggle}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">V</span>
          </div>
          <span className="text-xl font-semibold text-gradient">Echo Helps</span>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors, contracts, assessments..."
            className="pl-10 bg-secondary border-border-hover"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive">
            3
          </Badge>
        </Button>
        
        <Button variant="ghost" size="sm" className="w-8 h-8 rounded-full p-0">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}