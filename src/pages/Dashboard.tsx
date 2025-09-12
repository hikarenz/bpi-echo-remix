import { 
  Users, 
  Shield, 
  AlertTriangle, 
  Calendar, 
  TrendingUp, 
  FileText,
  UserCheck,
  AlertCircle,
  Clock,
  Brain,
  Target,
  Zap,
  CheckCircle,
  XCircle,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '@/components/dashboard/StatCard';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { RecentActivityItem } from '@/components/dashboard/RecentActivityItem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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

// EchoAI Advisor dummy data
const renewalAlerts = [
  {
    vendor: 'GCash (Mynt)',
    daysLeft: 52,
    contractValue: '₱120M',
    priority: 'High',
    fitScore: 89,
    issues: ['BSP Circular 982 (IT Risk) - remediation pending']
  },
  {
    vendor: 'Maya',
    daysLeft: 74,
    contractValue: '₱85M',
    priority: 'Medium',
    fitScore: 87,
    issues: []
  },
  {
    vendor: 'UnionBank',
    daysLeft: 28,
    contractValue: '₱200M',
    priority: 'Critical',
    fitScore: 92,
    issues: []
  }
];

const complianceRisks = [
  {
    vendor: 'GCash',
    circular: 'BSP Circular 982',
    risk: 'IT Risk Management',
    status: 'Remediation Pending',
    deadline: '45 days',
    severity: 'High'
  },
  {
    vendor: '2C2P',
    circular: 'BSP Circular 1007',
    risk: 'InfoSec - MFA Implementation',
    status: 'In Progress',
    deadline: '30 days',
    severity: 'Medium'
  },
  {
    vendor: 'Trusting Social',
    circular: 'BSP Circular 1198',
    risk: 'Risk Automation Deadline',
    status: '60% Complete',
    deadline: '45 days',
    severity: 'High'
  }
];

const vendorBenchmarks = [
  {
    vendor: 'Maya',
    fitScore: 87,
    cost: '1.5% transaction fee',
    compliance: 'PCI DSS certified',
    recommendation: 'Prioritize - stronger compliance, lower cost'
  },
  {
    vendor: 'Tonik',
    fitScore: 73,
    cost: '1.8% transaction fee',
    compliance: 'EMI license renewal pending (90 days)',
    recommendation: 'Monitor - license renewal required'
  },
  {
    vendor: 'GCash',
    fitScore: 89,
    cost: '1.2% transaction fee',
    compliance: 'Full BSP compliance',
    recommendation: 'Strategic partner - maintain relationship'
  }
];

const aiRecommendations = [
  {
    type: 'Renewal',
    vendor: 'GCash',
    urgency: 'High',
    action: 'Initiate renewal talks immediately',
    reason: 'High-value contract expiring in 52 days with pending IT risk issues',
    confidence: 94
  },
  {
    type: 'Compliance',
    vendor: 'Multiple',
    urgency: 'Medium',
    action: 'Schedule Q4 compliance reviews',
    reason: 'Prepare for upcoming BSP audits and vendor remediation',
    confidence: 89
  },
  {
    type: 'Cost Optimization',
    vendor: 'Tonik vs Maya',
    urgency: 'Low',
    action: 'Consider Maya over Tonik for new integrations',
    reason: 'Better compliance posture and 0.3% lower transaction fees',
    confidence: 85
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  
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
        <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-muted/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
          {/* Glossy overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Recent Activity</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary hover:text-primary-hover bg-primary/10 hover:bg-primary/20 backdrop-blur-sm border border-primary/20 hover:border-primary/30 transition-all duration-200"
              >
                View All
              </Button>
            </div>
            
            <div className="space-y-3">
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

      {/* EchoAI Advisor Section */}
      <div className="space-y-6">
        {/* EchoAI Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gradient">EchoAI Advisor</h2>
            <p className="text-muted-foreground">AI-powered vendor assessments and strategic recommendations</p>
          </div>
        </div>

        {/* Renewal Alerts & Compliance Risks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Renewal Alerts */}
          <Card className="card-glossy-hover">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-warning" />
                  Contract Renewals (60 Days)
                </CardTitle>
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                  {renewalAlerts.filter(r => r.daysLeft <= 60).length} Active
                </Badge>
              </div>
              <CardDescription>High-priority renewals requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renewalAlerts.map((renewal, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{renewal.vendor}</h4>
                      <p className="text-sm text-muted-foreground">{renewal.contractValue}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={renewal.priority === 'Critical' ? 'destructive' : renewal.priority === 'High' ? 'default' : 'secondary'}>
                        {renewal.daysLeft} days
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">Fit Score: {renewal.fitScore}/100</p>
                    </div>
                  </div>
                  {renewal.issues.length > 0 && (
                    <div className="flex items-start gap-2 p-2 bg-destructive/10 rounded border border-destructive/20">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        {renewal.issues.map((issue, i) => (
                          <p key={i} className="text-destructive">{issue}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Compliance Risks */}
          <Card className="card-glossy-hover">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-destructive" />
                  BSP Compliance Risks
                </CardTitle>
                <Badge variant="destructive" className="bg-destructive/10">
                  {complianceRisks.length} Issues
                </Badge>
              </div>
              <CardDescription>Regulatory compliance gaps requiring remediation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {complianceRisks.map((risk, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{risk.vendor}</h4>
                      <p className="text-sm text-primary font-medium">{risk.circular}</p>
                    </div>
                    <Badge variant={risk.severity === 'High' ? 'destructive' : 'secondary'}>
                      {risk.severity}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{risk.risk}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Status: {risk.status}</span>
                      <span className="text-warning font-medium">Deadline: {risk.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Vendor Benchmarking */}
        <Card className="card-glossy-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-success" />
              Vendor Benchmarking & Fit Analysis
            </CardTitle>
            <CardDescription>Compare vendors across compliance, cost, and strategic fit metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vendorBenchmarks.map((vendor, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{vendor.vendor}</h4>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-warning" />
                      <span className="font-bold text-lg">{vendor.fitScore}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress value={vendor.fitScore} className="h-2" />
                    <p className="text-xs text-muted-foreground">Fit Score: {vendor.fitScore}/100</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Cost: </span>
                      <span className="text-muted-foreground">{vendor.cost}</span>
                    </div>
                    <div>
                      <span className="font-medium">Compliance: </span>
                      <span className="text-muted-foreground">{vendor.compliance}</span>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-primary/10 rounded border border-primary/20">
                    <p className="text-xs text-primary font-medium">{vendor.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="card-glossy-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Strategic Recommendations
            </CardTitle>
            <CardDescription>AI-powered actionable insights with confidence scores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiRecommendations.map((rec, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/50 space-y-3 border border-primary/10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      rec.urgency === 'High' ? 'bg-destructive/20 text-destructive' :
                      rec.urgency === 'Medium' ? 'bg-warning/20 text-warning' :
                      'bg-success/20 text-success'
                    }`}>
                      {rec.urgency === 'High' ? <AlertCircle className="h-4 w-4" /> :
                       rec.urgency === 'Medium' ? <Clock className="h-4 w-4" /> :
                       <CheckCircle className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{rec.action}</h4>
                        <Badge variant="outline" className="text-xs">
                          {rec.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.vendor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={rec.urgency === 'High' ? 'destructive' : rec.urgency === 'Medium' ? 'default' : 'secondary'}>
                      {rec.urgency}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">Confidence: {rec.confidence}%</p>
                  </div>
                </div>
                
                <div className="p-3 bg-muted/30 rounded border-l-4 border-primary">
                  <p className="text-sm text-muted-foreground">{rec.reason}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Progress value={rec.confidence} className="h-1 w-20" />
                    <span className="text-xs text-muted-foreground">{rec.confidence}% confidence</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs"
                    onClick={() => navigate(`/recommendations/${index}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}