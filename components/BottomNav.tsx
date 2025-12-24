'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Trophy,
    Gem,
    User,
} from 'lucide-react';

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', href: '/home', icon: LayoutDashboard },
        { name: 'Ranks', href: '/leaderboard', icon: Trophy },
        { name: 'Vault', href: '/shop', icon: Gem },
        { name: 'Profile', href: '/account', icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B0E14]/90 backdrop-blur-xl border-t border-white/10 px-4 py-2 md:hidden">
            <nav className="flex items-center justify-around mx-auto max-w-lg">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center gap-1.5 py-1 transition-all duration-300 ${isActive
                                ? 'text-voltage-blue scale-110'
                                : 'text-white/40 hover:text-white/60'
                                }`}
                        >
                            <div className={`relative p-2 rounded-xl transition-all duration-500 ${isActive
                                ? 'bg-voltage-blue/10 shadow-[0_0_20px_rgba(0,242,255,0.15)]'
                                : 'bg-transparent'
                                }`}>
                                <item.icon
                                    className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_currentColor]' : ''}`}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-bg"
                                        className="absolute inset-0 rounded-xl border border-voltage-blue/30"
                                        initial={false}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest font-orbitron ${isActive ? 'text-voltage-blue' : 'text-white/30'
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

import { motion } from 'framer-motion';
