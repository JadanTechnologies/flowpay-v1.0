

import React, { useState } from 'react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useNavigate, useLocation } = ReactRouterDOM;
import { Zap, LogIn, Home } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // For demo purposes, pre-fill credentials based on which login page was likely intended
    useState(() => {
        if (location.pathname.startsWith('/admin')) {
            setEmail('superadmin@flowpay.com');
            setPassword('12345');
        } else {
            setEmail('admin@flowpay.com');
            setPassword('12345');
        }
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { data, error: authError } = await login(email, password);
            if (authError) throw authError;

            // Redirect based on user role
            if (data.session?.user.app_metadata.role === 'super_admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                 // Default redirect for any other tenant role
                const from = location.state?.from?.pathname || '/app/dashboard';
                navigate(from, { replace: true });
            }
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-text-primary">
      <div className="w-full max-w-md p-8 space-y-8 bg-surface rounded-xl shadow-lg border border-border">
        <div className="text-center">
            <Link to="/" className="flex justify-center items-center gap-2 mb-4">
              <Zap className="text-primary" size={32} />
              <span className="text-3xl font-bold">FlowPay</span>
            </Link>
          <h2 className="text-2xl font-bold">Sign In</h2>
          <p className="text-text-secondary">Welcome back! Please sign in to your account.</p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          {error && <div className="p-3 bg-red-900/50 text-red-400 rounded-md text-sm">{error}</div>}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-text-secondary block mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="password"className="text-sm font-medium text-text-secondary block mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
           <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary bg-background border-border rounded focus:ring-primary" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-primary hover:underline">
                Forgot your password?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed"
          >
            <LogIn size={18} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
         <div className="text-center text-sm text-text-secondary space-y-4">
            <p>
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-primary hover:underline">
                    Sign up
                </Link>
            </p>
            <div className="pt-4 border-t border-border">
                <Link to="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors">
                    <Home size={16} />
                    <span>Back to Home</span>
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;