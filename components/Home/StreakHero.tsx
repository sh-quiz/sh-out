'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export default function StreakHero() {
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
                    47
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
