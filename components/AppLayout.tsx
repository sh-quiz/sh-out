'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isPublicPage = pathname === '/' || pathname === '/login';

    if (isPublicPage) {
        return <>{children}</>;
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
