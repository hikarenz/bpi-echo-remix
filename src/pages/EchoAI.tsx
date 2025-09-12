import { useState } from 'react';
import { Brain, Search, Target, Shield, TrendingUp, AlertCircle, CheckCircle, Users, BarChart3, FileText, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Dummy data for vendor assessments
const vendorAssessments = [
  {
    id: 1,
    name: 'TechCorp Solutions',
    compatibilityScore: 92,
    complianceRisk: 'Low',
    strategicAlignment: 'Strong',
    costBenefit: 85,
    bspReference: 'BSP Circular 982 Sec. 5.2',
    recommendation: 'Select for pilot implementation',
    details: {
      strengths: ['Digital-first approach', 'Strong cybersecurity', 'Ayala Group experience'],
      risks: ['New vendor relationship', 'Limited VisMin presence'],
      compliance: 'Meets BSP Circular 982 outsourcing IT services requirements'
    }
  },
  {
    id: 2,
    name: 'Legacy Systems Inc',
    compatibilityScore: 75,
    complianceRisk: 'Medium',
    strategicAlignment: 'Moderate',
    costBenefit: 68,
    bspReference: 'BSP Circular 1007',
    recommendation: 'Keep as secondary backup',
    details: {
      strengths: ['Established track record', 'Cost competitive'],
      risks: ['Legacy dependencies', 'Geographic limitations'],
      compliance: 'Pending certification for BSP Circular 1007 requirements'
    }
  }
];

// Dummy data for ecosystem optimization
const ecosystemInsights = [
  {
    partnership: 'CyberSec Pro + FraudGuard AI',
    synergy: 'Joint cybersecurity & fraud detection',
    savings: '18%',
    alignment: 'BSP Circular 1198 compliance',
    recommendation: 'Consolidate under single vendor'
  },
  {
    partnership: 'PayTech Solutions + Ayala Healthcare',
    synergy: 'Cross-vertical payment processing',
    savings: '12%',
    alignment: 'Ayala Group leverage',
    recommendation: 'Expand partnership scope'
  }
];

// Dummy data for compliance risks
const complianceRisks = [
  {
    vendor: 'DataFlow Systems',
    risk: 'High',
    circular: 'BSP Circular 982 Sec. 7.4',
    issue: 'Lack of documented subcontractor arrangements',
    status: 'Non-compliant',
    action: 'Exclude until compliance gaps closed'
  },
  {
    vendor: 'CloudFirst Tech',
    risk: 'Medium',
    circular: 'BSP Circular 1007',
    issue: 'Partial compliance, remediation in progress',
    status: 'In Progress',
    action: 'Require updated remediation plan'
  },
  {
    vendor: 'SecureVault Pro',
    risk: 'Low',
    circular: 'All BSP Circulars',
    issue: 'Fully compliant',
    status: 'Compliant',
    action: 'Prioritize for selection'
  }
];

export default function EchoAI() {
  const [activeQuery, setActiveQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [queryType, setQueryType] = useState('selection');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleQuery = () => {
    if (!activeQuery.trim()) return;
    
    setIsProcessing(true);
    setAiResponse(null);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const responses = {
        selection: `Based on your query "${activeQuery}", EchoAI recommends:

🎯 **Vendor Assessment Results:**
• Compatibility Score: 89/100 (High alignment with strategic objectives)
• BSP Compliance: Meets Circular 982 Sec. 5.2 requirements
• Cost-Benefit Analysis: 15% savings vs current solution
• Strategic Alignment: Strong fit with BPI Digital Transformation

✅ **Recommendation:** Proceed with vendor engagement and due diligence phase.`,
        
        optimization: `EchoAI Ecosystem Analysis for "${activeQuery}":

🔄 **Partnership Synergies Identified:**
• Cost optimization potential: 22% through vendor consolidation
• Compliance alignment: Enhanced BSP Circular 1198 adherence
• Cross-Ayala Group leverage opportunities identified

⚡ **Optimization Actions:**
1. Consolidate overlapping services under single vendor
2. Leverage existing Ayala Group relationships
3. Implement shared service agreements

✅ **Expected Impact:** ₱8.5M annual savings with improved service quality.`,
        
        compliance: `Compliance Risk Assessment for "${activeQuery}":

🛡️ **BSP Regulatory Analysis:**
• BSP Circular 982: 2 vendors require additional documentation
• BSP Circular 1007: 1 vendor pending certification update
• BSP Circular 1198: All vendors meet technology risk requirements

⚠️ **Risk Mitigation Required:**
• Vendor documentation gaps must be addressed within 30 days
• Remediation plans submitted for review

✅ **Compliance Status:** 85% compliant, action items identified for full compliance.`
      };
      
      setAiResponse(responses[queryType as keyof typeof responses]);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gradient">EchoAI Advisor</h1>
          <p className="text-muted-foreground text-lg">Expert assistant for vendor assessment, ecosystem optimization, and compliance monitoring</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-glossy">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Vendor Assessments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-glossy">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">87%</p>
                <p className="text-sm text-muted-foreground">Compliance Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-glossy">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">₱15M</p>
                <p className="text-sm text-muted-foreground">Optimization Savings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-glossy">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Risk Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Query Interface */}
      <Card className="card-glossy-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            AI-Powered Analysis
          </CardTitle>
          <CardDescription>
            Get expert recommendations for vendor selection, ecosystem optimization, and compliance monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Select value={queryType} onValueChange={setQueryType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="selection">Vendor Selection</SelectItem>
                <SelectItem value="optimization">Ecosystem Optimization</SelectItem>
                <SelectItem value="compliance">Compliance Assessment</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1">
              <Textarea
                placeholder="Ask EchoAI about vendor assessments, compliance risks, or optimization opportunities..."
                value={activeQuery}
                onChange={(e) => setActiveQuery(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <Button onClick={handleQuery} className="w-full" disabled={!activeQuery.trim() || isProcessing}>
            <Brain className="mr-2 h-4 w-4" />
            {isProcessing ? 'Analyzing...' : 'Generate AI Analysis'}
          </Button>
          
          {/* AI Response Display */}
          {aiResponse && (
            <Card className="card-glossy mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  EchoAI Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary">
                  <pre className="whitespace-pre-wrap text-sm font-mono">{aiResponse}</pre>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Loading State */}
          {isProcessing && (
            <Card className="card-glossy mt-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="text-muted-foreground">EchoAI is analyzing your request...</span>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="assessments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assessments">Vendor Assessments</TabsTrigger>
          <TabsTrigger value="optimization">Ecosystem Optimization</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Monitoring</TabsTrigger>
        </TabsList>

        {/* Vendor Assessments Tab */}
        <TabsContent value="assessments" className="space-y-6">
          <div className="grid gap-6">
            {vendorAssessments.map((vendor) => (
              <Card key={vendor.id} className="card-glossy-hover">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{vendor.name}</CardTitle>
                      <CardDescription>Vendor compatibility assessment and strategic analysis</CardDescription>
                    </div>
                    <Badge variant={vendor.complianceRisk === 'Low' ? 'default' : vendor.complianceRisk === 'Medium' ? 'secondary' : 'destructive'}>
                      {vendor.complianceRisk} Risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Scoring Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Compatibility Score</span>
                        <span className="text-sm font-bold">{vendor.compatibilityScore}/100</span>
                      </div>
                      <Progress value={vendor.compatibilityScore} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Cost-Benefit</span>
                        <span className="text-sm font-bold">{vendor.costBenefit}/100</span>
                      </div>
                      <Progress value={vendor.costBenefit} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Strategic Alignment</span>
                        <span className="text-sm font-bold">{vendor.strategicAlignment}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                      <h4 className="font-medium text-success mb-2">Strengths</h4>
                      <ul className="text-sm space-y-1">
                        {vendor.details.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                      <h4 className="font-medium text-warning mb-2">Considerations</h4>
                      <ul className="text-sm space-y-1">
                        {vendor.details.risks.map((risk, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertCircle className="h-3 w-3 text-warning mt-0.5 flex-shrink-0" />
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <h4 className="font-medium text-primary mb-2">BSP Compliance</h4>
                      <div className="text-sm space-y-2">
                        <p className="font-medium">{vendor.bspReference}</p>
                        <p className="text-muted-foreground">{vendor.details.compliance}</p>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-primary" />
                      <span className="font-semibold">EchoAI Recommendation</span>
                    </div>
                    <p className="text-sm">{vendor.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Ecosystem Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <div className="grid gap-6">
            {ecosystemInsights.map((insight, index) => (
              <Card key={index} className="card-glossy-hover">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    {insight.partnership}
                  </CardTitle>
                  <CardDescription>Partnership synergy and optimization opportunity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-success" />
                        <span className="font-medium text-success">Cost Savings</span>
                      </div>
                      <p className="text-2xl font-bold text-success">{insight.savings}</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="font-medium text-primary">Compliance</span>
                      </div>
                      <p className="text-sm text-primary">{insight.alignment}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4" />
                        <span className="font-medium">Synergy Type</span>
                      </div>
                      <p className="text-sm">{insight.synergy}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-primary" />
                      <span className="font-semibold">EchoAI Recommendation</span>
                    </div>
                    <p className="text-sm">{insight.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Compliance Monitoring Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid gap-4">
            {complianceRisks.map((risk, index) => (
              <Card key={index} className="card-glossy-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{risk.vendor}</h3>
                      <p className="text-sm text-muted-foreground">{risk.circular}</p>
                    </div>
                    <Badge variant={
                      risk.status === 'Compliant' ? 'default' :
                      risk.status === 'In Progress' ? 'secondary' : 'destructive'
                    }>
                      {risk.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        risk.risk === 'Low' ? 'bg-success' :
                        risk.risk === 'Medium' ? 'bg-warning' : 'bg-destructive'
                      }`} />
                      <span className="text-sm font-medium">Risk Level: {risk.risk}</span>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">{risk.issue}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <span className="font-semibold">Required Action</span>
                    </div>
                    <p className="text-sm">{risk.action}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}