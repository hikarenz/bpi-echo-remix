import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Building, Phone, Mail, MapPin } from 'lucide-react';

export default function VendorProfileCompletion() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  const [formData, setFormData] = useState({
    company_name: '',
    company_email: '',
    company_address: '',
    contact_person: '',
    contact_phone: '',
    category: '',
    description: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profile) {
          const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ');
          setFormData(prev => ({
            ...prev,
            contact_person: fullName,
            company_email: profile.email
          }));
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Warning',
          description: 'Could not load profile data. Please fill in all fields manually.',
          variant: 'destructive'
        });
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, toast]);

  const categories = [
    'Software Development',
    'Cybersecurity', 
    'Infrastructure',
    'Analytics',
    'Mobile Development',
    'Artificial Intelligence',
    'Consulting',
    'Marketing',
    'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Create vendor company
      const { data: vendorCompany, error: companyError } = await supabase
        .from('vendor_companies')
        .insert({
          company_name: formData.company_name,
          company_email: formData.company_email,
          company_address: formData.company_address,
          contact_person: formData.contact_person,
          contact_phone: formData.contact_phone,
          status: 'pending'
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // Link user to vendor company
      const { error: linkError } = await supabase
        .from('vendor_users')
        .insert({
          user_id: user.id,
          vendor_company_id: vendorCompany.id
        });

      if (linkError) throw linkError;

      toast({
        title: 'Profile submitted successfully!',
        description: 'Your vendor profile is now under review. You will be notified once approved.'
      });

      navigate('/vendors');
    } catch (error: any) {
      toast({
        title: 'Error submitting profile',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Complete Your Vendor Profile</h1>
          <p className="text-muted-foreground">
            Please provide your company information to complete the registration process.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Information
            </CardTitle>
            <CardDescription>
              Fill in your company details. This information will be reviewed by our team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company_email">Company Email *</Label>
                  <Input
                    id="company_email"
                    type="email"
                    value={formData.company_email}
                    onChange={(e) => handleInputChange('company_email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company_address">Company Address</Label>
                <Textarea
                  id="company_address"
                  value={formData.company_address}
                  onChange={(e) => handleInputChange('company_address', e.target.value)}
                  placeholder="Full company address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_person">Contact Person</Label>
                  <Input
                    id="contact_person"
                    value={formData.contact_person}
                    onChange={(e) => handleInputChange('contact_person', e.target.value)}
                    placeholder="Primary contact name"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                    placeholder="Phone number"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Business Category</Label>
                <Select onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your business category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="min-w-32">
                  {loading ? 'Submitting...' : 'Submit Profile'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}