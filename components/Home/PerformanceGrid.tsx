'use client';

import { motion } from 'framer-motion';

export default function PerformanceGrid() {
    const stats = [
        { label: 'Quizzes Solved', value: '1,204' },
        { label: 'Global Rank', value: '981', color: '#007AFF' },
        { label: 'Total Study Time', value: '210h' },
    ];

    return (
        <div className="px-6 mb-8">
            <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                        className="flex flex-col p-6 bg-[#171717] rounded-md border border-white/5"
                    >
                        <span className="text-[13px] font-medium text-[#878D96] mb-2">
                            {stat.label}
                        </span>
                        <span
                            className="text-[32px] font-bold text-white leading-none tracking-tight"
                            style={{ color: stat.color }}
                        >
                            {stat.value}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
