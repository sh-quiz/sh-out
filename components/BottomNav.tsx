'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Library,
    Trophy,
    ShoppingBag,
    User,
} from 'lucide-react';

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', href: '/home', icon: Home },
        { name: 'Categories', href: '/categories', icon: Library },
        { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
        { name: 'Shop', href: '/shop', icon: ShoppingBag },
        { name: 'Account', href: '/account', icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#151b23] border-t border-[#30363d] px-6 py-2 md:hidden">
            <nav className="flex items-center justify-between mx-auto max-w-lg">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 min-w-[64px] py-1 rounded-lg transition-all duration-200 ${isActive
                                    ? 'text-[#58a6ff]'
                                    : 'text-[#8b949e] hover:text-[#c9d1d9]'
                                }`}
                        >
                            <div className={`p-1.5 rounded-full transition-all duration-200 ${isActive ? 'bg-[#1f6feb]/15' : 'bg-transparent'
                                }`}>
                                <item.icon
                                    className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                            </div>
                            <span className={`text-[10px] font-medium ${isActive ? 'text-[#58a6ff]' : 'text-[#8b949e]'
                                }`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
