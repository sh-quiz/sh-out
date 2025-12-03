'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Crown } from 'lucide-react';
import Link from 'next/link';

export default function LeaderboardTopBar() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-64 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-xl border-b border-white/5"
        >
            {/* Left: Back Arrow + Title */}
            <div className="flex items-center gap-4">
                <Link href="/home" className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-[#F0F2F5]" />
                </Link>
                <span className="text-lg font-medium text-[#F0F2F5] tracking-tight">Leaderboard</span>
            </div>

            {/* Right: Pulsing Crown */}
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="relative flex items-center justify-center w-8 h-8"
            >
                <Crown className="w-5 h-5 text-[#007AFF]" fill="#007AFF" fillOpacity={0.2} />
                <div className="absolute inset-0 bg-[#007AFF] blur-xl opacity-20" />
            </motion.div>
        </motion.div>
    );
}
