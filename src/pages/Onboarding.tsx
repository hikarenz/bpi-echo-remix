import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Search,
  Users,
  CreditCard,
  Shield
} from "lucide-react";

const contracts = [
  {
    id: 1,
    vendor: "TechFlow Solutions",
    value: "$125,000",
    startDate: "2024-02-01",
    expiryDate: "2025-02-01",
    status: "Active",
    pdfUrl: "#"
  },
  {
    id: 2,
    vendor: "SecureNet Corp",
    value: "$89,500",
    startDate: "2024-01-15",
    expiryDate: "2024-07-15",
    status: "Pending Signature",
    pdfUrl: "#"
  },
  {
    id: 3,
    vendor: "DataSync Pro",
    value: "$67,800",
    startDate: "2024-01-10",
    expiryDate: "2025-01-10",
    status: "Under Review",
    pdfUrl: "#"
  }
];

const paymentSteps = [
  { id: 1, name: "Bank Account Verification", status: "completed", progress: 100 },
  { id: 2, name: "Payment Terms Setup", status: "completed", progress: 100 },
  { id: 3, name: "Invoice Configuration", status: "in-progress", progress: 65 },
  { id: 4, name: "Payment Gateway Integration", status: "not-started", progress: 0 },
  { id: 5, name: "Tax Information Setup", status: "not-started", progress: 0 }
];

const complianceItems = [
  { id: 1, item: "Data Processing Agreement", status: "completed" },
  { id: 2, item: "Insurance Certificate", status: "completed" },
  { id: 3, item: "W-9 Tax Form", status: "warning" },
  { id: 4, item: "Security Assessment", status: "pending" },
  { id: 5, item: "Background Check", status: "completed" },
  { id: 6, item: "Reference Verification", status: "warning" }
];

const vendorDirectory = [
  { id: "VND-001", name: "TechFlow Solutions", category: "Software", status: "Active" },
  { id: "VND-002", name: "SecureNet Corp", category: "Security", status: "Onboarding" },
  { id: "VND-003", name: "DataSync Pro", category: "Analytics", status: "Active" },
  { id: "VND-004", name: "CloudServe Inc", category: "Infrastructure", status: "Onboarding" },
  { id: "VND-005", name: "AgileDev Studio", category: "Development", status: "Pending" },
  { id: "VND-006", name: "MobileFirst Labs", category: "Mobile", status: "Active" }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed": return <CheckCircle className="h-4 w-4 text-success" />;
    case "warning": return <AlertTriangle className="h-4 w-4 text-warning" />;
    case "pending": return <XCircle className="h-4 w-4 text-destructive" />;
    default: return <XCircle className="h-4 w-4 text-muted-foreground" />;
  }
};

const getContractStatusVariant = (status: string) => {
  switch (status) {
    case "Active": return "default";
    case "Pending Signature": return "secondary";
    case "Under Review": return "outline";
    default: return "outline";
  }
};

const getVendorStatusVariant = (status: string) => {
  switch (status) {
    case "Active": return "default";
    case "Onboarding": return "secondary";
    case "Pending": return "outline";
    default: return "outline";
  }
};

const getProgressColor = (status: string) => {
  switch (status) {
    case "completed": return "bg-success";
    case "in-progress": return "bg-primary";
    case "not-started": return "bg-muted";
    default: return "bg-muted";
  }
};

export default function Onboarding() {
  const overallProgress = Math.round(
    paymentSteps.reduce((acc, step) => acc + step.progress, 0) / paymentSteps.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendor Onboarding</h1>
          <p className="text-muted-foreground">Manage contracts, payments, and compliance</p>
        </div>
      </div>

      {/* Top Panel - Contract Management */}
      <Card className="card-glossy-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gradient">
            <FileText className="h-5 w-5 text-primary" />
            Contract Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contracts.map((contract) => (
              <Card key={contract.id} className="card-glossy-hover transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-sm">{contract.vendor}</h4>
                    <Badge variant={getContractStatusVariant(contract.status)} className="text-xs">
                      {contract.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      <span className="font-semibold text-primary">{contract.value}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{contract.startDate} - {contract.expiryDate}</span>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline" className="w-full">
                    <ExternalLink className="h-3 w-3 mr-2" />
                    View PDF
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Center Panel - Payment Setup Tracker */}
        <div className="lg:col-span-2">
          <Card className="card-glossy-hover">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gradient">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Setup Tracker
                </div>
                <div className="text-sm text-muted-foreground">
                  {overallProgress}% Complete
                </div>
              </CardTitle>
              <Progress value={overallProgress} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentSteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-4 p-3 rounded-lg border border-border/50">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{step.name}</h4>
                      <Badge 
                        variant={step.status === "completed" ? "default" : step.status === "in-progress" ? "secondary" : "outline"}
                        className="text-xs capitalize"
                      >
                        {step.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={step.progress} className="flex-1 h-2" />
                      <span className="text-xs text-muted-foreground w-10">{step.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Legal/Compliance Checklist */}
        <div className="lg:col-span-1">
          <Card className="card-glossy-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gradient">
                <Shield className="h-5 w-5 text-primary" />
                Compliance Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {complianceItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/50">
                  {getStatusIcon(item.status)}
                  <span className="text-sm flex-1">{item.item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Panel - Vendor Directory */}
      <Card className="card-glossy-hover">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gradient">
              <Users className="h-5 w-5 text-primary" />
              Vendor Directory
            </div>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search vendors..." 
                className="w-64"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Vendor ID</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {vendorDirectory.map((vendor) => (
                  <tr key={vendor.id} className="border-b border-border/25 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-mono">{vendor.id}</td>
                    <td className="py-3 px-4 text-sm font-medium">{vendor.name}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{vendor.category}</td>
                    <td className="py-3 px-4">
                      <Badge variant={getVendorStatusVariant(vendor.status)} className="text-xs">
                        {vendor.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}