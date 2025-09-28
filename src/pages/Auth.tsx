import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/components/auth/AuthProvider';
import { AlertCircle, Building2, UserCheck, Users } from 'lucide-react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Demo credentials for different roles
  const demoCredentials = {
    admin: {
      email: 'hikarigeranium@gmail.com',
      password: 'MakeMeEchoAdminYYY'
    },
    vendor: {
      email: 'renz.vidal@gmail.com', 
      password: 'MariaSantos'
    }
  };

  const handleDemoLogin = async (role: 'admin' | 'vendor') => {
    setLoading(true);
    setError(null);
    
    const credentials = demoCredentials[role];
    const { error: signInError } = await signIn(credentials.email, credentials.password);
    
    if (signInError) {
      setError(`Demo login failed: ${signInError.message}`);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Building2 className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">BPI HabiData</h1>
          <p className="text-muted-foreground">
            Demo Mode - Choose your role to continue
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="card-glossy-hover">
          <CardHeader>
            <CardTitle className="text-gradient">Demo Login</CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Select a role to explore the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
              className="w-full h-16 text-left flex items-center gap-4"
              variant="outline"
            >
              <div className="flex-shrink-0">
                <UserCheck className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <div className="font-semibold">BPI Admin</div>
                <div className="text-sm text-muted-foreground">
                  Manage vendors, view analytics, oversee compliance
                </div>
              </div>
            </Button>

            <Button
              onClick={() => handleDemoLogin('vendor')}
              disabled={loading}
              className="w-full h-16 text-left flex items-center gap-4"
              variant="outline"
            >
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <div className="font-semibold">Vendor</div>
                <div className="text-sm text-muted-foreground">
                  Complete profile, upload documents, manage renewals
                </div>
              </div>
            </Button>

            {loading && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Logging in...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          Demo credentials are automatically handled - no signup required
        </div>
      </div>
    </div>
  );
}