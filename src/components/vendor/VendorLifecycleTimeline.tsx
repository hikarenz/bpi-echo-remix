import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText, 
  UserCheck, 
  Shield, 
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface LifecycleStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming' | 'rejected';
  completedAt?: string;
  duration?: number;
  icon: any;
}

interface VendorLifecycleTimelineProps {
  vendorStatus: string;
  createdAt: string;
  profileSubmittedAt?: string;
  profileApprovedAt?: string;
  onboardingStartedAt?: string;
  fullyApprovedAt?: string;
  contractStartDate?: string;
  contractEndDate?: string;
}

export function VendorLifecycleTimeline({ 
  vendorStatus,
  createdAt,
  profileSubmittedAt,
  profileApprovedAt,
  onboardingStartedAt,
  fullyApprovedAt,
  contractStartDate,
  contractEndDate
}: VendorLifecycleTimelineProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getStepStatus = (stepId: string): 'completed' | 'current' | 'upcoming' | 'rejected' => {
    switch (vendorStatus) {
      case 'profile_pending':
        if (stepId === 'profile_submission') return 'current';
        return 'upcoming';
      
      case 'profile_approved':
        if (stepId === 'profile_submission') return 'completed';
        if (stepId === 'profile_review') return 'completed';
        if (stepId === 'onboarding') return 'current';
        return 'upcoming';
      
      case 'profile_rejected':
        if (stepId === 'profile_submission') return 'completed';
        if (stepId === 'profile_review') return 'rejected';
        return 'upcoming';
      
      case 'onboarding_in_progress':
        if (stepId === 'profile_submission' || stepId === 'profile_review') return 'completed';
        if (stepId === 'onboarding') return 'current';
        return 'upcoming';
      
      case 'fully_approved':
        if (stepId === 'contract_active') return contractStartDate ? 'completed' : 'upcoming';
        return 'completed';
      
      default:
        return 'upcoming';
    }
  };

  const lifecycleSteps: LifecycleStep[] = [
    {
      id: 'profile_submission',
      title: 'Profile Submission',
      description: 'Initial vendor profile and company information submitted',
      status: getStepStatus('profile_submission'),
      completedAt: profileSubmittedAt || createdAt,
      icon: FileText
    },
    {
      id: 'profile_review',
      title: 'Profile Review',
      description: 'Admin review and verification of vendor credentials',
      status: getStepStatus('profile_review'),
      completedAt: profileApprovedAt,
      duration: profileApprovedAt && profileSubmittedAt ? 
        Math.floor((new Date(profileApprovedAt).getTime() - new Date(profileSubmittedAt).getTime()) / (1000 * 60 * 60 * 24)) : 
        undefined,
      icon: UserCheck
    },
    {
      id: 'onboarding',
      title: 'Onboarding Process',
      description: 'Complete compliance documents and security assessments',
      status: getStepStatus('onboarding'),
      completedAt: onboardingStartedAt,
      icon: Shield
    },
    {
      id: 'final_approval',
      title: 'Final Approval',
      description: 'Complete vendor approval and system activation',
      status: getStepStatus('final_approval'),
      completedAt: fullyApprovedAt,
      icon: Award
    },
    {
      id: 'contract_active',
      title: 'Active Contract',
      description: 'Contract period and active vendor relationship',
      status: getStepStatus('contract_active'),
      completedAt: contractStartDate,
      icon: CheckCircle
    }
  ];

  const completedSteps = lifecycleSteps.filter(step => step.status === 'completed').length;
  const totalSteps = lifecycleSteps.length;
  const progressPercent = (completedSteps / totalSteps) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'current':
        return <Clock className="h-5 w-5 text-warning" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-success/10 text-success border-success/20">Completed</Badge>;
      case 'current':
        return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">In Progress</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground">Upcoming</Badge>;
    }
  };

  return (
    <Card className="card-glossy-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Vendor Lifecycle Timeline
            </CardTitle>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium">{completedSteps}/{totalSteps} steps completed</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <div className="space-y-4">
            {lifecycleSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isLast = index === lifecycleSteps.length - 1;
              
              return (
                <div key={step.id} className="relative">
                  {/* Timeline line */}
                  {!isLast && (
                    <div className="absolute left-6 top-12 w-0.5 h-8 bg-border" />
                  )}
                  
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`
                      flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center
                      ${step.status === 'completed' ? 'bg-success/10 border-success text-success' :
                        step.status === 'current' ? 'bg-warning/10 border-warning text-warning' :
                        step.status === 'rejected' ? 'bg-destructive/10 border-destructive text-destructive' :
                        'bg-muted border-muted-foreground/20 text-muted-foreground'}
                    `}>
                      <StepIcon className="h-5 w-5" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{step.title}</h4>
                        {getStatusBadge(step.status)}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1">
                        {step.description}
                      </p>
                      
                      {step.completedAt && (
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>
                            {step.status === 'completed' ? 'Completed: ' : 'Started: '}
                            {format(new Date(step.completedAt), 'MMM dd, yyyy')}
                          </span>
                          {step.duration && (
                            <span>• Duration: {step.duration} days</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
}