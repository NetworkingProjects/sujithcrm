@@ .. @@
-import { useLocation } from 'react-router-dom';
-import { useState } from 'react';
+import { useState, useEffect } from 'react';
+import { useAuth } from '../context/AuthContext';
+import { dashboardAPI } from '../services/api';
 import { Button } from '@/components/ui/button';
@@ .. @@
 import { Badge } from '@/components/ui/badge';

-export default function SalesDashboard(props) {
-  const location = useLocation();
-  const user = location.state?.user || props.user || { name: 'Demo User', role: 'Sales Rep' };
-  // Use fake data for stats/leads/teamMembers if not provided
-  const stats = props.stats || { totalLeads: 20, monthlyTarget: 80, activeSalesMembers: 3, totalRevenue: 120000, conversions: 5, newLeads: 3 };
-  const leadDistribution = props.leadDistribution || { qualified: 8, proposal: 6, won: 6, total: 20 };
-  const recentLeads = props.recentLeads || [
-    { id: "1", company: "Acme Corp", contact: "John Doe", status: "qualified", value: 10000, lastActivity: "1 hour ago" },
-    { id: "2", company: "Beta Inc", contact: "Jane Smith", status: "proposal", value: 15000, lastActivity: "2 hours ago" }
-  ];
-  const teamMembers = props.teamMembers || [
-    { id: "1", name: "Alice Cole", role: "Senior Sales Rep", performance: 92, deals: 12, revenue: 98400 },
-    { id: "2", name: "Bob Johnson", role: "Sales Rep", performance: 87, deals: 9, revenue: 76200 }
-  ];
+export default function SalesDashboard() {
+  const { user, logout } = useAuth();
+  const [stats, setStats] = useState({});
+  const [leadDistribution, setLeadDistribution] = useState({});
+  const [recentLeads, setRecentLeads] = useState([]);
+  const [teamMembers, setTeamMembers] = useState([]);
+  const [loading, setLoading] = useState(true);
+  const [activeTab, setActiveTab] = useState('dashboard');

-  // Use AdminDashboard layout, but with props and user info
-  const [activeTab, setActiveTab] = useState('dashboard');
+  useEffect(() => {
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
+  }, []);
+
   const getStatusColor = (status) => {
@@ .. @@
       default: return 'outline';
     }
   };
-  return (
+
+  const handleSignOut = () => {
+    logout();
+    window.location.href = '/';
+  };
+
+  if (loading) {
+    return (
+      <div className="min-h-screen flex items-center justify-center">
+        <div className="text-lg">Loading dashboard...</div>
+      </div>
+    );
+  }
+
+  return (
     <div className="min-h-screen bg-gray-50">
       <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-4">
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-navy-dark rounded-sm flex items-center justify-center">
-              <div className="w-4 h-4 bg-white rounded-xs"></div>
+              <img
+                src='./logo32.png'
+                alt="Bristle logo"
+                className="w-full h-full rounded-sm object-contain"
+              />
             </div>
-            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">SalesCRM Pro</h1>
+            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">BRISTLETECH CRM</h1>
           </div>
           <div className="flex items-center gap-2 sm:gap-4">
             <div className="text-right hidden sm:block">
               <div className="font-medium text-gray-900">{user.name}</div>
-              <div className="text-sm text-gray-600">{user.role}</div>
+              <div className="text-sm text-gray-600">Sales Member</div>
             </div>
-            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100 text-xs sm:text-sm" onClick={() => window.location.href = '/'}>Sign Out</Button>
+            <Button 
+              variant="outline" 
+              size="sm" 
+              className="border-gray-300 text-gray-700 hover:bg-gray-100 text-xs sm:text-sm" 
+              onClick={handleSignOut}
+            >
+              Sign Out
+            </Button>
           </div>
         </div>
       </header>
@@ .. @@
                             <div>
                               <div className="font-medium text-gray-900">{lead.company}</div>
                               <div className="text-sm text-gray-600">{lead.contact}</div>
                             </div>
                           </div>
                           <div className="text-right">
                             <Badge variant={getStatusBadgeVariant(lead.status)} className="mb-1">{lead.status}</Badge>
-                            <div className="text-xs text-gray-600">{lead.lastActivity}</div>
+                            <div className="text-xs text-gray-600">
+                              {new Date(lead.lastActivity).toLocaleDateString()}
+                            </div>
                           </div>
                         </div>
                       ))}