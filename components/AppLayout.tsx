'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { authService } from '@/lib/auth';
import Sidebar from '@/components/Sidebar/Sidebar';
import BottomNav from '@/components/BottomNav';
import DashboardSidebar from '@/components/DashboardSidebar';
import MobileStatsHeader from '@/components/MobileStatsHeader';
import CyberLoader from '@/components/ui/CyberLoader';

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

        try {
            const isAuthenticated = authService.isAuthenticated();
            console.log(`🛡️ AppLayout Guard [${pathname}]: auth=${isAuthenticated}, isPublic=${isPublicPage}`);

            if (!isAuthenticated && !isPublicPage) {
                console.log('Redirecting to /auth...');
                window.location.href = '/auth';
            }
        } catch (error) {
            console.error('AppLayout auth check failed:', error);
            if (!isPublicPage) window.location.href = '/auth';
        }
    }, [pathname, isPublicPage, router, mounted]);

    if (!mounted) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <CyberLoader text="ESTABLISHING LINK..." />
            </div>
        );
    }

    if (isPublicPage) {
        return <>{children}</>;
    }

    // Safe check for rendering
    let isAuthenticated = false;
    try {
        isAuthenticated = authService.isAuthenticated();
    } catch (e) {
        console.error('Auth check error during render:', e);
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <CyberLoader text="IDENTIFYING ASSET..." />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-black transition-colors duration-500 overflow-x-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 cyber-grid opacity-[0.05]" />
                <div className="scan-line opacity-20" />
                <div className="absolute inset-0 bg-linear-to-b from-[#0B0E14] via-transparent to-[#0B0E14] opacity-50" />
            </div>

            <Sidebar />

            <div className="flex-1 flex flex-col md:pl-64 xl:pr-80 min-h-screen relative z-10 transition-all duration-300 ease-in-out">
                <MobileStatsHeader />

                <BottomNav />

                <main className="flex-1 w-full max-w-5xl mx-auto pt-16 md:pt-8 pb-32 md:pb-12 px-4 md:px-8">
                    {children}
                </main>
            </div>

            <DashboardSidebar />
        </div>
    );
}
