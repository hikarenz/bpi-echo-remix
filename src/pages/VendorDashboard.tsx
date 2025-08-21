import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, MapPin, Calendar, ExternalLink } from 'lucide-react';

const vendors = [
  {
    id: 1,
    name: 'TechCorp Solutions',
    category: 'Software Development',
    status: 'Active',
    location: 'San Francisco, CA',
    contractEnd: '2024-12-31',
    riskLevel: 'Low',
  },
  {
    id: 2,
    name: 'SecureData Inc',
    category: 'Cybersecurity',
    status: 'Active',
    location: 'Austin, TX',
    contractEnd: '2024-09-15',
    riskLevel: 'Medium',
  },
  {
    id: 3,
    name: 'CloudHost Pro',
    category: 'Infrastructure',
    status: 'Under Review',
    location: 'Seattle, WA',
    contractEnd: '2025-03-20',
    riskLevel: 'Low',
  },
  {
    id: 4,
    name: 'DataAnalytics Plus',
    category: 'Analytics',
    status: 'Active',
    location: 'New York, NY',
    contractEnd: '2024-11-10',
    riskLevel: 'High',
  },
  {
    id: 5,
    name: 'MobileFirst Studio',
    category: 'Mobile Development',
    status: 'Pending',
    location: 'Los Angeles, CA',
    contractEnd: '2025-01-15',
    riskLevel: 'Medium',
  },
  {
    id: 6,
    name: 'AI Innovations Lab',
    category: 'Artificial Intelligence',
    status: 'Active',
    location: 'Boston, MA',
    contractEnd: '2024-10-30',
    riskLevel: 'Low',
  },
];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Under Review':
      return 'secondary';
    case 'Pending':
      return 'outline';
    default:
      return 'default';
  }
};

const getRiskBadgeVariant = (risk: string) => {
  switch (risk) {
    case 'Low':
      return 'default';
    case 'Medium':
      return 'secondary';
    case 'High':
      return 'destructive';
    default:
      return 'default';
  }
};

export default function VendorDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and monitor all your vendor relationships
          </p>
        </div>
        <Button>
          <Building className="mr-2 h-4 w-4" />
          Add New Vendor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <Card key={vendor.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{vendor.name}</CardTitle>
                  <CardDescription>{vendor.category}</CardDescription>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge variant={getStatusBadgeVariant(vendor.status)}>
                    {vendor.status}
                  </Badge>
                  <Badge variant={getRiskBadgeVariant(vendor.riskLevel)}>
                    {vendor.riskLevel} Risk
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {vendor.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Contract ends: {vendor.contractEnd}
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}