'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { authService } from '@/lib/auth';
import Sidebar from './Sidebar/Sidebar';
import BottomNav from './BottomNav';
import CustomCursor from './ui/CustomCursor';
import DashboardSidebar from './DashboardSidebar';
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
        <div className="flex min-h-screen bg-[#0B0E14] text-white relative overflow-x-hidden">
            <div className="relative z-10 flex min-h-screen w-full">
                <CustomCursor />
                <Sidebar />
                <main className="flex-1 lg:ml-64 main-content-area relative overflow-hidden">
                    <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pt-20 pb-24 md:py-8">
                        <MobileStatsHeader />
                        {children}
                    </div>
                </main>
                <DashboardSidebar />
                <BottomNav />
            </div>
        </div>
    );
}
