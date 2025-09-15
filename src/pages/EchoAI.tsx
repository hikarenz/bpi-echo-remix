import { useState } from 'react';
import { Brain, Search, Target, Shield, TrendingUp, AlertCircle, CheckCircle, Users, BarChart3, FileText, Zap, Eye, Scale, Database, Clock, Lightbulb } from 'lucide-react';
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
  },
  {
    id: 3,
    name: 'CyberShield Pro',
    compatibilityScore: 95,
    complianceRisk: 'Low',
    strategicAlignment: 'Strong',
    costBenefit: 91,
    bspReference: 'BSP Circular 1198',
    recommendation: 'Priority vendor for cybersecurity portfolio',
    details: {
      strengths: ['BSP-certified security framework', 'Real-time threat detection', 'Local data centers'],
      risks: ['Premium pricing', 'Implementation complexity'],
      compliance: 'Fully compliant with BSP Circular 1198 cybersecurity requirements'
    }
  },
  {
    id: 4,
    name: 'CloudFirst Philippines',
    compatibilityScore: 88,
    complianceRisk: 'Low',
    strategicAlignment: 'Strong',
    costBenefit: 82,
    bspReference: 'BSP Circular 982 Sec. 3.1',
    recommendation: 'Recommended for cloud infrastructure',
    details: {
      strengths: ['Local cloud expertise', 'Government partnerships', 'Disaster recovery capabilities'],
      risks: ['Vendor lock-in potential', 'Scalability concerns'],
      compliance: 'Meets BSP cloud outsourcing requirements'
    }
  },
  {
    id: 5,
    name: 'DataFlow Systems',
    compatibilityScore: 65,
    complianceRisk: 'High',
    strategicAlignment: 'Weak',
    costBenefit: 45,
    bspReference: 'BSP Circular 982 Sec. 7.4',
    recommendation: 'Do not proceed - compliance gaps',
    details: {
      strengths: ['Low cost', 'Quick implementation'],
      risks: ['Non-compliant subcontractors', 'Data sovereignty issues', 'Poor security posture'],
      compliance: 'Fails BSP Circular 982 subcontractor documentation requirements'
    }
  },
  {
    id: 6,
    name: 'FinTech Innovations Corp',
    compatibilityScore: 89,
    complianceRisk: 'Low',
    strategicAlignment: 'Strong',
    costBenefit: 87,
    bspReference: 'BSP Circular 1007',
    recommendation: 'Excellent for digital banking transformation',
    details: {
      strengths: ['Digital banking expertise', 'Mobile-first solutions', 'API-driven architecture'],
      risks: ['Rapid growth company', 'Limited enterprise clients'],
      compliance: 'BSP Circular 1007 compliant for digital financial services'
    }
  },
  {
    id: 7,
    name: 'Globe Business Solutions',
    compatibilityScore: 84,
    complianceRisk: 'Low',
    strategicAlignment: 'Strong',
    costBenefit: 79,
    bspReference: 'BSP Circular 982',
    recommendation: 'Solid choice for telecommunications services',
    details: {
      strengths: ['Nationwide coverage', 'Established infrastructure', 'Government contracts'],
      risks: ['Higher costs', 'Service complexity'],
      compliance: 'Full BSP compliance with strong audit trail'
    }
  },
  {
    id: 8,
    name: 'AI Analytics Partners',
    compatibilityScore: 91,
    complianceRisk: 'Medium',
    strategicAlignment: 'Strong',
    costBenefit: 85,
    bspReference: 'BSP Circular 1198',
    recommendation: 'Consider with enhanced due diligence',
    details: {
      strengths: ['Advanced AI capabilities', 'Financial sector experience', 'Predictive analytics'],
      risks: ['New technology adoption', 'Data privacy concerns'],
      compliance: 'Partial compliance - AI governance framework needed'
    }
  },
  {
    id: 9,
    name: 'SecureVault Pro',
    compatibilityScore: 93,
    complianceRisk: 'Low',
    strategicAlignment: 'Strong',
    costBenefit: 88,
    bspReference: 'All BSP Circulars',
    recommendation: 'Top choice for data security and storage',
    details: {
      strengths: ['Military-grade encryption', 'Zero-trust architecture', 'Compliance expertise'],
      risks: ['Premium pricing tier', 'Complex integration'],
      compliance: 'Exceeds all BSP security requirements'
    }
  },
  {
    id: 10,
    name: 'PaymentGateway Solutions',
    compatibilityScore: 87,
    complianceRisk: 'Low',
    strategicAlignment: 'Strong',
    costBenefit: 83,
    bspReference: 'BSP Circular 1007',
    recommendation: 'Recommended for payment processing',
    details: {
      strengths: ['PCI DSS Level 1', 'Multi-channel support', 'Real-time settlement'],
      risks: ['Transaction volume dependency', 'Integration timeline'],
      compliance: 'Full BSP Circular 1007 compliance for payment services'
    }
  },
  {
    id: 11,
    name: 'RiskAssess Analytics',
    compatibilityScore: 86,
    complianceRisk: 'Low',
    strategicAlignment: 'Strong',
    costBenefit: 81,
    bspReference: 'BSP Circular 1198',
    recommendation: 'Strong candidate for risk management',
    details: {
      strengths: ['Real-time risk scoring', 'Regulatory reporting', 'ML-based detection'],
      risks: ['Model interpretability', 'Regulatory changes'],
      compliance: 'BSP Circular 1198 compliant risk management framework'
    }
  },
  {
    id: 12,
    name: 'CloudSecure International',
    compatibilityScore: 72,
    complianceRisk: 'Medium',
    strategicAlignment: 'Moderate',
    costBenefit: 65,
    bspReference: 'BSP Circular 982',
    recommendation: 'Consider with local partnership',
    details: {
      strengths: ['Global experience', 'Enterprise scale', 'Cost competitive'],
      risks: ['Foreign entity concerns', 'Data localization issues'],
      compliance: 'Requires local data center partnership for BSP compliance'
    }
  }
];

// Dummy data for ecosystem optimization (sorted by cost savings descending)
const ecosystemInsights = [
  {
    partnership: 'Ayala Group Vendors + BPI Technology Stack',
    synergy: 'Cross-company vendor standardization',
    savings: '35%',
    alignment: 'Group-wide efficiency',
    recommendation: 'Implement group procurement strategy'
  },
  {
    partnership: 'CloudFirst Philippines + SecureVault Pro',
    synergy: 'Secure cloud infrastructure with data protection',
    savings: '28%',
    alignment: 'Data sovereignty and security',
    recommendation: 'Build comprehensive cloud security platform'
  },
  {
    partnership: 'PaymentGateway + RiskAssess Analytics',
    synergy: 'Real-time payment fraud detection',
    savings: '24%',
    alignment: 'Enhanced payment security',
    recommendation: 'Integrate fraud scoring with payment processing'
  },
  {
    partnership: 'CyberShield Pro + RiskAssess Analytics',
    synergy: 'Integrated cybersecurity and risk management',
    savings: '22%',
    alignment: 'BSP Circular 1198 compliance',
    recommendation: 'Consolidate under unified security framework'
  },
  {
    partnership: 'Globe Business + AI Analytics Partners',
    synergy: 'Network intelligence and predictive analytics',
    savings: '19%',
    alignment: 'Infrastructure optimization',
    recommendation: 'Leverage network data for business insights'
  },
  {
    partnership: 'TechCorp Solutions + CyberShield Pro',
    synergy: 'Digital transformation with security-first approach',
    savings: '17%',
    alignment: 'Comprehensive modernization',
    recommendation: 'Joint implementation with security oversight'
  },
  {
    partnership: 'AI Analytics + SecureVault Pro',
    synergy: 'Secure AI model deployment and data analysis',
    savings: '16%',
    alignment: 'AI governance and data protection',
    recommendation: 'Create secure AI development environment'
  },
  {
    partnership: 'FinTech Innovations + PaymentGateway Solutions',
    synergy: 'End-to-end digital banking platform',
    savings: '15%',
    alignment: 'Digital transformation strategy',
    recommendation: 'Create integrated payment ecosystem'
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
    vendor: 'CloudSecure International',
    risk: 'High',
    circular: 'BSP Circular 982 Sec. 4.1',
    issue: 'Data processing outside Philippines without proper safeguards',
    status: 'Non-compliant',
    action: 'Require local data center partnership or exclude'
  },
  {
    vendor: 'AI Analytics Partners',
    risk: 'Medium',
    circular: 'BSP Circular 1198',
    issue: 'AI model governance framework incomplete',
    status: 'In Progress',
    action: 'Complete AI governance documentation before approval'
  },
  {
    vendor: 'Legacy Systems Inc',
    risk: 'Medium',
    circular: 'BSP Circular 1007',
    issue: 'Outdated security controls, partial compliance',
    status: 'In Progress',
    action: 'Require security modernization plan and timeline'
  },
  {
    vendor: 'CloudFirst Philippines',
    risk: 'Low',
    circular: 'BSP Circular 982',
    issue: 'Minor documentation gaps in disaster recovery plans',
    status: 'Minor Issues',
    action: 'Complete DR documentation within 30 days'
  },
  {
    vendor: 'SecureVault Pro',
    risk: 'Low',
    circular: 'All BSP Circulars',
    issue: 'Fully compliant with all requirements',
    status: 'Compliant',
    action: 'Prioritize for selection'
  },
  {
    vendor: 'CyberShield Pro',
    risk: 'Low',
    circular: 'BSP Circular 1198',
    issue: 'Exceeds cybersecurity requirements',
    status: 'Compliant',
    action: 'Approved for immediate procurement'
  },
  {
    vendor: 'FinTech Innovations Corp',
    risk: 'Low',
    circular: 'BSP Circular 1007',
    issue: 'All digital banking compliance requirements met',
    status: 'Compliant',
    action: 'Recommended for digital transformation projects'
  },
  {
    vendor: 'PaymentGateway Solutions',
    risk: 'Low',
    circular: 'BSP Circular 1007',
    issue: 'PCI DSS Level 1 certified, BSP compliant',
    status: 'Compliant',
    action: 'Approved for payment processing services'
  },
  {
    vendor: 'Globe Business Solutions',
    risk: 'Low',
    circular: 'BSP Circular 982',
    issue: 'Full compliance with telecommunications outsourcing',
    status: 'Compliant',
    action: 'Continue existing partnership'
  },
  {
    vendor: 'TechCorp Solutions',
    risk: 'Low',
    circular: 'BSP Circular 982 Sec. 5.2',
    issue: 'IT outsourcing requirements fully satisfied',
    status: 'Compliant',
    action: 'Recommended for pilot implementation'
  },
  {
    vendor: 'RiskAssess Analytics',
    risk: 'Low',
    circular: 'BSP Circular 1198',
    issue: 'Risk management framework BSP certified',
    status: 'Compliant',
    action: 'Approved for risk management services'
  },
  {
    vendor: 'QuickFix Solutions',
    risk: 'High',
    circular: 'BSP Circular 982',
    issue: 'No BSP registration, unlicensed operations',
    status: 'Non-compliant',
    action: 'Immediate exclusion from vendor pool'
  },
  {
    vendor: 'BudgetTech Systems',
    risk: 'Medium',
    circular: 'BSP Circular 1198',
    issue: 'Insufficient cybersecurity controls',
    status: 'In Progress',
    action: 'Security audit required before approval'
  },
  {
    vendor: 'OffshoreCloud Services',
    risk: 'High',
    circular: 'BSP Circular 982 Sec. 3.2',
    issue: 'No local presence, data sovereignty concerns',
    status: 'Non-compliant',
    action: 'Require local entity establishment'
  }
];

export default function EchoAI() {
  const [activeQuery, setActiveQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [queryType, setQueryType] = useState('selection');
  const [isProcessing, setIsProcessing] = useState(false);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [analysisSteps, setAnalysisSteps] = useState<any[]>([]);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [methodology, setMethodology] = useState<any>(null);

  const handleQuery = () => {
    if (!activeQuery.trim()) return;
    
    setIsProcessing(true);
    setFilteredResults([]);
    setAnalysisSteps([]);
    setConfidenceScore(0);
    setMethodology(null);
    
    // Simulate AI processing with step-by-step analysis
    const steps = [];
    let currentStep = 0;
    
    const processStep = (stepInfo: any) => {
      setTimeout(() => {
        setAnalysisSteps(prev => [...prev, stepInfo]);
      }, currentStep * 800);
      currentStep++;
    };
    
    // Step 1: Query Analysis
    processStep({
      step: 1,
      title: "Query Analysis & Intent Recognition",
      description: "Analyzing user query to identify intent, keywords, and requirements",
      details: [
        `Detected query type: ${queryType}`,
        `Key terms identified: ${activeQuery.toLowerCase().split(' ').slice(0, 3).join(', ')}`,
        `Analysis scope: ${queryType === 'selection' ? 'Vendor assessment and recommendation' : queryType === 'optimization' ? 'Partnership synergies and cost optimization' : 'Compliance risk evaluation'}`
      ],
      confidence: 95,
      dataSource: "Natural Language Processing Engine"
    });
    
    // Step 2: Data Retrieval
    processStep({
      step: 2,
      title: "Data Source Integration",
      description: "Accessing relevant databases and applying business rules",
      details: [
        `Vendor database: ${vendorAssessments.length} active assessments`,
        `Compliance database: ${complianceRisks.length} risk evaluations`,
        `BSP regulations: 3 active circulars (982, 1007, 1198)`,
        `Historical performance data: 24 months lookback`
      ],
      confidence: 90,
      dataSource: "Integrated Vendor Management System"
    });
    
    // Step 3: Scoring Algorithm
    processStep({
      step: 3,
      title: "Multi-Criteria Decision Analysis",
      description: "Applying weighted scoring methodology for objective evaluation",
      details: [
        "Compatibility Score (30%): Technical alignment with BPI systems",
        "Compliance Risk (25%): BSP regulatory adherence assessment", 
        "Strategic Alignment (20%): Business objective compatibility",
        "Cost-Benefit Analysis (15%): Total cost of ownership evaluation",
        "Vendor Stability (10%): Financial and operational reliability"
      ],
      confidence: 88,
      dataSource: "Proprietary Scoring Algorithm v2.1"
    });
    
    // Step 4: Risk Assessment
    processStep({
      step: 4,
      title: "Risk Factor Analysis",
      description: "Evaluating potential risks and mitigation strategies",
      details: [
        "Operational risk assessment completed",
        "Regulatory compliance gaps identified",
        "Vendor concentration risk evaluated",
        "Exit strategy complexity assessed"
      ],
      confidence: 85,
      dataSource: "Risk Management Framework"
    });
    
    // Step 5: Generate Results
    setTimeout(() => {
      let results = [];
      let confidence = 0;
      let methodologyInfo = null;
      
      switch (queryType) {
        case 'selection':
          results = vendorAssessments.filter(vendor => 
            vendor.name.toLowerCase().includes(activeQuery.toLowerCase()) ||
            vendor.details.strengths.some(strength => 
              strength.toLowerCase().includes(activeQuery.toLowerCase())
            ) ||
            activeQuery.toLowerCase().includes('all') ||
            activeQuery.toLowerCase().includes('assess') ||
            activeQuery.toLowerCase().includes('evaluate')
          );
          if (results.length === 0) results = vendorAssessments.slice(0, 5);
          confidence = 87;
          methodologyInfo = {
            title: "Vendor Selection Methodology",
            approach: "Multi-Criteria Decision Analysis (MCDA)",
            factors: [
              { name: "Technical Compatibility", weight: "30%", description: "System integration capabilities and technical alignment" },
              { name: "Regulatory Compliance", weight: "25%", description: "BSP circular adherence and regulatory risk assessment" },
              { name: "Strategic Fit", weight: "20%", description: "Alignment with BPI's digital transformation strategy" },
              { name: "Financial Viability", weight: "15%", description: "Cost-benefit analysis and total cost of ownership" },
              { name: "Vendor Reliability", weight: "10%", description: "Track record, financial stability, and operational maturity" }
            ],
            limitations: [
              "Analysis based on available vendor data as of last assessment",
              "Market conditions and vendor capabilities may change",
              "Scores reflect relative comparison within current vendor pool"
            ],
            biasConsiderations: [
              "Historical preference for established vendors addressed through weighted scoring",
              "Geographic proximity bias minimized through standardized criteria",
              "Cost bias balanced against quality and compliance factors"
            ]
          };
          break;
          
        case 'optimization':
          results = ecosystemInsights.filter(insight =>
            insight.partnership.toLowerCase().includes(activeQuery.toLowerCase()) ||
            insight.synergy.toLowerCase().includes(activeQuery.toLowerCase()) ||
            activeQuery.toLowerCase().includes('partnership') ||
            activeQuery.toLowerCase().includes('optimization') ||
            activeQuery.toLowerCase().includes('synergy')
          );
          if (results.length === 0) results = ecosystemInsights.slice(0, 4);
          confidence = 82;
          methodologyInfo = {
            title: "Ecosystem Optimization Methodology",
            approach: "Portfolio Theory Applied to Vendor Ecosystem",
            factors: [
              { name: "Synergy Potential", weight: "35%", description: "Complementary capabilities and integration opportunities" },
              { name: "Cost Optimization", weight: "30%", description: "Economies of scale and scope through partnership" },
              { name: "Risk Diversification", weight: "20%", description: "Vendor concentration risk reduction" },
              { name: "Strategic Alignment", weight: "15%", description: "Contribution to overall business strategy" }
            ],
            limitations: [
              "Savings estimates based on industry benchmarks and assumptions",
              "Implementation complexity not fully quantified",
              "Vendor willingness to collaborate not guaranteed"
            ],
            biasConsiderations: [
              "Savings projections may be optimistic - conservative estimates used",
              "Preference for larger vendors balanced with innovation potential",
              "Integration complexity underweighting addressed through pilot programs"
            ]
          };
          break;
          
        case 'compliance':
          results = complianceRisks.filter(risk =>
            risk.vendor.toLowerCase().includes(activeQuery.toLowerCase()) ||
            risk.circular.toLowerCase().includes(activeQuery.toLowerCase()) ||
            activeQuery.toLowerCase().includes('compliance') ||
            activeQuery.toLowerCase().includes('risk') ||
            activeQuery.toLowerCase().includes('bsp')
          );
          if (results.length === 0) results = complianceRisks.slice(0, 6);
          confidence = 92;
          methodologyInfo = {
            title: "Compliance Risk Assessment Methodology",
            approach: "Risk-Based Compliance Monitoring Framework",
            factors: [
              { name: "Regulatory Adherence", weight: "40%", description: "Direct compliance with BSP circulars and requirements" },
              { name: "Documentation Quality", weight: "25%", description: "Completeness and accuracy of compliance documentation" },
              { name: "Audit Trail", weight: "20%", description: "Transparency and traceability of compliance activities" },
              { name: "Remediation Capability", weight: "15%", description: "Ability to address compliance gaps promptly" }
            ],
            limitations: [
              "Assessment based on available documentation and vendor declarations",
              "Regulatory requirements subject to change",
              "On-site audits may reveal additional compliance gaps"
            ],
            biasConsiderations: [
              "Over-reliance on vendor self-reporting mitigated through third-party verification",
              "Recent compliance issues weighted appropriately in scoring",
              "Size bias addressed - small vendors not penalized for resource constraints"
            ]
          };
          break;
      }
      
      setFilteredResults(results);
      setConfidenceScore(confidence);
      setMethodology(methodologyInfo);
      setIsProcessing(false);
      
      // Final step
      setAnalysisSteps(prev => [...prev, {
        step: 5,
        title: "Analysis Complete",
        description: `Generated ${results.length} recommendations with ${confidence}% confidence`,
        details: [
          `Results ranked by composite score`,
          `Risk factors highlighted and addressed`,
          `Methodology transparency provided`,
          `Alternative options considered`
        ],
        confidence: confidence,
        dataSource: "Integrated Analysis Engine"
      }]);
      
    }, currentStep * 800 + 1000);
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
                <p className="text-2xl font-bold">{vendorAssessments.length}</p>
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
                <p className="text-2xl font-bold">{Math.round((complianceRisks.filter(r => r.status === 'Compliant').length / complianceRisks.length) * 100)}%</p>
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
                <p className="text-2xl font-bold">₱{ecosystemInsights.reduce((sum, insight) => sum + parseInt(insight.savings.replace('%', '')), 0) * 2.5}M</p>
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
                <p className="text-2xl font-bold">{complianceRisks.filter(r => r.risk === 'High').length}</p>
                <p className="text-sm text-muted-foreground">High Risk Alerts</p>
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
          
          {/* Analysis Process Transparency */}
          {analysisSteps.length > 0 && (
            <Card className="card-glossy mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Analysis Process Transparency
                </CardTitle>
                <CardDescription>
                  Step-by-step breakdown of how EchoAI reached its recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisSteps.map((step, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-muted/20 rounded-lg border-l-4 border-primary/50">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">{step.step}</span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{step.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {step.confidence}% confidence
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <Database className="h-3 w-3 mr-1" />
                              {step.dataSource}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                        {step.details && (
                          <ul className="text-xs space-y-1 text-muted-foreground pl-4">
                            {step.details.map((detail: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <div className="w-1 h-1 bg-primary/60 rounded-full mt-2 flex-shrink-0" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Methodology Explanation */}
          {methodology && (
            <Card className="card-glossy mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  {methodology.title}
                </CardTitle>
                <CardDescription>
                  Detailed explanation of the analysis methodology and potential limitations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Approach: {methodology.approach}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {methodology.factors.map((factor: any, index: number) => (
                      <div key={index} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{factor.name}</span>
                          <Badge variant="outline" className="text-xs">{factor.weight}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{factor.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-warning">
                    <AlertCircle className="h-4 w-4" />
                    Analysis Limitations
                  </h4>
                  <ul className="space-y-1">
                    {methodology.limitations.map((limitation: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="w-1 h-1 bg-warning/60 rounded-full mt-2 flex-shrink-0" />
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-success">
                    <Lightbulb className="h-4 w-4" />
                    Bias Considerations & Mitigation
                  </h4>
                  <ul className="space-y-1">
                    {methodology.biasConsiderations.map((bias: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="w-1 h-1 bg-success/60 rounded-full mt-2 flex-shrink-0" />
                        {bias}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-primary">Overall Confidence Score</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={confidenceScore} className="flex-1" />
                    <span className="font-bold text-primary">{confidenceScore}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on data quality ({confidenceScore > 85 ? 'High' : confidenceScore > 70 ? 'Medium' : 'Low'}), 
                    methodology rigor, and historical accuracy of similar analyses
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Results Display */}
          {filteredResults.length > 0 && (
            <Card className="card-glossy mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  EchoAI Analysis Results ({filteredResults.length} {queryType === 'selection' ? 'vendors' : queryType === 'optimization' ? 'opportunities' : 'risks'} found)
                  {confidenceScore > 0 && (
                    <Badge variant="outline" className="ml-auto">
                      {confidenceScore}% confidence
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {queryType === 'selection' && filteredResults.map((vendor: any) => (
                    <div key={vendor.id} className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{vendor.name}</h4>
                          <p className="text-sm text-muted-foreground">Compatibility Score: {vendor.compatibilityScore}/100</p>
                        </div>
                        <Badge variant={vendor.complianceRisk === 'Low' ? 'default' : vendor.complianceRisk === 'Medium' ? 'secondary' : 'destructive'}>
                          {vendor.complianceRisk} Risk
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="font-medium">Strategic Alignment:</span> {vendor.strategicAlignment}
                        </div>
                        <div>
                          <span className="font-medium">Cost-Benefit:</span> {vendor.costBenefit}/100
                        </div>
                        <div>
                          <span className="font-medium">BSP Reference:</span> {vendor.bspReference}
                        </div>
                      </div>
                      <div className="mt-3 p-2 bg-primary/10 rounded text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-primary">EchoAI Recommendation:</span>
                          <Badge variant="outline" className="text-xs">
                            Score: {vendor.compatibilityScore}/100
                          </Badge>
                        </div>
                        <p>{vendor.recommendation}</p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <span className="font-medium">Key factors:</span> Compatibility ({vendor.compatibilityScore}%), 
                          Risk Level ({vendor.complianceRisk}), Strategic Fit ({vendor.strategicAlignment})
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {queryType === 'optimization' && filteredResults.map((insight: any, index: number) => (
                    <div key={index} className="p-4 bg-muted/30 rounded-lg border-l-4 border-success">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{insight.partnership}</h4>
                          <p className="text-sm text-muted-foreground">{insight.synergy}</p>
                        </div>
                        <Badge variant="default" className="bg-success text-success-foreground">
                          {insight.savings} Savings
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                        <div>
                          <span className="font-medium">Alignment:</span> {insight.alignment}
                        </div>
                        <div>
                          <span className="font-medium">Cost Savings:</span> {insight.savings}
                        </div>
                      </div>
                      <div className="p-2 bg-success/10 rounded text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-success">EchoAI Recommendation:</span>
                          <Badge variant="outline" className="text-xs">
                            Savings: {insight.savings}
                          </Badge>
                        </div>
                        <p>{insight.recommendation}</p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <span className="font-medium">Analysis basis:</span> Synergy potential, cost optimization, 
                          and strategic alignment assessment
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {queryType === 'compliance' && filteredResults.map((risk: any, index: number) => (
                    <div key={index} className="p-4 bg-muted/30 rounded-lg border-l-4 border-warning">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{risk.vendor}</h4>
                          <p className="text-sm text-muted-foreground">{risk.circular}</p>
                        </div>
                        <Badge variant={
                          risk.status === 'Compliant' ? 'default' :
                          risk.status === 'In Progress' ? 'secondary' : 'destructive'
                        }>
                          {risk.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            risk.risk === 'Low' ? 'bg-success' :
                            risk.risk === 'Medium' ? 'bg-warning' : 'bg-destructive'
                          }`} />
                          <span>Risk Level: {risk.risk}</span>
                        </div>
                        <div>
                          <span className="font-medium">Issue:</span> {risk.issue}
                        </div>
                      </div>
                      <div className="p-2 bg-warning/10 rounded text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-warning">Required Action:</span>
                          <Badge variant={risk.risk === 'High' ? 'destructive' : risk.risk === 'Medium' ? 'secondary' : 'default'} className="text-xs">
                            {risk.risk} Priority
                          </Badge>
                        </div>
                        <p>{risk.action}</p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <span className="font-medium">Assessment basis:</span> {risk.circular} compliance review, 
                          documentation audit, and risk impact analysis
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Loading State with Step Indicators */}
          {isProcessing && (
            <Card className="card-glossy mt-4">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="text-muted-foreground">EchoAI is analyzing your request...</span>
                  </div>
                  
                  {analysisSteps.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <h4 className="font-semibold text-sm text-center mb-3">Analysis Progress</h4>
                      {analysisSteps.map((step, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-muted/20 rounded text-sm">
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                          <span className="flex-1">{step.title}</span>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {step.confidence}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
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