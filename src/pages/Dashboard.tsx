import { 
  Users, 
  Shield, 
  AlertTriangle, 
  Calendar, 
  TrendingUp, 
  FileText,
  UserCheck,
  AlertCircle,
  Clock
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { RecentActivityItem } from '@/components/dashboard/RecentActivityItem';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Dummy data for the dashboard
const kpiData = [
  {
    title: 'Total Vendors',
    value: '248',
    description: '+12 this month',
    icon: Users,
    trend: { value: 8.2, isPositive: true },
    variant: 'default' as const
  },
  {
    title: 'Compliance Rate',
    value: '94.2%',
    description: 'Above target',
    icon: Shield,
    trend: { value: 2.1, isPositive: true },
    variant: 'success' as const
  },
  {
    title: 'High-Risk Vendors',
    value: '14',
    description: 'Requires attention',
    icon: AlertTriangle,
    trend: { value: -5.3, isPositive: false },
    variant: 'warning' as const
  },
  {
    title: 'Expiring Contracts',
    value: '23',
    description: 'Next 30 days',
    icon: Calendar,
    trend: { value: 15.7, isPositive: false },
    variant: 'danger' as const
  },
  {
    title: 'Avg Performance Score',
    value: '87.5',
    description: 'Out of 100',
    icon: TrendingUp,
    trend: { value: 3.2, isPositive: true },
    variant: 'success' as const
  },
  {
    title: 'Pending Assessments',
    value: '31',
    description: 'Awaiting review',
    icon: FileText,
    variant: 'default' as const
  }
];

const performanceData = [
  { name: 'Jan', value: 82 },
  { name: 'Feb', value: 85 },
  { name: 'Mar', value: 83 },
  { name: 'Apr', value: 88 },
  { name: 'May', value: 86 },
  { name: 'Jun', value: 91 },
  { name: 'Jul', value: 87 },
];

const recentActivities = [
  {
    icon: UserCheck,
    title: 'New vendor approved',
    description: 'TechSolutions Inc. completed onboarding process',
    timestamp: '2 hours ago',
    type: 'success' as const
  },
  {
    icon: AlertCircle,
    title: 'Compliance alert',
    description: 'DataCorp failed security assessment',
    timestamp: '4 hours ago',
    type: 'warning' as const
  },
  {
    icon: FileText,
    title: 'Contract renewed',
    description: 'CloudServices LLC - 2 year extension',
    timestamp: '6 hours ago',
    type: 'info' as const
  },
  {
    icon: Clock,
    title: 'Assessment scheduled',
    description: 'Quarterly review for 12 vendors',
    timestamp: '1 day ago',
    type: 'default' as const
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your vendor ecosystem performance
          </p>
        </div>
        
        <div className="flex gap-3">
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {kpiData.map((kpi, index) => (
          <StatCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            description={kpi.description}
            icon={kpi.icon}
            trend={kpi.trend}
            variant={kpi.variant}
          />
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Trend Chart */}
        <div className="lg:col-span-2">
          <TrendChart
            data={performanceData}
            title="Performance Score Trends"
            description="Average vendor performance over the last 7 months"
            height={350}
          />
        </div>

        {/* Recent Activity */}
        <Card className="card-gradient">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-card-foreground">Recent Activity</h3>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary-hover">
                View All
              </Button>
            </div>
            
            <div className="space-y-1">
              {recentActivities.map((activity, index) => (
                <RecentActivityItem
                  key={index}
                  icon={activity.icon}
                  title={activity.title}
                  description={activity.description}
                  timestamp={activity.timestamp}
                  type={activity.type}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-gradient">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex flex-col gap-2">
            <Users className="h-6 w-6" />
            <span className="text-sm">Add Vendor</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2">
            <FileText className="h-6 w-6" />
            <span className="text-sm">Start Assessment</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2">
            <Shield className="h-6 w-6" />
            <span className="text-sm">Upload Contract</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2">
            <Calendar className="h-6 w-6" />
            <span className="text-sm">Schedule Review</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}