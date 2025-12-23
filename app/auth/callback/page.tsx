'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/auth';
import CyberLoader from '@/components/ui/CyberLoader';

/**
 * OAuth Callback Handler Component
 * 
 * Handles the redirect after successful OAuth authentication.
 * The backend will redirect here with tokens in URL params.
 * 
 * Flow:
 * 1. Backend OAuth callback processes authentication
 * 2. Backend redirects to this page with tokens in URL
 * 3. This page saves tokens to localStorage
 * 4. Redirects to dashboard/home
 */
function OAuthCallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        const oauthStatus = searchParams.get('oauth');
        const errorMessage = searchParams.get('message');

        // Check for tokens in URL (sent by backend)
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const userDataStr = searchParams.get('user');

        const processLogin = async () => {
            // Prioritize tokens from URL
            if (accessToken && refreshToken && userDataStr) {
                console.log('✅ [OAUTH-CALLBACK] Tokens found in URL');

                try {
                    const user = JSON.parse(decodeURIComponent(userDataStr));
                    console.log('✅ [OAUTH-CALLBACK] User parsed:', user);
                    authService.saveTokens({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                        user
                    });

                    console.log('✅ [OAUTH-CALLBACK] Tokens saved, isAuthenticated:', authService.isAuthenticated());

                    setStatus('success');

                    setTimeout(() => {
                        console.log('🧭 [OAUTH-CALLBACK] Redirecting to /home via window.location');
                        console.log('🔐 [OAUTH-CALLBACK] Final auth check before redirect:', authService.isAuthenticated());
                        window.location.href = '/home';
                    }, 800);
                    return;
                } catch (e) {
                    console.error('❌ [OAUTH-CALLBACK] Failed to parse user data:', e);
                    setStatus('error');
                    setTimeout(() => router.push('/auth/login'), 3000);
                    return;
                }
            }

            if (oauthStatus === 'success') {
                console.log('✅ [OAUTH-CALLBACK] OAuth success status detected (but no tokens in URL)');

                // Check if localStorage is already populated
                if (authService.isAuthenticated()) {
                    setStatus('success');
                    setTimeout(() => router.push('/home'), 1500);
                } else {
                    console.warn('⚠️ [OAUTH-CALLBACK] Success status but no tokens found');
                    setStatus('error');
                    setTimeout(() => router.push('/auth/login'), 3000);
                }
            } else if (errorMessage) {
                console.error('❌ [OAUTH-CALLBACK] OAuth error:', decodeURIComponent(errorMessage));
                setStatus('error');
                setTimeout(() => router.push('/auth/login'), 3000);
            } else {
                console.warn('⚠️ [OAUTH-CALLBACK] No OAuth status or tokens found, redirecting home');
                router.push('/');
            }
        };

        processLogin();

    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 md:p-10 text-center transform transition-all duration-300 hover:shadow-md">
                {status === 'loading' && (
                    <div className="flex flex-col items-center justify-center py-8">
                        <CyberLoader text="FINALIZING NEURAL LINK..." />
                    </div>
                )}

                {status === 'success' && (
                    <>
                        {/* Success State */}
                        <div className="flex justify-center mb-6 sm:mb-8">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-red-50 rounded-full flex items-center justify-center ring-4 ring-red-100 transition-transform duration-300 hover:scale-110">
                                <svg
                                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-amber-700"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                            Welcome Back!
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                            You have successfully signed in with Google.
                        </p>
                        <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                            <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-amber-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Redirecting to your dashboard...</span>
                        </div>
                    </>
                )}

                {status === 'error' && (
                    <>
                        {/* Error State */}
                        <div className="flex justify-center mb-6 sm:mb-8">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-red-50 rounded-full flex items-center justify-center ring-4 ring-red-100 transition-transform duration-300 hover:scale-110">
                                <svg
                                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-amber-700"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                            Authentication Failed
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2">
                            {searchParams.get('message') || 'Something went wrong during sign in.'}
                        </p>
                        <button
                            onClick={() => router.push('/auth/login')}
                            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-amber-700 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-red-700 active:bg-red-800 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-300"
                        >
                            Back to Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

/**
 * OAuth Callback Page
 * Wraps the callback handler in Suspense for Next.js requirements
 * 
 * @page
 */
export default function OAuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 md:p-10 text-center transform transition-all duration-300 hover:shadow-md">
                    <div className="flex flex-col items-center justify-center py-8">
                        <CyberLoader text="SYNCHRONIZING..." />
                    </div>
                </div>
            </div>
        }>
            <OAuthCallbackHandler />
        </Suspense>
    );
}