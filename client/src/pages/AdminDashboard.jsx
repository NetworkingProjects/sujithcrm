@@ .. @@
-export default function AdminDashboard() {
+import { useAuth } from '../context/AuthContext';
+import { dashboardAPI } from '../services/api';
+
+export default function AdminDashboard() {
+  const { user, logout } = useAuth();
   const [user, setUser] = useState<User | null>(null);
   const [activeTab, setActiveTab] = useState('lead-management');
-  const [stats, setStats] = useState<DashboardStats>({
-    totalLeads: 247,
-    monthlyTarget: 65,
-    activeSalesMembers: 3,
-    totalRevenue: 284590,
-    conversions: 18,
-    newLeads: 12
-  });
+  const [stats, setStats] = useState({});
+  const [leadDistribution, setLeadDistribution] = useState({});
+  const [recentLeads, setRecentLeads] = useState([]);
+  const [teamMembers, setTeamMembers] = useState([]);
+  const [loading, setLoading] = useState(true);
   
-  const [leadDistribution, setLeadDistribution] = useState<LeadDistribution>({
-    qualified: 15,
-    proposal: 8,
-    won: 12,
-    total: 35
-  });
-
-  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
-
   useEffect(() => {
-    fetch('/api/leads')
-      .then(res => res.json())
-      .then(data => setRecentLeads(data))
-      .catch(() => setRecentLeads([]));
+    const fetchDashboardData = async () => {
+      try {
+        const response = await dashboardAPI.getStats();
+        const { stats, leadDistribution, recentLeads, teamMembers } = response.data;
+        
+        setStats(stats);
+        setLeadDistribution(leadDistribution);
+        setRecentLeads(recentLeads);
+        setTeamMembers(teamMembers);
+      } catch (error) {
+        console.error('Failed to fetch dashboard data:', error);
+      } finally {
+        setLoading(false);
+      }
+    };
+
+    fetchDashboardData();
   }, []);

-  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
-    {
-      id: '1',
-      name: 'Alice Cole',
-      role: 'Senior Sales Rep',
-      performance: 92,
-      deals: 12,
-      revenue: 98400
-    },
-    {
-      id: '2',
-      name: 'Bob Johnson',
-      role: 'Sales Rep',
-      performance: 87,
-      deals: 9,
-      revenue: 76200
-    },
-    {
-      id: '3',
-      name: 'Carol Smith',
-      role: 'Sales Rep',
-      performance: 81,
-      deals: 8,
-      revenue: 65300
-    }
-  ]);
-
-  useEffect(() => {
-    const currentUser = authService.getUser();
-    if (currentUser) {
-      setUser(currentUser);
-    }
-  }, []);
-
-  const handleSignOut = async () => {
-    await authService.logout();
+  const handleSignOut = () => {
+    logout();
     window.location.href = '/';
   };

+  if (loading) {
+    return (
+      <div className="min-h-screen flex items-center justify-center">
+        <div className="text-lg">Loading dashboard...</div>
+      </div>
+    );
+  }
+
   const getStatusColor = (status: string) => {
@@ .. @@
           <div className="flex items-center gap-2 sm:gap-4">
             <div className="text-right hidden sm:block">
-              <div className="font-medium text-gray-900">{user?.name || 'Max Manager'}</div>
+              <div className="font-medium text-gray-900">{user?.name || 'Admin User'}</div>
               <div className="text-sm text-gray-600">Admin</div>
             </div>
             <Button
@@ .. @@
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalLeads}</div>
                      <p className="text-xs text-gray-600 mt-1">+12% from last month</p>
@@ .. @@
                 {/* Recent Lead Summary */}
                 <Card className="lg:col-span-2">
                   <CardHeader>
                     <CardTitle className="text-lg font-semibold">Recent Lead Summary</CardTitle>
                   </CardHeader>
                   <CardContent>
                     <div className="space-y-4">
-                      <h2 className="text-xl sm:text-2xl font-bold mb-4">Contact Management</h2>
-                      <p className="text-gray-600">Contact management features coming soon...</p>
+                      {recentLeads.map((lead) => (
+                        <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
+                          <div className="flex items-center gap-3">
+                            <div className={`w-2 h-2 rounded-full ${getStatusColor(lead.status)}`}></div>
+                            <div>
+                              <div className="font-medium text-gray-900">{lead.company}</div>
+                              <div className="text-sm text-gray-600">{lead.contact}</div>
+                            </div>
+                          </div>
+                          <div className="text-right">
+                            <Badge variant={getStatusBadgeVariant(lead.status)} className="mb-1">
+                              {lead.status}
+                            </Badge>
+                            <div className="text-xs text-gray-600">
+                              {new Date(lead.lastActivity).toLocaleDateString()}
+                            </div>
+                          </div>
+                        </div>
+                      ))}
                     </div>
                   </CardContent>
                 </Card>