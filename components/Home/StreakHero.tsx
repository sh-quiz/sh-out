'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { statsService } from '../../lib/stats';

export default function StreakHero() {
    const [streak, setStreak] = useState<number | null>(null);

    useEffect(() => {
        const fetchStreak = async () => {
            try {
                const stats = await statsService.getStats();
                setStreak(stats.dayStreak);
            } catch (error) {
                console.error('Failed to fetch user stats', error);
            }
        };
        fetchStreak();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full flex flex-col items-center justify-center pt-12 pb-8"
        >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#FFB340] rounded-full opacity-[0.03] blur-[100px] pointer-events-none" />

            {/* Streak Number */}
            <div className="relative z-10 flex flex-col items-center">
                <h1 className="text-[140px] leading-none font-light text-white tracking-tighter select-none">
                    {streak !== null ? streak : '-'}
                </h1>

                {/* Subtext */}
                <div className="flex items-center gap-2 mt-2">
                    <Flame className="w-5 h-5 text-[#FFB340]" fill="#FFB340" />
                    <span className="text-[#878D96] font-medium tracking-wide">Day Streak</span>
                </div>
            </div>
        </motion.div>
    );
}
