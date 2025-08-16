import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Star, AlertTriangle, CheckCircle, Clock, FileText } from "lucide-react";

const vendorApplications = [
  { id: 1, name: "TechFlow Solutions", category: "Software", status: "Under Review", date: "2024-01-15" },
  { id: 2, name: "SecureNet Corp", category: "Security", status: "Pending", date: "2024-01-14" },
  { id: 3, name: "DataSync Pro", category: "Analytics", status: "Approved", date: "2024-01-12" },
  { id: 4, name: "CloudServe Inc", category: "Infrastructure", status: "Under Review", date: "2024-01-10" },
  { id: 5, name: "AgileDev Studio", category: "Development", status: "Pending", date: "2024-01-08" },
];

const complianceChecklist = [
  { id: 1, requirement: "SOC 2 Type II Certification", completed: true, critical: true },
  { id: 2, requirement: "Data Processing Agreement", completed: true, critical: true },
  { id: 3, requirement: "GDPR Compliance Documentation", completed: false, critical: true },
  { id: 4, requirement: "ISO 27001 Certification", completed: true, critical: false },
  { id: 5, requirement: "Business Insurance Certificate", completed: false, critical: false },
  { id: 6, requirement: "Financial Statements (Last 2 Years)", completed: true, critical: false },
  { id: 7, requirement: "References & Case Studies", completed: false, critical: false },
  { id: 8, requirement: "Service Level Agreement (SLA)", completed: true, critical: true },
];

const riskMatrix = [
  { category: "Security", level: "low", score: 2 },
  { category: "Financial", level: "medium", score: 5 },
  { category: "Operational", level: "low", score: 3 },
  { category: "Compliance", level: "high", score: 8 },
  { category: "Technical", level: "medium", score: 4 },
  { category: "Reputational", level: "low", score: 2 },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Approved": return <CheckCircle className="h-4 w-4 text-success" />;
    case "Under Review": return <Clock className="h-4 w-4 text-warning" />;
    case "Pending": return <FileText className="h-4 w-4 text-muted-foreground" />;
    default: return null;
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Approved": return "default";
    case "Under Review": return "secondary";
    case "Pending": return "outline";
    default: return "outline";
  }
};

const getRiskColor = (level: string) => {
  switch (level) {
    case "high": return "bg-destructive/20 border-destructive/50";
    case "medium": return "bg-warning/20 border-warning/50";
    case "low": return "bg-success/20 border-success/50";
    default: return "bg-muted/20 border-muted/50";
  }
};

export default function Evaluation() {
  const completedItems = complianceChecklist.filter(item => item.completed).length;
  const completionRate = Math.round((completedItems / complianceChecklist.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendor Evaluation</h1>
          <p className="text-muted-foreground">Assess and review vendor applications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Vendor Application Tracker */}
        <div className="lg:col-span-1">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Vendor Applications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {vendorApplications.map((vendor) => (
                <div
                  key={vendor.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-all"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(vendor.status)}
                      <h4 className="font-medium text-sm">{vendor.name}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">{vendor.category}</p>
                    <p className="text-xs text-muted-foreground">{vendor.date}</p>
                  </div>
                  <Badge variant={getStatusVariant(vendor.status)} className="text-xs">
                    {vendor.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Center Panel - Compliance Checklist */}
        <div className="lg:col-span-1">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Compliance Checklist
                </div>
                <div className="text-sm text-muted-foreground">
                  {completedItems}/{complianceChecklist.length}
                </div>
              </CardTitle>
              <div className="space-y-2">
                <Progress value={completionRate} className="h-2" />
                <p className="text-sm text-muted-foreground">{completionRate}% Complete</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {complianceChecklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-all"
                >
                  <Checkbox
                    checked={item.completed}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {item.requirement}
                      </span>
                      {item.critical && (
                        <AlertTriangle className="h-3 w-3 text-warning" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Risk Heatmap & Scorecard */}
        <div className="lg:col-span-1 space-y-6">
          {/* Risk Heatmap */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {riskMatrix.map((risk, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 ${getRiskColor(risk.level)} transition-all hover:scale-105`}
                  >
                    <div className="text-sm font-medium text-foreground">{risk.category}</div>
                    <div className="text-xs text-muted-foreground capitalize">{risk.level} Risk</div>
                    <div className="text-lg font-bold text-foreground mt-1">{risk.score}/10</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Initial Scorecard */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Initial Scorecard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">7.8</div>
                <div className="flex justify-center gap-1 mb-2">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                  <Star className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Overall Score</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Compliance</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Security</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Financial</span>
                  <span className="text-sm font-medium">76%</span>
                </div>
                <Progress value={76} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}