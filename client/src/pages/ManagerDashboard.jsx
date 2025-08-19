import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function ManagerDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({});
  const [leadDistribution, setLeadDistribution] = useState({});
  const [recentLeads, setRecentLeads] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await dashboardAPI.getStats();
        const { stats, leadDistribution, recentLeads, teamMembers } = response.data;
        
        setStats(stats);
        setLeadDistribution(leadDistribution);
        setRecentLeads(recentLeads);
        setTeamMembers(teamMembers);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'qualified': return 'bg-blue-500';
      case 'proposal': return 'bg-yellow-500';
      case 'won': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'qualified': return 'default';
      case 'proposal': return 'secondary';
      case 'won': return 'default';
      default: return 'outline';
    }
  };

  const handleSignOut = () => {
    logout();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-navy-dark rounded-sm flex items-center justify-center">
              <img
                src='./logo32.png'
                alt="Bristle logo"
                className="w-full h-full rounded-sm object-contain"
              />
            </div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">BRISTLETECH CRM</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-right hidden sm:block">
              <div className="font-medium text-gray-900">{user.name}</div>
              <div className="text-sm text-gray-600">Sales Manager</div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-gray-300 text-gray-700 hover:bg-gray-100 text-xs sm:text-sm" 
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200">
        <div className="px-3 sm:px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="h-12 bg-transparent border-0 space-x-2 sm:space-x-8 overflow-x-auto">
              <TabsTrigger value="dashboard" className="data-[state=active]:border-b-2 data-[state=active]:border-navy-dark rounded-none bg-transparent text-xs sm:text-sm whitespace-nowrap">Dashboard</TabsTrigger>
              <TabsTrigger value="team" className="data-[state=active]:border-b-2 data-[state=active]:border-navy-dark rounded-none bg-transparent text-xs sm:text-sm whitespace-nowrap">Team Management</TabsTrigger>
              <TabsTrigger value="leads" className="data-[state=active]:border-b-2 data-[state=active]:border-navy-dark rounded-none bg-transparent text-xs sm:text-sm whitespace-nowrap">Lead Management</TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:border-b-2 data-[state=active]:border-navy-dark rounded-none bg-transparent text-xs sm:text-sm whitespace-nowrap">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-0">
              <div className="p-3 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Total Leads</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalLeads || 0}</div>
                      <p className="text-xs text-gray-600 mt-1">Team performance</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Team Target</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.monthlyTarget || 0}%</div>
                      <Progress value={stats.monthlyTarget || 0} className="mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Team Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.activeSalesMembers || 0}</div>
                      <p className="text-xs text-gray-600 mt-1">Active members</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Team Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${(stats.totalRevenue || 0).toLocaleString()}</div>
                      <p className="text-xs text-gray-600 mt-1">This month</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Lead Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Qualified</span>
                          <span className="font-medium">{leadDistribution.qualified || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Proposal</span>
                          <span className="font-medium">{leadDistribution.proposal || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Won</span>
                          <span className="font-medium">{leadDistribution.won || 0}</span>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between font-semibold">
                            <span>Total</span>
                            <span>{leadDistribution.total || 0}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Team Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {teamMembers.map((member) => (
                          <div key={member.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900">{member.name}</div>
                                <div className="text-sm text-gray-600">{member.role}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">${member.revenue.toLocaleString()}</div>
                                <div className="text-sm text-gray-600">{member.deals} deals</div>
                              </div>
                            </div>
                            <Progress value={member.performance} className="h-2" />
                            <div className="text-xs text-gray-600 text-right">{member.performance}% of target</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="team" className="mt-0">
              <div className="p-3 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Team Management</h2>
                <p className="text-gray-600">Team management features coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="leads" className="mt-0">
              <div className="p-3 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Lead Management</h2>
                <p className="text-gray-600">Lead management features coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="mt-0">
              <div className="p-3 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Reports</h2>
                <p className="text-gray-600">Reporting features coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}