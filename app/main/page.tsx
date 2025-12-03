'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/lib/auth';

import { useRouter } from 'next/navigation';


export default function MainPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const isAuth = authService.isAuthenticated();
        if (!isAuth) {
            router.push('/login');
        } else {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = async () => {
        await authService.logout();
        router.push('/');
    };

    if (!mounted || !isAuthenticated) return null;

    return (
        <div className="bg-gray-50 min-h-screen">
            <nav className="bg-white border-b border-gray-200 px-4 py-3">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">Quiz App</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    >
                        Logout
                    </button>
                </div>
            </nav>
            <div className="max-w-6xl mx-auto py-8">
                {/* Content moved to /quizzes */}
            </div>
        </div>
    );
}
