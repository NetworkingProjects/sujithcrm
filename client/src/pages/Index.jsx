@@ .. @@
 import { useState } from 'react';
-import { useNavigate } from 'react-router-dom';
+import { useNavigate, Link } from 'react-router-dom';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
+import { useAuth } from '../context/AuthContext';
 
 export default function Index() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
-    const navigate = useNavigate();
+  const [loading, setLoading] = useState(false);
+  const [error, setError] = useState('');
+  const navigate = useNavigate();
+  const { login } = useAuth();
 
   const handleSignIn = async (e) => {
-      e.preventDefault();
-      // Demo accounts
-      const demoAccounts = [
-        { email: 'admin@company.com', password: 'password123', role: 'admin' },
-        { email: 'alice@company.com', password: 'password123', role: 'sales' },
-        { email: 'bob@company.com', password: 'password123', role: 'sales' },
-      ];
-
-      const user = demoAccounts.find(
-        (acc) => acc.email === email && acc.password === password
-      );
-
-      if (user) {
-        if (user.role === 'admin') {
+    e.preventDefault();
+    setError('');
+    setLoading(true);
+
+    try {
+      const result = await login({ email, password });
+      
+      if (result.success) {
+        // Get user from localStorage to determine redirect
+        const user = JSON.parse(localStorage.getItem('user'));
+        
+        switch (user.role) {
+          case 'admin':
+            navigate('/admindashboard');
+            break;
+          case 'sales_manager':
+            navigate('/manager-dashboard');
+            break;
+          case 'sales_member':
+            navigate('/dashboard');
+            break;
+          default:
+            navigate('/dashboard');
+        }
+      } else {
+        setError(result.message);
+      }
+    } catch (error) {
+      setError('Login failed. Please try again.');
+    } finally {
+      setLoading(false);
+    }
+  };
+
+  const useDemoAccount = async (demoEmail, demoPassword) => {
+    setEmail(demoEmail);
+    setPassword(demoPassword);
+    setError('');
+    setLoading(true);
+
+    try {
+      const result = await login({ email: demoEmail, password: demoPassword });
+      
+      if (result.success) {
+        const user = JSON.parse(localStorage.getItem('user'));
+        
+        switch (user.role) {
+          case 'admin':
             navigate('/admindashboard');
-        } else {
-          // Pass user info to dashboard via state
-          navigate('/dashboard', { state: { user } });
+            break;
+          case 'sales_manager':
+            navigate('/manager-dashboard');
+            break;
+          case 'sales_member':
+            navigate('/dashboard');
+            break;
+          default:
+            navigate('/dashboard');
         }
       } else {
-        alert('Invalid credentials.');
+        setError(result.message);
       }
+    } catch (error) {
+      setError('Login failed. Please try again.');
+    } finally {
+      setLoading(false);
+    }
   };
 
-  const useDemoAccount = (demoEmail, demoPassword) => {
-    setEmail(demoEmail);
-    setPassword(demoPassword);
-  };
-
   return (
@@ .. @@
           </div>

+          {/* Error Message */}
+          {error && (
+            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
+              {error}
+            </div>
+          )}
+
           {/* Login Form */}
           <form onSubmit={handleSignIn} className="space-y-4 lg:space-y-6">
+            <div>
+              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
             <Input
               id="email"
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
+                className="mt-1"
+                placeholder="Enter your email"
             />
+            </div>
+            <div>
+              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
             <Input
               id="password"
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
+                className="mt-1"
+                placeholder="Enter your password"
             />
+            </div>
             <Button
               type="submit"
+              disabled={loading}
               className="w-full h-11 lg:h-12 bg-navy-dark hover:bg-navy-light text-white font-medium rounded-lg transition-colors text-sm lg:text-base"
             >
-              Sign In
+              {loading ? 'Signing In...' : 'Sign In'}
             </Button>
           </form>

+          {/* Sign Up Link */}
+          <div className="mt-6 text-center">
+            <p className="text-sm text-gray-600">
+              Don't have an account?{' '}
+              <Link to="/signup" className="text-navy-dark hover:text-navy-light font-medium">
+                Sign Up
+              </Link>
+            </p>
+          </div>
+
           {/* Demo Accounts Section */}
           <div className="mt-8 lg:mt-12">
             <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">Demo Accounts</h3>
@@ .. @@
                 <Button
                   variant="outline"
                   size="sm"
-                  onClick={() => useDemoAccount('admin@company.com', 'password123')}
+                  onClick={() => useDemoAccount('admin@company.com', 'password123')}
+                  disabled={loading}
                   className="border-gray-300 text-gray-700 hover:bg-gray-100 ml-3 text-xs lg:text-sm px-3 lg:px-4"
                 >
-                  Use
+                  {loading ? 'Loading...' : 'Use'}
                 </Button>
               </div>

@@ .. @@
               <div className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg">
                 <div className="min-w-0 flex-1">
-                  <div className="font-medium text-gray-900 text-sm lg:text-base">Sales Member</div>
-                  <div className="text-xs lg:text-sm text-gray-600 truncate">alice@company.com</div>
+                  <div className="font-medium text-gray-900 text-sm lg:text-base">Sales Manager</div>
+                  <div className="text-xs lg:text-sm text-gray-600 truncate">manager@company.com</div>
                 </div>
                 <Button
                   variant="outline"
                   size="sm"
-                  onClick={() => useDemoAccount('alice@company.com', 'password123')}
+                  onClick={() => useDemoAccount('manager@company.com', 'password123')}
+                  disabled={loading}
                   className="border-gray-300 text-gray-700 hover:bg-gray-100 ml-3 text-xs lg:text-sm px-3 lg:px-4"
                 >
-                  Use
+                  {loading ? 'Loading...' : 'Use'}
                 </Button>
               </div>

               <div className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg">
                 <div className="min-w-0 flex-1">
                   <div className="font-medium text-gray-900 text-sm lg:text-base">Sales Member</div>
-                  <div className="text-xs lg:text-sm text-gray-600 truncate">bob@company.com</div>
+                  <div className="text-xs lg:text-sm text-gray-600 truncate">alice@company.com</div>
                 </div>
                 <Button
                   variant="outline"
                   size="sm"
-                  onClick={() => useDemoAccount('bob@company.com', 'password123')}
+                  onClick={() => useDemoAccount('alice@company.com', 'password123')}
+                  disabled={loading}
                   className="border-gray-300 text-gray-700 hover:bg-gray-100 ml-3 text-xs lg:text-sm px-3 lg:px-4"
                 >
-                  Use
+                  {loading ? 'Loading...' : 'Use'}
                 </Button>
               </div>
             </div>