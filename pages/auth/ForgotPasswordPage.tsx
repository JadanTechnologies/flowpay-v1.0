import React, { useState } from 'react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        // Mock logic
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSuccess(true);

        setLoading(false);
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-text-primary">
      <div className="w-full max-w-md p-8 space-y-8 bg-surface rounded-xl shadow-lg border border-border">
        <div className="text-center">
            <Link to="/" className="flex justify-center items-center gap-2 mb-4">
              <Zap className="text-primary" size={32} />
              <span className="text-3xl font-bold">FlowPay</span>
            </Link>
          <h2 className="text-2xl font-bold">Forgot Your Password?</h2>
          <p className="text-text-secondary">Enter your email to receive a reset link.</p>
        </div>
        
        {success ? (
            <div className="p-4 bg-green-900/50 text-green-300 rounded-md text-center">
                <h3 className="font-bold">Check Your Email</h3>
                <p className="text-sm">If an account exists for {email}, you will receive an email with password reset instructions.</p>
            </div>
        ) : (
            <form className="space-y-6" onSubmit={handleReset}>
                <div>
                    <label htmlFor="email" className="text-sm font-medium text-text-secondary block mb-2">Email Address</label>
                    <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed">
                    <Mail size={18} />
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>
        )}
        
        <p className="text-center text-sm text-text-secondary">
            Remembered your password?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
                Sign In
            </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;