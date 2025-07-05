import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, User, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [userCredentials, setUserCredentials] = useState({ email: "", password: "" });
  const [adminCredentials, setAdminCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock login - replace with actual backend integration
    setTimeout(() => {
      localStorage.setItem('userType', 'user');
      localStorage.setItem('isLoggedIn', 'true');
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      navigate("/user-dashboard");
      setIsLoading(false);
    }, 1000);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock login - replace with actual backend integration
    setTimeout(() => {
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('isLoggedIn', 'true');
      toast({
        title: "Admin Login Successful",
        description: "Welcome to admin dashboard!",
      });
      navigate("/admin-dashboard");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary-glow/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-gradient-electric rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-electric bg-clip-text text-transparent">
            ChargeMall
          </h1>
          <p className="text-muted-foreground mt-2">Your Smart Charging Solution</p>
        </div>

        <Tabs defaultValue="user" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              User Login
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin Login
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user">
            <Card className="shadow-glow border-primary/20">
              <CardHeader>
                <CardTitle>User Login</CardTitle>
                <CardDescription>Access your charging dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUserLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email</Label>
                    <Input
                      id="user-email"
                      type="email"
                      placeholder="your@email.com"
                      value={userCredentials.email}
                      onChange={(e) => setUserCredentials({...userCredentials, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-password">Password</Label>
                    <Input
                      id="user-password"
                      type="password"
                      placeholder="Enter your password"
                      value={userCredentials.password}
                      onChange={(e) => setUserCredentials({...userCredentials, password: e.target.value})}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-electric hover:shadow-glow"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card className="shadow-glow border-primary/20">
              <CardHeader>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>Access the management dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@chargemall.com"
                      value={adminCredentials.email}
                      onChange={(e) => setAdminCredentials({...adminCredentials, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Admin Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Enter admin password"
                      value={adminCredentials.password}
                      onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-electric hover:shadow-glow"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Admin Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground">
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;