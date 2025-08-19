import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleChange = (value) => {
    setFormData({
      ...formData,
      role: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      if (result.success) {
        // Redirect based on role
        switch (formData.role) {
          case 'admin':
            navigate('/admindashboard');
            break;
          case 'sales_manager':
            navigate('/manager-dashboard');
            break;
          case 'sales_member':
            navigate('/dashboard');
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Dark Navy Section */}
      <div className="flex-1 bg-navy-dark text-white p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
        {/* Logo */}
        <div className="mb-8 lg:mb-16">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-sm flex items-center justify-center">
              <img
                src='./logoheader.jpg'
                alt="Bristle logo"
                className="w-full h-full rounded-sm object-contain"
              />
            </div>
            <h1 className="text-3xl font-semibold">BRISTLETECH</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-10 lg:mb-11">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 lg:mb-6">
            JOIN OUR TEAM
          </h2>
          <p className="text-base lg:text-lg text-gray-300 leading-relaxed max-w-md">
            Create your account and start managing leads, tracking performance, 
            and driving revenue growth with our comprehensive CRM solution.
          </p>
        </div>

        {/* Features */}
        <div className="hidden md:block space-y-6 lg:space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-6 h-6 mt-1 flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
                <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 11L19 13L23 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Role-Based Access</h3>
              <p className="text-gray-300 text-sm lg:text-base">
                Get access to features based on your role - Admin, Sales Manager, or Sales Member.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-6 h-6 mt-1 flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
                <path d="M9 17H15M9 13H15M9 9H15M4 7.2V16.8C4 17.9201 4 18.4802 4.21799 18.908C4.40973 19.2843 4.71569 19.5903 5.09202 19.782C5.51984 20 6.07989 20 7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V7.2C20 6.0799 20 5.51984 19.782 5.09202C19.5903 4.71569 19.2843 4.40973 18.908 4.21799C18.4802 4 17.9201 4 16.8 4H7.2C6.0799 4 5.51984 4 5.09202 4.21799C4.71569 4.40973 4.40973 4.71569 4.21799 5.09202C4 5.51984 4 6.0799 4 7.2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Lead Management</h3>
              <p className="text-gray-300 text-sm lg:text-base">
                Efficiently manage and track leads through your sales pipeline.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-6 sm:p-8 lg:p-12 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-sm sm:text-base text-gray-600">Sign up to get started with BRISTLETECH CRM</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label htmlFor="role" className="text-sm font-medium text-gray-700">Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="sales_manager">Sales Manager</SelectItem>
                  <SelectItem value="sales_member">Sales Member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mt-1"
                placeholder="Confirm your password"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 lg:h-12 bg-navy-dark hover:bg-navy-light text-white font-medium rounded-lg transition-colors text-sm lg:text-base"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/" className="text-navy-dark hover:text-navy-light font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}