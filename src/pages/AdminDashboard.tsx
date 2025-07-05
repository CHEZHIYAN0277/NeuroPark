import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area
} from 'recharts';
import { 
  Users, DollarSign, Activity, TrendingUp, LogOut, Shield,
  Clock, Zap, AlertTriangle, CheckCircle
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Mock data - replace with real API calls
  const [revenueData] = useState([
    { date: '2024-01-01', revenue: 1200, users: 45 },
    { date: '2024-01-02', revenue: 1450, users: 52 },
    { date: '2024-01-03', revenue: 1100, users: 38 },
    { date: '2024-01-04', revenue: 1680, users: 61 },
    { date: '2024-01-05', revenue: 1520, users: 48 },
    { date: '2024-01-06', revenue: 1890, users: 67 },
    { date: '2024-01-07', revenue: 2100, users: 74 }
  ]);

  const [peakHoursData] = useState([
    { hour: '6AM', sessions: 12, revenue: 180 },
    { hour: '8AM', sessions: 28, revenue: 420 },
    { hour: '10AM', sessions: 35, revenue: 525 },
    { hour: '12PM', sessions: 45, revenue: 675 },
    { hour: '2PM', sessions: 52, revenue: 780 },
    { hour: '4PM', sessions: 68, revenue: 1020 },
    { hour: '6PM', sessions: 72, revenue: 1080 },
    { hour: '8PM', sessions: 41, revenue: 615 },
    { hour: '10PM', sessions: 23, revenue: 345 }
  ]);

  const [stationData] = useState([
    { id: 'S001', name: 'Mall East - A', status: 'Active', sessions: 45, revenue: 675, utilization: 89 },
    { id: 'S002', name: 'Mall East - B', status: 'Active', sessions: 38, revenue: 570, utilization: 76 },
    { id: 'S003', name: 'Mall West - A', status: 'Maintenance', sessions: 0, revenue: 0, utilization: 0 },
    { id: 'S004', name: 'Mall West - B', status: 'Active', sessions: 52, revenue: 780, utilization: 94 },
    { id: 'S005', name: 'Mall North - A', status: 'Active', sessions: 41, revenue: 615, utilization: 82 },
  ]);

  const [monthlyMetrics] = useState([
    { month: 'Jan', revenue: 45000, sessions: 1200, avgPrice: 37.50 },
    { month: 'Feb', revenue: 52000, sessions: 1400, avgPrice: 37.14 },
    { month: 'Mar', revenue: 48000, sessions: 1250, avgPrice: 38.40 },
    { month: 'Apr', revenue: 58000, sessions: 1500, avgPrice: 38.67 },
    { month: 'May', revenue: 62000, sessions: 1600, avgPrice: 38.75 }
  ]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  useEffect(() => {
    if (localStorage.getItem('userType') !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'Maintenance':
        return <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20"><AlertTriangle className="h-3 w-3 mr-1" />Maintenance</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary-glow/10">
      {/* Header */}
      <div className="border-b border-primary/20 bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-electric rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">ChargeMall Management Portal</p>
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
        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="shadow-glow border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">$62,450</p>
                  <p className="text-xs text-green-600">+12.5% from last month</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-glow border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">1,247</p>
                  <p className="text-xs text-green-600">+8.3% growth</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-glow border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                  <p className="text-2xl font-bold">3,891</p>
                  <p className="text-xs text-green-600">+15.2% increase</p>
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-glow border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Session Price</p>
                  <p className="text-2xl font-bold">$16.05</p>
                  <p className="text-xs text-green-600">Dynamic pricing active</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue and Usage Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Daily Revenue Trend */}
          <Card className="shadow-glow border-primary/20">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Daily revenue and user activity</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                  <YAxis />
                  <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    name="Revenue ($)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="hsl(var(--primary-glow))" 
                    strokeWidth={2}
                    name="Active Users"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Peak Hours Analysis */}
          <Card className="shadow-glow border-primary/20">
            <CardHeader>
              <CardTitle>Peak Hours Analysis</CardTitle>
              <CardDescription>Sessions and revenue by hour</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={peakHoursData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="hsl(var(--primary))" name="Sessions" />
                  <Bar dataKey="revenue" fill="hsl(var(--primary-glow))" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Performance */}
        <Card className="shadow-glow border-primary/20">
          <CardHeader>
            <CardTitle>Monthly Performance Metrics</CardTitle>
            <CardDescription>Revenue, sessions, and average pricing trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  name="Revenue ($)"
                />
                <Line 
                  type="monotone" 
                  dataKey="sessions" 
                  stroke="hsl(var(--primary-glow))" 
                  strokeWidth={2}
                  name="Sessions"
                />
                <Line 
                  type="monotone" 
                  dataKey="avgPrice" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="Avg Price ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Station Management */}
        <Card className="shadow-glow border-primary/20">
          <CardHeader>
            <CardTitle>Charging Station Overview</CardTitle>
            <CardDescription>Monitor station performance and status</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Station ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sessions Today</TableHead>
                  <TableHead>Revenue Today</TableHead>
                  <TableHead>Utilization</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stationData.map((station) => (
                  <TableRow key={station.id}>
                    <TableCell className="font-mono">{station.id}</TableCell>
                    <TableCell className="font-medium">{station.name}</TableCell>
                    <TableCell>{getStatusBadge(station.status)}</TableCell>
                    <TableCell>{station.sessions}</TableCell>
                    <TableCell>${station.revenue}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div 
                            className="h-2 bg-gradient-electric rounded-full transition-all"
                            style={{ width: `${station.utilization}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{station.utilization}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;