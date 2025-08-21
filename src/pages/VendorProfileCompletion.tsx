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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Building, Phone, Mail, MapPin, User, FileText, CheckCircle, AlertCircle, Globe, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Form validation schema
const vendorProfileSchema = z.object({
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
  company_email: z.string().email('Please enter a valid email address'),
  company_address: z.string().min(10, 'Please provide a complete address'),
  contact_person: z.string().min(2, 'Contact person name is required'),
  contact_phone: z.string().min(10, 'Please enter a valid phone number'),
  category: z.string().min(1, 'Please select a business category'),
  company_website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  company_size: z.string().min(1, 'Please select company size'),
  years_in_business: z.string().min(1, 'Please select years in business'),
  description: z.string().min(50, 'Please provide at least 50 characters description'),
  services_offered: z.string().min(20, 'Please describe your services (minimum 20 characters)'),
  certifications: z.string().optional(),
  previous_clients: z.string().optional()
});

type VendorProfileForm = z.infer<typeof vendorProfileSchema>;

const steps = [
  { id: 1, name: 'Basic Information', description: 'Company details and contact' },
  { id: 2, name: 'Business Details', description: 'Services and experience' },
  { id: 3, name: 'Additional Information', description: 'Certifications and references' },
  { id: 4, name: 'Review & Submit', description: 'Verify all information' }
];

export default function VendorProfileCompletion() {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<VendorProfileForm>({
    resolver: zodResolver(vendorProfileSchema),
    defaultValues: {
      company_name: '',
      company_email: '',
      company_address: '',
      contact_person: '',
      contact_phone: '',
      category: '',
      company_website: '',
      company_size: '',
      years_in_business: '',
      description: '',
      services_offered: '',
      certifications: '',
      previous_clients: ''
    }
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
          form.setValue('contact_person', fullName);
          form.setValue('company_email', profile.email);
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
  }, [user, toast, form]);

  const categories = [
    'Software Development',
    'Cybersecurity', 
    'Infrastructure',
    'Analytics',
    'Mobile Development',
    'Artificial Intelligence',
    'Consulting',
    'Marketing',
    'Cloud Services',
    'Data Management',
    'Other'
  ];

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-1000 employees',
    '1000+ employees'
  ];

  const yearsInBusiness = [
    'Less than 1 year',
    '1-3 years',
    '4-7 years',
    '8-15 years',
    '15+ years'
  ];

  const getStepProgress = () => {
    return (currentStep / steps.length) * 100;
  };

  const validateCurrentStep = async () => {
    const fieldsToValidate: Record<number, (keyof VendorProfileForm)[]> = {
      1: ['company_name', 'company_email', 'company_address', 'contact_person', 'contact_phone'],
      2: ['category', 'company_size', 'years_in_business', 'description', 'services_offered'],
      3: [], // Optional fields
    };

    const fields = fieldsToValidate[currentStep] || [];
    const isValid = await form.trigger(fields);
    return isValid;
  };

  const handleNext = async () => {
    if (currentStep < steps.length) {
      const isValid = await validateCurrentStep();
      if (isValid) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: VendorProfileForm) => {
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to submit your profile.',
        variant: 'destructive'
      });
      return;
    }

    if (!session) {
      toast({
        title: 'Session Error',
        description: 'Your session has expired. Please refresh the page and try again.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Authentication Debug:', {
        userExists: !!user,
        userId: user.id,
        sessionExists: !!session,
        accessToken: session.access_token ? 'Present' : 'Missing',
        tokenExpiry: session.expires_at ? new Date(session.expires_at * 1000) : 'Unknown'
      });

      // Verify current session is still valid
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('Current session check:', { sessionData, sessionError });

      if (sessionError || !sessionData.session) {
        throw new Error('Session validation failed. Please refresh and try again.');
      }

      console.log('Submitting vendor company data:', data);
      
      // Create vendor company with explicit session context
      const { data: vendorCompany, error: companyError } = await supabase
        .from('vendor_companies')
        .insert({
          company_name: data.company_name,
          company_email: data.company_email,
          company_address: data.company_address,
          contact_person: data.contact_person,
          contact_phone: data.contact_phone,
          status: 'profile_pending',
          profile_submitted_at: new Date().toISOString()
        })
        .select()
        .single();

      console.log('Company creation result:', { vendorCompany, companyError });

      if (companyError) {
        console.error('Company creation error details:', {
          message: companyError.message,
          details: companyError.details,
          hint: companyError.hint,
          code: companyError.code
        });
        throw companyError;
      }

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
        description: 'Your vendor profile is awaiting admin review. You will be notified once approved to proceed with onboarding.'
      });

      navigate('/vendors');
    } catch (error: any) {
      console.error('Profile submission error:', error);
      
      const errorMessage = error.message?.includes('row-level security') 
        ? 'Authentication issue detected. Please refresh the page and try again. If the problem persists, please contact support.'
        : error.message || 'An unexpected error occurred';

      toast({
        title: 'Error submitting profile',
        description: errorMessage,
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Company Name *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Company Email *
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="company@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="company_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Company Address *
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter complete company address including street, city, state, and ZIP code"
                      className="min-h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact_person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Contact Person *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Primary contact name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contact Phone *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="company_website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Company Website
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.yourcompany.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Optional: Your company's official website
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Category *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your business category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Company Size *
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companySizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="years_in_business"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years in Business *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="How long has your company been in business?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {yearsInBusiness.map((years) => (
                        <SelectItem key={years} value={years}>
                          {years}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Description *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide a detailed description of your company, its mission, and core values. What makes your company unique?"
                      className="min-h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Minimum 50 characters. This helps us understand your business better.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="services_offered"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Services Offered *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the specific services and solutions your company provides. Include any specializations or unique offerings."
                      className="min-h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Detail the services you can provide to help us match you with relevant opportunities.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="certifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certifications & Accreditations</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List any relevant industry certifications, accreditations, or compliance standards your company holds (e.g., ISO 27001, SOC 2, PCI DSS, etc.)"
                      className="min-h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Include certification numbers and expiry dates if applicable.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="previous_clients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notable Clients & Projects</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Mention any notable clients you've worked with or significant projects you've completed. You may use general descriptions if confidentiality is required."
                      className="min-h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: This helps demonstrate your experience and capabilities.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Review Your Information</h3>
              <p className="text-muted-foreground">
                Please review all the information below before submitting your vendor profile.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div><strong>Company Name:</strong> {form.getValues('company_name')}</div>
                <div><strong>Email:</strong> {form.getValues('company_email')}</div>
                <div><strong>Address:</strong> {form.getValues('company_address')}</div>
                <div><strong>Contact Person:</strong> {form.getValues('contact_person')}</div>
                <div><strong>Phone:</strong> {form.getValues('contact_phone')}</div>
                {form.getValues('company_website') && (
                  <div><strong>Website:</strong> {form.getValues('company_website')}</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Business Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div><strong>Category:</strong> {form.getValues('category')}</div>
                <div><strong>Company Size:</strong> {form.getValues('company_size')}</div>
                <div><strong>Years in Business:</strong> {form.getValues('years_in_business')}</div>
                <div><strong>Description:</strong> {form.getValues('description')}</div>
                <div><strong>Services:</strong> {form.getValues('services_offered')}</div>
              </CardContent>
            </Card>

            {(form.getValues('certifications') || form.getValues('previous_clients')) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {form.getValues('certifications') && (
                    <div><strong>Certifications:</strong> {form.getValues('certifications')}</div>
                  )}
                  {form.getValues('previous_clients') && (
                    <div><strong>Notable Clients:</strong> {form.getValues('previous_clients')}</div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-blue-900 mb-1">What happens next?</div>
                  <div className="text-blue-700">
                    After submitting your profile, our team will review your information. You will be notified via email once your profile is approved and you can proceed with the onboarding process.
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Complete Your Vendor Profile</h1>
          <p className="text-muted-foreground mb-6">
            Please provide your company information to complete the registration process.
          </p>
          
          {/* Progress Steps */}
          <div className="max-w-2xl mx-auto mb-8">
            <Progress value={getStepProgress()} className="h-2 mb-4" />
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                    currentStep > index + 1 
                      ? 'bg-green-600 text-white' 
                      : currentStep === index + 1
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {currentStep > index + 1 ? <CheckCircle className="h-4 w-4" /> : step.id}
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">{step.name}</div>
                    <div className="text-xs text-muted-foreground hidden sm:block">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && <Building className="h-5 w-5" />}
              {currentStep === 2 && <FileText className="h-5 w-5" />}
              {currentStep === 3 && <CheckCircle className="h-5 w-5" />}
              {currentStep === 4 && <CheckCircle className="h-5 w-5" />}
              {steps[currentStep - 1]?.name}
            </CardTitle>
            <CardDescription>
              {steps[currentStep - 1]?.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {renderStepContent()}

                <Separator />
                
                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  
                  {currentStep < steps.length ? (
                    <Button type="button" onClick={handleNext}>
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" disabled={loading} className="min-w-32">
                      {loading ? 'Submitting...' : 'Submit Profile'}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}