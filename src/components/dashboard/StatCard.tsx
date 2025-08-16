import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  variant = 'default',
  className 
}: StatCardProps) {
  const variantStyles = {
    default: 'border-border',
    success: 'border-success/20 bg-success/5',
    warning: 'border-warning/20 bg-warning/5',
    danger: 'border-destructive/20 bg-destructive/5'
  };

  const iconStyles = {
    default: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-destructive'
  };

  return (
    <Card className={cn(
      "card-gradient card-hover p-6 transition-all duration-200",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-card-foreground">{value}</p>
            {trend && (
              <span className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-success" : "text-destructive"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center",
          "bg-secondary/50",
          iconStyles[variant]
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}