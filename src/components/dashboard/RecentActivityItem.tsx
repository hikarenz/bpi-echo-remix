import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentActivityItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  timestamp: string;
  type?: 'success' | 'warning' | 'info' | 'default';
}

export function RecentActivityItem({ 
  icon: Icon, 
  title, 
  description, 
  timestamp, 
  type = 'default' 
}: RecentActivityItemProps) {
  const typeStyles = {
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    info: 'bg-info/10 text-info border-info/20',
    default: 'bg-secondary text-muted-foreground border-border'
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-secondary/50 transition-colors">
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center border",
        typeStyles[type]
      )}>
        <Icon className="h-5 w-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-card-foreground truncate">{title}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        <p className="text-xs text-muted-foreground mt-2">{timestamp}</p>
      </div>
    </div>
  );
}