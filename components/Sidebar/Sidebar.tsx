'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { authService } from '@/lib/auth';
import {
    Home,
    Library,

    Trophy,
    ShoppingBag,
    User,
    FileText,
    Send,
    MessageSquare,
    Zap,
    Settings,
    LogOut
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await authService.logout();
        router.push('/auth');
    };

    const navItems = [
        { name: 'Home', href: '/home', icon: Home },
        { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
        { name: 'Quizzes', href: '/quizzes', icon: Zap },
        { name: 'Shop', href: '/shop', icon: ShoppingBag },
        { name: 'Account', href: '/account', icon: User },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <div className="hidden md:flex flex-col w-64 h-screen bg-black text-[#878D96] border-r border-[#161B22] fixed left-0 top-0 z-40">

            <div className="flex items-center gap-3 mb-8 px-6 pt-8">
                <div className="w-10 h-10 flex items-center justify-center cyber-border bg-blitz-yellow/5 group hover:bg-blitz-yellow/10 transition-colors">
                    <img
                        src="/assets/mascot.png"
                        alt="Bliitz-bee"
                        className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.4)] group-hover:scale-110 transition-transform"
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-white text-xl font-black tracking-[0.2em] font-orbitron uppercase leading-none">Bliitz</span>
                    <span className="text-[8px] font-mono text-blitz-yellow uppercase tracking-[0.3em] font-bold mt-1">Beta 1.0</span>
                </div>
            </div>


            <nav className="flex-1 space-y-1 px-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-4 px-4 h-[56px] rounded-none transition-all duration-300 relative group overflow-hidden ${isActive
                                ? 'text-white border-l-2 border-blitz-yellow bg-blitz-yellow/5'
                                : 'hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {isActive && (
                                <div className="absolute inset-0 cyber-grid opacity-[0.05] pointer-events-none" />
                            )}
                            <item.icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'text-blitz-yellow scale-110 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]' : 'text-[#878D96]'}`} />
                            <span className={`font-bold text-xs uppercase tracking-widest transition-all duration-300 ${isActive ? 'translate-x-1' : ''}`}>{item.name}</span>

                            {isActive && (
                                <motion.div
                                    layoutId="active-indicator"
                                    className="absolute right-0 top-0 bottom-0 w-[2px] bg-blitz-yellow shadow-[0_0_10px_#FFD700]"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>


            <div className="mt-auto space-y-1 px-4 pb-8 pt-4 border-t border-[#161B22]">
                <h3 className="text-[10px] font-bold text-[#878D96]/50 uppercase px-4 mb-2 tracking-[0.2em]">External</h3>

                <button className="w-full flex items-center justify-between px-4 h-[44px] hover:bg-white/5 hover:text-white transition-colors text-[10px] uppercase font-bold tracking-widest group">
                    <span>Telegram</span>
                    <Send className="w-3.5 h-3.5 text-white/40 group-hover:text-white" />
                </button>

                <button className="w-full flex items-center justify-between px-4 h-[44px] hover:bg-white/5 hover:text-white transition-colors text-[10px] uppercase font-bold tracking-widest group">
                    <span>Feedback</span>
                    <MessageSquare className="w-3.5 h-3.5 text-white/40 group-hover:text-white" />
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-4 h-[44px] hover:bg-white/5 hover:text-white transition-colors text-[10px] uppercase font-bold tracking-widest group mt-2"
                >
                    <span>Log out</span>
                    <LogOut className="w-3.5 h-3.5 text-white/40 group-hover:text-white" />
                </button>
            </div>
        </div>
    );
}
