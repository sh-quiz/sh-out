'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { authService } from '@/lib/auth';
import Sidebar from '@/components/Sidebar/Sidebar';
import BottomNav from '@/components/BottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isPublicPage = pathname === '/' || pathname?.startsWith('/auth');

    useEffect(() => {
        if (!mounted) return;

        const isAuthenticated = authService.isAuthenticated();
        console.log(`🛡️ AppLayout Guard [${pathname}]: auth=${isAuthenticated}, isPublic=${isPublicPage}`);

        if (!isAuthenticated && !isPublicPage) {
<<<<<<< HEAD
            console.warn('🚫 Not authenticated on protected page, redirecting to login...');
            router.replace('/auth/login');
=======
            router.push('/auth');
>>>>>>> origin/fix/auth
        }
    }, [pathname, isPublicPage, router, mounted]);

    if (isPublicPage) {
        return <>{children}</>;
    }

    if (!mounted) {
        return null;
    }

    if (!authService.isAuthenticated()) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-black">
            <Sidebar />
            <BottomNav />
            <main className="flex-1 md:pl-64 pb-20 md:pb-0 transition-all duration-300 ease-in-out">
                {children}
            </main>
        </div>
    );
}
