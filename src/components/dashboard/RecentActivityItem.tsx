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
    <div className="group flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/20 transition-all duration-200 hover:scale-[1.02] backdrop-blur-sm border border-border/50">
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center border backdrop-blur-sm shadow-sm transition-all duration-200 group-hover:scale-110",
        typeStyles[type]
      )}>
        <Icon className="h-5 w-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text truncate">{title}</p>
        <p className="text-xs text-muted-foreground/80 mt-1 font-medium">{description}</p>
        <p className="text-xs text-muted-foreground/60 mt-2">{timestamp}</p>
      </div>
    </div>
  );
}