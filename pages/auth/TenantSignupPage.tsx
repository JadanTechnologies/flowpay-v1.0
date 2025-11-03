import React, { useState } from 'react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import * as ReactRouterDOM from 'react-router-dom';
import { Zap, UserPlus } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const TenantSignupPage: React.FC = () => {
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    company_name: companyName,
                }
            }
        });

        setLoading(false);

        if (error) {
            setError(error.message);
        } else if (data.user) {
             // Supabase sends a confirmation email by default
            setSuccess(true);
        }
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-text-primary">
      <div className="w-full max-w-md p-8 space-y-8 bg-surface rounded-xl shadow-lg border border-border">
        <div className="text-center">
            <ReactRouterDOM.Link to="/" className="flex justify-center items-center gap-2 mb-4">
              <Zap className="text-primary" size={32} />
              <span className="text-3xl font-bold">FlowPay</span>
            </ReactRouterDOM.Link>
          <h2 className="text-2xl font-bold">Create Your Account</h2>
          <p className="text-text-secondary">Start your 30-day free trial.</p>
        </div>
        
        {success ? (
             <div className="p-4 bg-green-900/50 text-green-300 rounded-md text-center">
                <h3 className="font-bold">Check your email!</h3>
                <p className="text-sm">
                    We've sent a confirmation link to {email}. Please click it to activate your account.
                </p>
            </div>
        ) : (
            <form className="space-y-6" onSubmit={handleSignup}>
                {error && <div className="p-3 bg-red-900/50 text-red-400 rounded-md text-sm">{error}</div>}
                 <div>
                    <label htmlFor="companyName" className="text-sm font-medium text-text-secondary block mb-2">Company Name</label>
                    <input type="text" id="companyName" name="companyName" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                    <label htmlFor="email" className="text-sm font-medium text-text-secondary block mb-2">Email Address</label>
                    <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                    <label htmlFor="password"className="text-sm font-medium text-text-secondary block mb-2">Password</label>
                    <input type="password" id="password" name="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
            
                <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed">
                    <UserPlus size={18} />
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>
        )}
        
        <p className="text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <ReactRouterDOM.Link to="/login" className="font-medium text-primary hover:underline">
                Sign In
            </ReactRouterDOM.Link>
        </p>
      </div>
    </div>
  );
};

export default TenantSignupPage;