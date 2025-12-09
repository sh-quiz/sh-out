'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { authService } from '@/lib/auth';
import Sidebar from '@/components/Sidebar/Sidebar';

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

        if (!isAuthenticated && !isPublicPage) {
            router.push('/auth/login');
        }
    }, [pathname, isPublicPage, router, mounted]);

    if (isPublicPage) {
        return <>{children}</>;
    }

    if (!mounted) {
        return null; // Prevent flash of protected content
    }

    if (!authService.isAuthenticated()) {
        return null; // Don't render protected layout if not authenticated
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 pl-64 transition-all duration-300 ease-in-out">
                {children}
            </main>
        </div>
    );
}
