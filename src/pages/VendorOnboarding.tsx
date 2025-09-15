import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertTriangle, FileText, CreditCard, Shield } from 'lucide-react';
import { OnboardingGuard } from '@/components/auth/OnboardingGuard';

const onboardingSteps = [
  { 
    id: 1, 
    name: "Compliance Documents Upload", 
    description: "Upload required compliance and legal documents",
    status: "not-started", 
    progress: 0,
    icon: FileText 
  },
  { 
    id: 2, 
    name: "Payment Setup", 
    description: "Configure payment methods and banking information",
    status: "not-started", 
    progress: 0,
    icon: CreditCard 
  },
  { 
    id: 3, 
    name: "Security Assessment", 
    description: "Complete security questionnaire and verification",
    status: "not-started", 
    progress: 0,
    icon: Shield 
  }
];

const complianceDocuments = [
  { id: 1, name: "W-9 Tax Form", required: true, status: "pending" },
  { id: 2, name: "Insurance Certificate", required: true, status: "pending" },
  { id: 3, name: "Data Processing Agreement", required: true, status: "pending" },
  { id: 4, name: "Background Check", required: false, status: "pending" }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed": 
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "in-progress": 
      return <Clock className="h-4 w-4 text-blue-600" />;
    case "warning": 
      return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    default: 
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
};

const getStepStatusVariant = (status: string) => {
  switch (status) {
    case "completed": return "default";
    case "in-progress": return "secondary";
    case "not-started": return "outline";
    default: return "outline";
  }
};

export default function VendorOnboarding() {
  const { user } = useAuth();
  const [vendorCompany, setVendorCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState(onboardingSteps);

  useEffect(() => {
    async function fetchVendorData() {
      if (!user) return;

      try {
        // Get vendor company info
        const { data: vendorUser } = await supabase
          .from('vendor_users')
          .select('vendor_company_id')
          .eq('user_id', user.id)
          .single();

        if (!vendorUser) return;

        const { data: company } = await supabase
          .from('vendor_companies')
          .select('*')
          .eq('id', vendorUser.vendor_company_id)
          .single();

        setVendorCompany(company);

        // Update status to onboarding_in_progress if it's profile_approved
        if (company?.status === 'profile_approved') {
          await supabase
            .from('vendor_companies')
            .update({ status: 'onboarding_in_progress' })
            .eq('id', company.id);
        }

      } catch (error) {
        console.error('Error fetching vendor data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchVendorData();
  }, [user]);

  const overallProgress = Math.round(
    steps.reduce((acc, step) => acc + step.progress, 0) / steps.length
  );

  const handleStepClick = (stepId: number) => {
    // Handle different step actions
    switch (stepId) {
      case 1:
        // Compliance Documents Upload - scroll to documents section
        document.getElementById('compliance-documents')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 2:
        // Payment Setup
        alert('Payment setup will be configured after document approval. Please complete document upload first.');
        break;
      case 3:
        // Security Assessment
        alert('Security assessment will be conducted by our team after initial approval.');
        break;
      default:
        console.log('Step clicked:', stepId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading onboarding...</p>
        </div>
      </div>
    );
  }

  return (
    <OnboardingGuard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vendor Onboarding</h1>
            <p className="text-muted-foreground">
              Complete all steps to become a fully approved vendor
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{overallProgress}%</div>
            <div className="text-sm text-muted-foreground">Complete</div>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="card-glossy-hover">
          <CardHeader>
            <CardTitle className="text-gradient">Onboarding Progress</CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Your progress through the vendor onboarding process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="h-3 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm truncate">{step.name}</h4>
                        <Badge variant={getStepStatusVariant(step.status)} className="text-xs">
                          {step.status.replace("-", " ")}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{step.description}</p>
                      <Progress value={step.progress} className="h-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Onboarding Steps */}
          <Card className="card-glossy-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gradient">
                <FileText className="h-5 w-5 text-primary" />
                Onboarding Steps
              </CardTitle>
              <CardDescription className="text-muted-foreground/80">
                Complete each step to progress through onboarding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={step.id} className="flex items-center gap-4 p-4 rounded-lg border border-border/50">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{step.name}</h4>
                        <Badge variant={getStepStatusVariant(step.status)} className="text-xs">
                          {step.status.replace("-", " ")}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{step.description}</p>
                      <div className="flex items-center gap-2">
                        <Progress value={step.progress} className="flex-1 h-2" />
                        <span className="text-xs text-muted-foreground w-10">{step.progress}%</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      disabled={step.status === "completed"}
                      onClick={() => handleStepClick(step.id)}
                    >
                      {step.status === "completed" ? "Complete" : "Start"}
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Compliance Documents */}
          <Card className="card-glossy-hover" id="compliance-documents">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gradient">
                <Shield className="h-5 w-5 text-primary" />
                Compliance Documents
              </CardTitle>
              <CardDescription className="text-muted-foreground/80">
                Required documents for vendor approval
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {complianceDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(doc.status)}
                    <div>
                      <span className="text-sm font-medium">{doc.name}</span>
                      {doc.required && (
                        <Badge variant="outline" className="ml-2 text-xs">Required</Badge>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    {doc.status === "completed" ? "View" : "Upload"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Action Panel */}
        <Card className="card-glossy-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Ready to submit for final review?</h3>
                <p className="text-sm text-muted-foreground">
                  Complete all steps above before submitting for final approval.
                </p>
              </div>
              <Button disabled={overallProgress < 100}>
                Submit for Final Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </OnboardingGuard>
  );
}