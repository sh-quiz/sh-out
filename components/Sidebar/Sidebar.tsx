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
        { name: 'Home', href: '/home', icon: Home },
        { name: 'Categories', href: '/categories', icon: Library },
        { name: 'Question Bank', href: '/quizzes', icon: BookOpen },
        { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
        { name: 'Shop', href: '/shop', icon: ShoppingBag },
        { name: 'Account', href: '/account', icon: User },
    ];

    return (
        <div className="w-64 h-screen bg-black text-[#878D96] flex flex-col border-r border-[#161B22] fixed left-0 top-0 z-40">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8 px-6 pt-8">
                <div className="w-8 h-8 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#FFB340" />
                    </svg>
                </div>
                <span className="text-white text-xl font-medium tracking-tight">StudyFit</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-4 px-4 h-[56px] rounded-xl transition-all duration-300 ${isActive
                                ? 'bg-[#007AFF]/10 text-white'
                                : 'hover:bg-[#161B22] hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-[#007AFF]' : 'text-[#878D96]'}`} />
                            <span className="font-medium text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* More Section */}
            <div className="mt-auto space-y-1 px-4 pb-8 pt-4 border-t border-[#161B22]">
                <h3 className="text-xs font-semibold text-[#878D96]/50 uppercase px-4 mb-2 tracking-wider">More</h3>

                <button className="w-full flex items-center justify-between px-4 h-[48px] hover:bg-[#161B22] hover:text-white rounded-xl transition-colors text-sm group">
                    <span>View public quizzes</span>
                    <FileText className="w-4 h-4 text-[#878D96] group-hover:text-white" />
                </button>

                <button className="w-full flex items-center justify-between px-4 h-[48px] hover:bg-[#161B22] hover:text-white rounded-xl transition-colors text-sm group">
                    <span>Use on telegram</span>
                    <Send className="w-4 h-4 text-[#007AFF]" />
                </button>

                <button className="w-full flex items-center justify-between px-4 h-[48px] hover:bg-[#161B22] hover:text-white rounded-xl transition-colors text-sm group">
                    <span>Leave feedback</span>
                    <MessageSquare className="w-4 h-4 text-[#878D96] group-hover:text-white" />
                </button>

                <button className="w-full flex items-center justify-between px-4 h-[48px] hover:bg-[#161B22] hover:text-white rounded-xl transition-colors text-sm group">
                    <span>Report an issue</span>
                    <AlertCircle className="w-4 h-4 text-[#878D96] group-hover:text-white" />
                </button>
            </div>
        </div>
    );
}
