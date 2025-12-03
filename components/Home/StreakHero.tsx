'use client';

import { motion } from 'framer-motion';
import { Flame, Plus } from 'lucide-react';

export default function StreakHero() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full flex flex-col items-center justify-center py-16 overflow-hidden"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[300px] h-[300px] bg-[#FFB340] rounded-full opacity-[0.03] blur-[100px]" />
            </div>

            {/* Streak Number */}
            <div className="relative z-10 flex flex-col items-center">
                <h1 className="text-[120px] leading-none font-[100] text-white tracking-tighter select-none">
                    0
                </h1>

                {/* Subtext */}
                <div className="flex items-center gap-2 mt-4 mb-8">
                    <Flame className="w-4 h-4 text-[#FFB340]" fill="#FFB340" />
                    <span className="text-sm text-[#878D96] font-medium">Start learning now and unlock your streak</span>
                </div>

                {/* CTA Button */}
                <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255, 179, 64, 0.2)" }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative px-8 py-4 bg-[#FFB340] text-black rounded-2xl font-semibold text-base tracking-wide overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        Create a course
                        <Plus className="w-4 h-4 opacity-60 group-hover:rotate-90 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
            </div>
        </motion.div>
    );
}
