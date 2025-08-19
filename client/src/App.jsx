@@ .. @@
-import "./global.css";
+import "./index.css";

-import { Toaster } from "@/components/ui/toaster";
-import { createRoot } from "react-dom/client";
-import { Toaster as Sonner } from "@/components/ui/sonner";
-import { TooltipProvider } from "@/components/ui/tooltip";
-import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
-import { BrowserRouter, Routes, Route } from "react-router-dom";
-import LeadsTable from "./pages/LeadsTable";
-import ReportsPage from "./pages/ReportsPage";
-import Index from "./pages/Index";
-import NotFound from "./pages/NotFound";
-import AdminDashboard from "./pages/admindashboard";
-import SalesDashboard from "./pages/SalesDashboard";
+import React from 'react';
+import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
+import { AuthProvider, useAuth } from './context/AuthContext';
+import { Toaster } from './components/ui/toaster';
+import { TooltipProvider } from './components/ui/tooltip';
+import Index from './pages/Index';
+import SignUp from './pages/SignUp';
+import AdminDashboard from './pages/AdminDashboard';
+import SalesDashboard from './pages/SalesDashboard';
+import ManagerDashboard from './pages/ManagerDashboard';
+import LeadsTable from './pages/LeadsTable';
+import ReportsPage from './pages/ReportsPage';
+import NotFound from './pages/NotFound';

-const queryClient = new QueryClient();
+// Protected Route Component
+const ProtectedRoute = ({ children, allowedRoles = [] }) => {
+  const { user, loading } = useAuth();
+  
+  if (loading) {
+    return (
+      <div className="min-h-screen flex items-center justify-center">
+        <div className="text-lg">Loading...</div>
+      </div>
+    );
+  }
+  
+  if (!user) {
+    return <Navigate to="/" replace />;
+  }
+  
+  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
+    return <Navigate to="/unauthorized" replace />;
+  }
+  
+  return children;
+};

-const App = () => (
-  <QueryClientProvider client={queryClient}>
+const App = () => {
+  return (
+    <AuthProvider>
     <TooltipProvider>
       <Toaster />
-      <Sonner />
       <BrowserRouter>
         <Routes>
+          {/* Public Routes */}
           <Route path="/" element={<Index />} />
-          <Route path="/admindashboard" element={<AdminDashboard />} />
-          <Route path="/dashboard" element={
-            <SalesDashboard
-              user={{ name: "Demo User", role: "Sales Rep" }}
-              stats={{ totalLeads: 20, monthlyTarget: 80, activeSalesMembers: 3, totalRevenue: 120000, conversions: 5, newLeads: 3 }}
-              leadDistribution={{ qualified: 8, proposal: 6, won: 6, total: 20 }}
-              recentLeads={[
-                { id: "1", company: "Acme Corp", contact: "John Doe", status: "qualified", value: 10000, lastActivity: "1 hour ago" },
-                { id: "2", company: "Beta Inc", contact: "Jane Smith", status: "proposal", value: 15000, lastActivity: "2 hours ago" }
-              ]}
-              teamMembers={[
-                { id: "1", name: "Alice Cole", role: "Senior Sales Rep", performance: 92, deals: 12, revenue: 98400 },
-                { id: "2", name: "Bob Johnson", role: "Sales Rep", performance: 87, deals: 9, revenue: 76200 }
-              ]}
-            />
-          } />
-          <Route path="/reports" element={<ReportsPage />} />
-          <Route path="/LeadsTable" element={<LeadsTable />} />
+          <Route path="/signup" element={<SignUp />} />
+          
+          {/* Protected Routes */}
+          <Route path="/admindashboard" element={
+            <ProtectedRoute allowedRoles={['admin']}>
+              <AdminDashboard />
+            </ProtectedRoute>
+          } />
+          
+          <Route path="/manager-dashboard" element={
+            <ProtectedRoute allowedRoles={['sales_manager']}>
+              <ManagerDashboard />
+            </ProtectedRoute>
+          } />
+          
+          <Route path="/dashboard" element={
+            <ProtectedRoute allowedRoles={['sales_member']}>
+              <SalesDashboard />
+            </ProtectedRoute>
+          } />
+          
+          <Route path="/reports" element={
+            <ProtectedRoute allowedRoles={['admin', 'sales_manager']}>
+              <ReportsPage />
+            </ProtectedRoute>
+          } />
+          
+          <Route path="/LeadsTable" element={
+            <ProtectedRoute>
+              <LeadsTable />
+            </ProtectedRoute>
+          } />
+          
+          <Route path="/unauthorized" element={
+            <div className="min-h-screen flex items-center justify-center">
+              <div className="text-center">
+                <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
+                <p className="text-gray-600">You don't have permission to access this page.</p>
+              </div>
+            </div>
+          } />
+          
           {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
           <Route path="*" element={<NotFound />} />
         </Routes>
       </BrowserRouter>
     </TooltipProvider>
-  </QueryClientProvider>
-);
-
-createRoot(document.getElementById("root")!).render(<App />);
+    </AuthProvider>
+  );
+};
+
+export default App;