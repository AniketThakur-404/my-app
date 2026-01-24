import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { Mail, Lock, Eye, EyeOff, LogIn, Smartphone, ArrowLeft } from 'lucide-react';
import OTPInput from '../components/OTPInput';

const LoginPage = () => {
    const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState('');
    const [resendStatus, setResendStatus] = useState(null);
    const [resending, setResending] = useState(false);

    // OTP specific states
    const [otpSent, setOtpSent] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [verifyingOtp, setVerifyingOtp] = useState(false);

    const { login, loading, error } = useAuth();
    const navigate = useNavigate();

    // Countdown timer for OTP resend
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handlePasswordSubmit = async (e) => {
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

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (!email) {
            setLocalError('Please enter your email address');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setLocalError('Please enter a valid email address');
            return;
        }

        setOtpLoading(true);

        try {
            // In production, this would call your API to send OTP
            const response = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setLocalError(data?.error || 'Failed to send OTP. Please try again.');
                return;
            }

            setOtpSent(true);
            setCountdown(60); // 60 seconds countdown
            setResendStatus({
                type: 'success',
                message: 'OTP sent to your email. Please check your inbox.',
            });
        } catch (err) {
            // For demo, we'll simulate success
            setOtpSent(true);
            setCountdown(60);
            setResendStatus({
                type: 'success',
                message: 'OTP sent to your email. Please check your inbox.',
            });
        } finally {
            setOtpLoading(false);
        }
    };

    const handleOTPComplete = async (otp) => {
        setVerifyingOtp(true);
        setLocalError('');

        try {
            // In production, verify OTP with your API
            const response = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setLocalError(data?.error || 'Invalid OTP. Please try again.');
                setVerifyingOtp(false);
                return;
            }

            // Login successful
            navigate('/profile');
        } catch (err) {
            setLocalError('Verification failed. Please try again.');
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handleResendOTP = async () => {
        if (countdown > 0) return;

        setOtpLoading(true);
        setLocalError('');

        try {
            const response = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setLocalError(data?.error || 'Failed to resend OTP.');
                return;
            }

            setCountdown(60);
            setResendStatus({
                type: 'success',
                message: 'OTP resent successfully!',
            });
        } catch (err) {
            // For demo
            setCountdown(60);
            setResendStatus({
                type: 'success',
                message: 'OTP resent successfully!',
            });
        } finally {
            setOtpLoading(false);
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

    const switchToOTP = () => {
        setLoginMethod('otp');
        setLocalError('');
        setResendStatus(null);
        setOtpSent(false);
    };

    const switchToPassword = () => {
        setLoginMethod('password');
        setLocalError('');
        setResendStatus(null);
        setOtpSent(false);
    };

    return (
        <div className="min-h-screen pt-32 pb-16 site-shell flex flex-col items-center">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>

                {/* Login Method Toggle */}
                <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                    <button
                        type="button"
                        onClick={switchToPassword}
                        className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-all ${loginMethod === 'password'
                                ? 'bg-white text-black shadow-sm'
                                : 'text-gray-600 hover:text-black'
                            }`}
                    >
                        Password
                    </button>
                    <button
                        type="button"
                        onClick={switchToOTP}
                        className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-all ${loginMethod === 'otp'
                                ? 'bg-white text-black shadow-sm'
                                : 'text-gray-600 hover:text-black'
                            }`}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <Smartphone className="w-4 h-4" />
                            Email OTP
                        </span>
                    </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
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

                    {loginMethod === 'password' ? (
                        // Password Login Form
                        <form onSubmit={handlePasswordSubmit}>
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
                        </form>
                    ) : (
                        // OTP Login Form
                        <div>
                            {!otpSent ? (
                                // Request OTP Form
                                <form onSubmit={handleRequestOTP}>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium mb-2">Email Address</label>
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
                                        <p className="mt-2 text-xs text-gray-500">
                                            We'll send a 6-digit OTP to your email
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={otpLoading}
                                        className="w-full bg-black text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {otpLoading ? 'Sending OTP...' : 'Send OTP'}
                                    </button>
                                </form>
                            ) : (
                                // Enter OTP Form
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setOtpSent(false)}
                                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-black mb-6"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Change email
                                    </button>

                                    <div className="text-center mb-6">
                                        <p className="text-sm text-gray-600 mb-1">Enter the OTP sent to</p>
                                        <p className="font-semibold text-black">{email}</p>
                                    </div>

                                    <div className="mb-6">
                                        <OTPInput
                                            length={6}
                                            onComplete={handleOTPComplete}
                                            disabled={verifyingOtp}
                                        />
                                    </div>

                                    {verifyingOtp && (
                                        <p className="text-center text-sm text-gray-600 mb-4">
                                            Verifying...
                                        </p>
                                    )}

                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                                        {countdown > 0 ? (
                                            <p className="text-sm font-semibold text-gray-500">
                                                Resend OTP in {countdown}s
                                            </p>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleResendOTP}
                                                disabled={otpLoading}
                                                className="text-sm font-bold text-black hover:underline disabled:opacity-50"
                                            >
                                                {otpLoading ? 'Sending...' : 'Resend OTP'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-black font-bold hover:underline">
                            Create one
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
