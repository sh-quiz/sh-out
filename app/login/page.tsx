'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/lib/auth';
import LoginForm from '@/components/Auth/LoginForm';
import SignupForm from '@/components/Auth/SignupForm';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const isAuth = authService.isAuthenticated();
    setIsAuthenticated(isAuth);
    if (isAuth) {
      router.push('/main');
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    router.push('/main');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Quiz App</h1>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-8">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
          {showSignup ? (
            <>
              <SignupForm onSuccess={handleAuthSuccess} />
              <p className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => setShowSignup(false)}
                  className="text-blue-600 hover:underline"
                >
                  Login
                </button>
              </p>
            </>
          ) : (
            <>
              <LoginForm onSuccess={handleAuthSuccess} />
              <p className="mt-4 text-center text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => setShowSignup(true)}
                  className="text-blue-600 hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

