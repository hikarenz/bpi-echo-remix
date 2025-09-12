import { 
  Users, 
  Shield, 
  BarChart3, 
  Brain, 
  Palette, 
  Code, 
  FileText, 
  UserCheck,
  Database,
  Zap,
  Lock,
  Globe,
  Settings,
  TrendingUp,
  MessageSquare,
  Target,
  CheckCircle,
  Calendar,
  Upload,
  Search,
  Bell,
  Eye,
  Layers
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function FeaturesOverview() {
  const navigate = useNavigate();

  const featureCategories = [
    {
      title: "Authentication & Role Management",
      description: "Enterprise-grade security with multi-role access control",
      icon: Shield,
      color: "text-emerald-400",
      features: [
        { name: "Multi-role Authentication", description: "BPI Admins & Vendors with secure session management" },
        { name: "Role-based Routing", description: "Automatic redirects based on user role and status" },
        { name: "Profile Completion Tracking", description: "Guided onboarding with progress indicators" },
        { name: "Secure Session Management", description: "Real-time auth state with Supabase integration" }
      ]
    },
    {
      title: "Vendor Management System",
      description: "Complete vendor lifecycle from application to renewal",
      icon: Users,
      color: "text-blue-400",
      features: [
        { name: "Multi-stage Onboarding", description: "Guided vendor application and approval process" },
        { name: "Status-based Workflows", description: "Pending, active, suspended, and renewal states" },
        { name: "Document Management", description: "Secure file uploads with compliance tracking" },
        { name: "Bulk Operations", description: "Manage multiple vendors efficiently" }
      ]
    },
    {
      title: "Dashboard & Analytics",
      description: "Real-time insights with interactive data visualization",
      icon: BarChart3,
      color: "text-purple-400",
      features: [
        { name: "Interactive Dashboard", description: "Real-time metrics with trend analysis" },
        { name: "Performance Analytics", description: "Vendor performance tracking with Recharts" },
        { name: "Activity Feeds", description: "Timestamped events and status updates" },
        { name: "Custom Reports", description: "Generate insights on vendor performance" }
      ]
    },
    {
      title: "Echo AI Advisor",
      description: "AI-powered vendor analysis and recommendations",
      icon: Brain,
      color: "text-cyan-400",
      features: [
        { name: "Vendor Selection Analysis", description: "AI-driven vendor matching and scoring" },
        { name: "Ecosystem Optimization", description: "Smart recommendations for vendor portfolio" },
        { name: "Compliance Assessment", description: "Automated risk analysis and alerts" },
        { name: "Predictive Insights", description: "Forecast vendor performance and issues" }
      ]
    },
    {
      title: "Design System",
      description: "Modern glass morphism with professional dark theme",
      icon: Palette,
      color: "text-pink-400",
      features: [
        { name: "Glass Morphism Design", description: "Gradient backgrounds with backdrop blur effects" },
        { name: "Design Token System", description: "Semantic color variables in HSL format" },
        { name: "Responsive Components", description: "Mobile-first approach with accessibility focus" },
        { name: "Smooth Animations", description: "60fps animations with hover effects" }
      ]
    },
    {
      title: "Technical Architecture",
      description: "Modern stack with React, TypeScript, and Supabase",
      icon: Code,
      color: "text-orange-400",
      features: [
        { name: "React 18 + TypeScript", description: "Type-safe development with latest React features" },
        { name: "Supabase Backend", description: "Real-time database with Row Level Security" },
        { name: "TanStack Query", description: "Optimized server state management and caching" },
        { name: "Tailwind CSS", description: "Utility-first styling with custom design system" }
      ]
    }
  ];

  const keyWorkflows = [
    {
      title: "Admin Dashboard",
      path: "/dashboard",
      icon: BarChart3,
      description: "Overview metrics, charts, and vendor management"
    },
    {
      title: "Manage Vendors",
      path: "/manage-vendors",
      icon: Users,
      description: "Comprehensive vendor directory with bulk operations"
    },
    {
      title: "Echo AI Advisor",
      path: "/echo-ai",
      icon: Brain,
      description: "AI-powered vendor analysis and recommendations"
    },
    {
      title: "Evaluation System",
      path: "/evaluation",
      icon: Target,
      description: "Structured vendor assessment with scoring"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            VendorPro Platform Overview
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive vendor lifecycle management with enterprise-grade features, 
            modern design, and AI-powered insights
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary">React 18</Badge>
            <Badge variant="secondary">TypeScript</Badge>
            <Badge variant="secondary">Supabase</Badge>
            <Badge variant="secondary">Tailwind CSS</Badge>
            <Badge variant="secondary">AI-Powered</Badge>
          </div>
        </div>

        {/* Key Workflows */}
        <Card className="card-gradient border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              Key Workflows
            </CardTitle>
            <CardDescription>
              Main application areas and their primary functions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {keyWorkflows.map((workflow) => (
                <Card key={workflow.title} className="cursor-pointer hover:card-hover transition-all duration-300">
                  <CardContent className="p-4 text-center space-y-3">
                    <workflow.icon className="h-8 w-8 mx-auto text-primary" />
                    <h3 className="font-semibold">{workflow.title}</h3>
                    <p className="text-sm text-muted-foreground">{workflow.description}</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(workflow.path)}
                      className="w-full"
                    >
                      Explore
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feature Categories */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Core Features & Capabilities</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featureCategories.map((category) => (
              <Card key={category.title} className="card-gradient border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <category.icon className={`h-6 w-6 ${category.color}`} />
                    {category.title}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.features.map((feature) => (
                      <div key={feature.name} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <h4 className="font-medium">{feature.name}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground ml-6">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technical Highlights */}
        <Card className="card-gradient border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-6 w-6 text-primary" />
              Technical Highlights
            </CardTitle>
            <CardDescription>
              Modern architecture and performance optimizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Lock className="h-8 w-8 text-emerald-400" />
                <h3 className="font-semibold">Security First</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Row Level Security (RLS)</li>
                  <li>• Authentication guards</li>
                  <li>• Input validation with Zod</li>
                  <li>• Secure file uploads</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <TrendingUp className="h-8 w-8 text-blue-400" />
                <h3 className="font-semibold">Performance</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Route-based code splitting</li>
                  <li>• Optimized bundle sizes</li>
                  <li>• TanStack Query caching</li>
                  <li>• Smooth 60fps animations</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <Eye className="h-8 w-8 text-purple-400" />
                <h3 className="font-semibold">Accessibility</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Semantic HTML structure</li>
                  <li>• ARIA labels and descriptions</li>
                  <li>• Keyboard navigation</li>
                  <li>• Color contrast compliance</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
          <p className="text-muted-foreground">
            Explore the platform and discover how VendorPro can streamline your vendor management process
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate('/dashboard')} size="lg">
              View Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate('/echo-ai')} size="lg">
              Try AI Advisor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}