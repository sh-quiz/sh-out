'use client';

import { motion } from 'framer-motion';

export default function PerformanceGrid() {
    const stats = [
        { label: 'Longest Streak', value: '0 days' },
        { label: 'Quizzes Solved', value: '0' },
    ];

    return (
        <div className="px-6 py-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                        className="flex flex-col relative"
                    >
                        <span className="text-[48px] font-bold text-white leading-none tracking-tight">
                            {stat.value}
                        </span>
                        <span className="text-xs font-medium text-[#878D96] uppercase tracking-wider mt-2">
                            {stat.label}
                        </span>

                        {/* Divider Line */}
                        <div className="absolute bottom-[-16px] left-0 w-full h-[1px] bg-white opacity-[0.08]" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
