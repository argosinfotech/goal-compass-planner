
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      toast({
        title: 'Login successful!',
        description: 'Welcome to Goal Compass',
      });
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Goal Compass</h1>
          <p className="text-muted-foreground mt-2">Track your objectives and key results</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email" 
                    placeholder="name@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button variant="link" className="px-0" size="sm" onClick={() => toast({ title: "Feature coming soon", description: "Password reset functionality will be available soon." })}>
                      Forgot password?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm">Remember me</Label>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account?</span>{' '}
              <Button variant="link" className="px-1" size="sm" onClick={() => toast({ title: "Feature coming soon", description: "Sign up functionality will be available soon." })}>
                Sign up
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Goal Compass. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
