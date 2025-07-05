import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { 
  Battery, Clock, DollarSign, TrendingUp, LogOut, 
  Zap, MapPin, Calendar, Activity 
} from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user] = useState({ name: "John Doe", email: "john@example.com" });
  
  // Mock data - replace with real API calls
  const [usageData] = useState([
    { hour: '6AM', usage: 2.1, cost: 8.40 },
    { hour: '8AM', usage: 4.5, cost: 22.50 },
    { hour: '10AM', usage: 3.2, cost: 12.80 },
    { hour: '12PM', usage: 5.8, cost: 34.80 },
    { hour: '2PM', usage: 3.9, cost: 19.50 },
    { hour: '4PM', usage: 6.2, cost: 43.40 },
    { hour: '6PM', usage: 7.1, cost: 56.80 },
    { hour: '8PM', usage: 4.3, cost: 25.80 }
  ]);

  const [monthlyStats] = useState([
    { month: 'Jan', hours: 45, cost: 180 },
    { month: 'Feb', hours: 52, cost: 208 },
    { month: 'Mar', hours: 38, cost: 152 },
    { month: 'Apr', hours: 61, cost: 244 },
    { month: 'May', hours: 48, cost: 192 }
  ]);

  const [chargingTypes] = useState([
    { name: 'Fast Charging', value: 60, color: '#0EA5E9' },
    { name: 'Standard', value: 30, color: '#8B5CF6' },
    { name: 'Super Fast', value: 10, color: '#F59E0B' }
  ]);

  const [currentSession] = useState({
    isCharging: true,
    station: "Mall East - Slot A3",
    startTime: "2:30 PM",
    duration: "45 min",
    batteryLevel: 78,
    estimatedCost: 24.50
  });

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  useEffect(() => {
    if (localStorage.getItem('userType') !== 'user') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary-glow/10">
      {/* Header */}
      <div className="border-b border-primary/20 bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-electric rounded-full flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">User Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user.name}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto p-4 space-y-6">
        {/* Current Session Card */}
        {currentSession.isCharging && (
          <Card className="shadow-glow border-primary/20 bg-gradient-to-r from-primary/10 to-primary-glow/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary animate-pulse" />
                Active Charging Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{currentSession.station}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{currentSession.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Battery className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Battery</p>
                    <div className="flex items-center gap-2">
                      <Progress value={currentSession.batteryLevel} className="w-16" />
                      <span className="text-sm font-medium">{currentSession.batteryLevel}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Est. Cost</p>
                    <p className="font-medium">${currentSession.estimatedCost}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="shadow-glow border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold">244h</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-glow border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">$976</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-glow border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sessions</p>
                  <p className="text-2xl font-bold">127</p>
                </div>
                <Zap className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-glow border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Cost/Hour</p>
                  <p className="text-2xl font-bold">$4.00</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Daily Usage Chart */}
          <Card className="shadow-glow border-primary/20">
            <CardHeader>
              <CardTitle>Today's Usage Pattern</CardTitle>
              <CardDescription>Charging hours and costs throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="usage" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Hours"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cost" 
                    stroke="hsl(var(--primary-glow))" 
                    strokeWidth={2}
                    name="Cost ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Comparison */}
          <Card className="shadow-glow border-primary/20">
            <CardHeader>
              <CardTitle>Monthly Comparison</CardTitle>
              <CardDescription>Usage hours vs costs over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="hsl(var(--primary))" name="Hours" />
                  <Bar dataKey="cost" fill="hsl(var(--primary-glow))" name="Cost ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charging Types Distribution */}
        <Card className="shadow-glow border-primary/20">
          <CardHeader>
            <CardTitle>Charging Type Distribution</CardTitle>
            <CardDescription>Your preferred charging speeds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="w-full lg:w-1/2">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={chargingTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {chargingTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {chargingTypes.map((type, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="text-sm">{type.name}</span>
                    <Badge variant="secondary">{type.value}%</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;