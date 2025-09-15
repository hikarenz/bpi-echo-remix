import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Zap, AlertCircle, Clock, CheckCircle, Brain, Target, TrendingUp } from 'lucide-react';
import MeetingSchedulerModal from '@/components/renewal/MeetingSchedulerModal';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Same AI recommendations data as in Dashboard
const aiRecommendations = [
  {
    type: 'Renewal',
    vendor: 'GCash',
    urgency: 'High',
    action: 'Initiate renewal talks immediately',
    reason: 'High-value contract expiring in 52 days with pending IT risk issues',
    confidence: 94,
    details: {
      contractValue: '₱120M',
      expirationDate: '2024-03-15',
      riskFactors: ['BSP Circular 982 (IT Risk) - remediation pending', 'High transaction volume dependency'],
      businessImpact: 'Critical service disruption risk',
      recommendations: [
        'Schedule immediate meeting with GCash leadership',
        'Require IT risk remediation plan before renewal',
        'Consider temporary contract extension if needed',
        'Prepare alternative vendor contingency plan'
      ]
    }
  },
  {
    type: 'Compliance',
    vendor: 'Multiple',
    urgency: 'Medium',
    action: 'Schedule Q4 compliance reviews',
    reason: 'Prepare for upcoming BSP audits and vendor remediation',
    confidence: 89,
    details: {
      affectedVendors: ['2C2P', 'Trusting Social', 'PayMongo'],
      bspCirculars: ['BSP Circular 1007', 'BSP Circular 1198'],
      timeline: '90 days preparation needed',
      businessImpact: 'Regulatory compliance risk',
      recommendations: [
        'Create compliance review schedule for Q4',
        'Allocate budget for vendor remediation activities',
        'Establish BSP audit preparation team',
        'Implement compliance tracking dashboard'
      ]
    }
  },
  {
    type: 'Cost Optimization',
    vendor: 'Tonik vs Maya',
    urgency: 'Low',
    action: 'Consider Maya over Tonik for new integrations',
    reason: 'Better compliance posture and 0.3% lower transaction fees',
    confidence: 85,
    details: {
      costSavings: '₱2.5M annually (estimated)',
      complianceAdvantage: 'Maya has stronger PCI DSS certification',
      migrationEffort: 'Medium - 3-4 months implementation',
      businessImpact: 'Cost reduction and improved compliance',
      recommendations: [
        'Conduct detailed cost-benefit analysis',
        'Evaluate Maya API compatibility',
        'Plan phased migration approach',
        'Negotiate volume discounts with Maya'
      ]
    }
  }
];

export default function RecommendationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  
  const recommendationIndex = parseInt(id || '0');
  const recommendation = aiRecommendations[recommendationIndex];

  const handleScheduleMeeting = (contract: any, meetingData: any) => {
    toast({
      title: "Meeting Scheduled",
      description: `Follow-up meeting scheduled for ${recommendation.vendor}`,
    });
  };

  if (!recommendation) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">Recommendation Not Found</h1>
          <Button onClick={() => navigate('/')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient">EchoAI Recommendation Details</h1>
            <p className="text-muted-foreground">AI-powered strategic recommendation analysis</p>
          </div>
        </div>
      </div>

      {/* Main Recommendation Card */}
      <Card className="card-glossy-hover">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                recommendation.urgency === 'High' ? 'bg-destructive/20 text-destructive' :
                recommendation.urgency === 'Medium' ? 'bg-warning/20 text-warning' :
                'bg-success/20 text-success'
              }`}>
                {recommendation.urgency === 'High' ? <AlertCircle className="h-4 w-4" /> :
                 recommendation.urgency === 'Medium' ? <Clock className="h-4 w-4" /> :
                 <CheckCircle className="h-4 w-4" />}
              </div>
              <div>
                <CardTitle className="text-xl">{recommendation.action}</CardTitle>
                <CardDescription className="text-base mt-1">{recommendation.vendor}</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <Badge variant={recommendation.urgency === 'High' ? 'destructive' : recommendation.urgency === 'Medium' ? 'default' : 'secondary'} className="mb-2">
                {recommendation.urgency} Priority
              </Badge>
              <div className="flex items-center gap-2">
                <Progress value={recommendation.confidence} className="h-2 w-24" />
                <span className="text-sm font-medium">{recommendation.confidence}%</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
            <h3 className="font-semibold mb-2">Analysis Summary</h3>
            <p className="text-muted-foreground">{recommendation.reason}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Badge variant="outline" className="justify-center p-3">
              <Target className="mr-2 h-4 w-4" />
              Type: {recommendation.type}
            </Badge>
            <Badge variant="outline" className="justify-center p-3">
              <TrendingUp className="mr-2 h-4 w-4" />
              Confidence: {recommendation.confidence}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Business Impact */}
        <Card className="card-glossy-hover">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="h-5 w-5 text-warning" />
              Business Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
              <p className="font-medium text-warning">{recommendation.details.businessImpact}</p>
            </div>
            
            {recommendation.details.contractValue && (
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">Contract Value</span>
                <span className="text-lg font-bold text-primary">{recommendation.details.contractValue}</span>
              </div>
            )}
            
            {recommendation.details.costSavings && (
              <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg border border-success/20">
                <span className="font-medium">Potential Savings</span>
                <span className="text-lg font-bold text-success">{recommendation.details.costSavings}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Risk Factors */}
        <Card className="card-glossy-hover">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-destructive" />
              Key Considerations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendation.details.riskFactors?.map((risk, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <span className="text-sm text-destructive">{risk}</span>
              </div>
            ))}
            
            {recommendation.details.affectedVendors && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Affected Vendors</h4>
                <div className="flex flex-wrap gap-2">
                  {recommendation.details.affectedVendors.map((vendor, index) => (
                    <Badge key={index} variant="secondary">{vendor}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Plan */}
      <Card className="card-glossy-hover">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="h-5 w-5 text-success" />
            Recommended Action Plan
          </CardTitle>
          <CardDescription>
            Step-by-step implementation roadmap with priority ordering
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendation.details.recommendations.map((action, index) => (
              <div key={index} className="flex items-start gap-4 p-3 bg-muted/30 rounded-lg">
                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{action}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 pb-4">
        <Button className="flex-1">
          <CheckCircle className="mr-2 h-4 w-4" />
          Mark as Acknowledged
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => setIsScheduleModalOpen(true)}>
          <Clock className="mr-2 h-4 w-4" />
          Schedule Follow-up
        </Button>
      </div>
      
      <MeetingSchedulerModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        contract={{
          id: '1',
          vendorName: recommendation.vendor,
          contractType: recommendation.type,
          value: recommendation.details.contractValue || 'N/A',
          expiryDate: recommendation.details.expirationDate || 'N/A',
          status: 'expiring' as const,
          riskLevel: recommendation.urgency.toLowerCase() as 'high' | 'medium' | 'low'
        }}
        onScheduleMeeting={handleScheduleMeeting}
      />
    </div>
  );
}