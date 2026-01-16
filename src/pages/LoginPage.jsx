import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState('');
    const [resendStatus, setResendStatus] = useState(null);
    const [resending, setResending] = useState(false);
    const { login, loading, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        setResendStatus(null);

        if (!email || !password) {
            setLocalError('Please fill in all fields');
            return;
        }

        const result = await login(email, password);
        if (result.success) {
            navigate('/profile');
        }
    };

    const handleResendVerification = async () => {
        setResendStatus(null);

        if (!email) {
            setResendStatus({ type: 'error', message: 'Enter your email to resend verification.' });
            return;
        }

        try {
            setResending(true);
            const response = await fetch('/api/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setResendStatus({
                    type: 'error',
                    message: data?.error || 'Unable to resend verification email.',
                });
                return;
            }

            setResendStatus({
                type: 'success',
                message: data?.message || 'Verification email sent. Please check your inbox.',
            });
        } catch (err) {
            setResendStatus({
                type: 'error',
                message: 'Unable to resend verification email.',
            });
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-16 site-shell flex flex-col items-center">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                    {resendStatus && (
                        <div
                            className={`mb-6 p-4 rounded-lg text-sm border ${resendStatus.type === 'success'
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : 'bg-red-50 border-red-200 text-red-700'
                                }`}
                        >
                            {resendStatus.message}
                        </div>
                    )}
                    {(localError || error) && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {localError || error}
                        </div>
                    )}

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <span>Signing in...</span>
                        ) : (
                            <>
                                <LogIn className="w-5 h-5" />
                                <span>Sign In</span>
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleResendVerification}
                        disabled={resending}
                        className="w-full mt-4 text-sm font-semibold text-gray-700 hover:text-black disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {resending ? 'Sending verification email...' : "Didn't get the email? Resend verification"}
                    </button>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-black font-bold hover:underline">
                            Create one
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
