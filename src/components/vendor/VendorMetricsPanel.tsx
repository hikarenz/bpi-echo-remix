import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Shield, 
  Star, 
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface VendorMetricsPanelProps {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: string;
  contractStartDate?: string;
  contractEndDate?: string;
}

export function VendorMetricsPanel({ 
  riskLevel, 
  status, 
  contractStartDate, 
  contractEndDate 
}: VendorMetricsPanelProps) {
  
  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-success';
      case 'medium':
        return 'text-warning';
      case 'high':
        return 'text-destructive';
      case 'critical':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getRiskLevelBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return <Badge variant="default" className="bg-success/10 text-success border-success/20">Low Risk</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">Medium Risk</Badge>;
      case 'high':
        return <Badge variant="destructive" className="bg-destructive/10">High Risk</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critical Risk</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRiskScore = (risk: string) => {
    switch (risk) {
      case 'low':
        return 85;
      case 'medium':
        return 65;
      case 'high':
        return 40;
      case 'critical':
        return 15;
      default:
        return 50;
    }
  };

  const getComplianceScore = () => {
    // Mock compliance score based on status
    switch (status) {
      case 'fully_approved':
        return 95;
      case 'onboarding_in_progress':
        return 70;
      case 'profile_approved':
        return 50;
      default:
        return 30;
    }
  };

  const getPerformanceScore = () => {
    // Mock performance score
    if (status === 'fully_approved') {
      return Math.floor(Math.random() * 20) + 80; // 80-100
    }
    return 0;
  };

  const complianceScore = getComplianceScore();
  const performanceScore = getPerformanceScore();
  const riskScore = getRiskScore(riskLevel);

  const getContractDaysRemaining = () => {
    if (!contractEndDate) return null;
    const today = new Date();
    const endDate = new Date(contractEndDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const contractDaysRemaining = getContractDaysRemaining();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Risk Assessment */}
      <Card className="card-glossy-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className={`h-5 w-5 ${getRiskLevelColor(riskLevel)}`} />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Risk Level</span>
              {getRiskLevelBadge(riskLevel)}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Risk Score</span>
                <span className="font-medium">{riskScore}/100</span>
              </div>
              <Progress 
                value={riskScore} 
                className={`h-2 ${
                  riskScore >= 70 ? '[&>div]:bg-success' :
                  riskScore >= 50 ? '[&>div]:bg-warning' :
                  '[&>div]:bg-destructive'
                }`}
              />
            </div>

            {riskLevel === 'critical' || riskLevel === 'high' ? (
              <div className="flex items-start gap-2 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-destructive">High Risk Alert</p>
                  <p className="text-muted-foreground">
                    Enhanced monitoring and compliance measures required.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 p-3 bg-success/5 border border-success/20 rounded-lg">
                <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-success">Good Standing</p>
                  <p className="text-muted-foreground">
                    Vendor meets all risk management requirements.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="card-glossy-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Compliance Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Compliance Rate</span>
                <span>{complianceScore}%</span>
              </div>
              <Progress value={complianceScore} className="h-2" />
            </div>

            {/* Performance Score (only if fully approved) */}
            {performanceScore > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Performance Score</span>
                  <span>{performanceScore}%</span>
                </div>
                <Progress value={performanceScore} className="h-2" />
              </div>
            )}

            {/* Contract Status */}
            {contractStartDate && (
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Contract Status</span>
                </div>
                
                {contractDaysRemaining !== null && (
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Days Remaining</span>
                      <span className={`font-medium ${contractDaysRemaining < 30 ? 'text-warning' : ''}`}>
                        {contractDaysRemaining}
                      </span>
                    </div>
                    
                    {contractDaysRemaining < 90 && (
                      <div className="flex items-start gap-2 mt-2 p-2 bg-warning/5 border border-warning/20 rounded">
                        <AlertTriangle className="h-3 w-3 text-warning mt-0.5" />
                        <p className="text-xs text-warning">
                          Contract renewal process should begin soon
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}