/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    customerAccessTokenCreate,
    customerAccessTokenDelete,
    customerCreate,
    customerQuery,
    customerQueryLite,
} from '../lib/shopify';

const AuthContext = createContext(null);

const TOKEN_KEY = 'shopify_customer_token';
const EXPIRY_KEY = 'shopify_customer_token_expiry';

export function AuthProvider({ children }) {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getStoredToken = useCallback(() => {
        try {
            const token = localStorage.getItem(TOKEN_KEY);
            const expiry = localStorage.getItem(EXPIRY_KEY);
            if (!token || !expiry) return null;
            if (new Date(expiry) < new Date()) {
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(EXPIRY_KEY);
                return null;
            }
            return token;
        } catch {
            return null;
        }
    }, []);

    const storeToken = useCallback((accessToken, expiresAt) => {
        try {
            localStorage.setItem(TOKEN_KEY, accessToken);
            localStorage.setItem(EXPIRY_KEY, expiresAt);
        } catch (e) {
            console.warn('Failed to store auth token', e);
        }
    }, []);

    const clearToken = useCallback(() => {
        try {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(EXPIRY_KEY);
        } catch (e) {
            console.warn('Failed to clear auth token', e);
        }
    }, []);

    const fetchCustomer = useCallback(async (token) => {
        if (!token) {
            setCustomer(null);
            setLoading(false);
            return null;
        }
        try {
            const data = await customerQuery(token);
            const customerData = data?.customer ?? null;
            setCustomer(customerData);
            setLoading(false);
            return customerData;
        } catch (e) {
            console.warn('Primary customer query failed, attempting fallback', e);
            try {
                const fallback = await customerQueryLite(token);
                const customerData = fallback?.customer ?? null;
                if (!customerData) {
                    clearToken();
                }
                setCustomer(customerData);
                setLoading(false);
                return customerData;
            } catch (fallbackError) {
                console.error('Failed to fetch customer', fallbackError);
                clearToken();
                setCustomer(null);
                setLoading(false);
                return null;
            }
        }
    }, [clearToken]);

    // Auto-fetch customer on mount
    useEffect(() => {
        const token = getStoredToken();
        if (token) {
            fetchCustomer(token);
        } else {
            setLoading(false);
        }
    }, [getStoredToken, fetchCustomer]);

    const login = useCallback(async (email, password) => {
        setError(null);
        setLoading(true);
        try {
            const normalizedEmail = String(email ?? '').trim();
            const result = await customerAccessTokenCreate({ email: normalizedEmail, password });
            const tokenData = result?.customerAccessTokenCreate?.customerAccessToken;
            const errors = result?.customerAccessTokenCreate?.userErrors ?? [];

            if (errors.length > 0) {
                const needsVerification = errors.some((err) =>
                    /disabled|unverified|verify/i.test(err?.message || '')
                );
                const msg = needsVerification
                    ? 'Please verify your email first. Shopify has sent a verification link.'
                    : errors.map(e => e.message).join('; ');
                setError(msg);
                setLoading(false);
                return { success: false, error: msg, requiresVerification: needsVerification };
            }

            if (!tokenData?.accessToken) {
                setError('Login failed. Please try again.');
                setLoading(false);
                return { success: false, error: 'Login failed' };
            }

            storeToken(tokenData.accessToken, tokenData.expiresAt);
            const customerData = await fetchCustomer(tokenData.accessToken);
            if (!customerData) {
                const msg = 'Unable to load your account details. Please try again.';
                setError(msg);
                return { success: false, error: msg };
            }
            return { success: true };
        } catch (e) {
            const msg = e?.message || 'Login failed';
            setError(msg);
            setLoading(false);
            return { success: false, error: msg };
        }
    }, [storeToken, fetchCustomer]);

    const register = useCallback(async ({ email, password, firstName, lastName }) => {
        setError(null);
        setLoading(true);
        try {
            const normalizedEmail = String(email ?? '').trim();
            const result = await customerCreate({ email: normalizedEmail, password, firstName, lastName });
            const errors = result?.customerCreate?.userErrors ?? [];

            if (errors.length > 0) {
                const msg = errors.map(e => e.message).join('; ');
                setError(msg);
                setLoading(false);
                return { success: false, error: msg };
            }

            let verificationSent = false;
            try {
                const response = await fetch('/api/resend-verification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: normalizedEmail }),
                });
                verificationSent = response.ok;
            } catch {
                verificationSent = false;
            }

            setLoading(false);
            return { success: true, verificationSent };
        } catch (e) {
            const msg = e?.message || 'Registration failed';
            setError(msg);
            setLoading(false);
            return { success: false, error: msg };
        }
    }, []);

    const logout = useCallback(async () => {
        const token = getStoredToken();
        if (token) {
            try {
                await customerAccessTokenDelete(token);
            } catch (e) {
                console.warn('Failed to invalidate token on server', e);
            }
        }
        clearToken();
        setCustomer(null);
        setError(null);
    }, [getStoredToken, clearToken]);

    const value = {
        customer,
        isAuthenticated: !!customer,
        loading,
        error,
        login,
        register,
        logout,
        refreshCustomer: () => fetchCustomer(getStoredToken()),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
