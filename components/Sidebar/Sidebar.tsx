'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Library,
    BookOpen,
    Trophy,
    ShoppingBag,
    User,
    FileText,
    Send,
    MessageSquare,
    AlertCircle
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'HOME', href: '/', icon: Home },
        { name: 'CATEGORIES', href: '/categories', icon: Library },
        { name: 'QUESTION BANK', href: '/questions', icon: BookOpen },
        { name: 'LEADERBOARD', href: '/leaderboard', icon: Trophy },
        { name: 'SHOP', href: '/shop', icon: ShoppingBag },
        { name: 'ACCOUNT', href: '/account', icon: User },
    ];

    return (
        <div className="w-64 h-screen bg-[#1e2329] text-gray-300 flex flex-col p-4 border-r border-gray-800">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8 px-2">
                <div className="w-10 h-10 bg-yellow-500 rounded transform rotate-45 flex items-center justify-center">
                    <span className="text-black font-bold text-xl transform -rotate-45">S</span>
                </div>
                <span className="text-white text-2xl font-bold">StudyFit</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-900/40 text-blue-400 border border-blue-800'
                                    : 'hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-6 h-6 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
                            <span className="font-semibold">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* More Section */}
            <div className="mt-auto space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase px-2 mb-2">More</h3>

                <button className="w-full flex items-center justify-between px-4 py-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg transition-colors text-sm">
                    <span>View public quizzes</span>
                    <FileText className="w-4 h-4 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between px-4 py-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg transition-colors text-sm">
                    <span>Use on telegram</span>
                    <Send className="w-4 h-4 text-blue-400" />
                </button>

                <button className="w-full flex items-center justify-between px-4 py-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg transition-colors text-sm">
                    <span>Leave feedback</span>
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between px-4 py-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg transition-colors text-sm">
                    <span>Report an issue</span>
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                </button>
            </div>
        </div>
    );
}
