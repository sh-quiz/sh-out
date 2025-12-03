'use client';

import { motion } from 'framer-motion';

export default function ActivitySection() {
    // Generate dummy data for the contribution graph (approx 365 days)
    // 7 rows x 52 columns = 364 cells
    const contributionData = Array.from({ length: 364 }, (_, i) => {
        // Randomly assign activity levels: 0 (empty), 1 (low), 2 (medium), 3 (high)
        // Make it denser towards the end (right side) to simulate recent activity
        const random = Math.random();
        if (i > 300) return random > 0.3 ? (random > 0.7 ? 3 : 2) : 1;
        if (i > 200) return random > 0.5 ? (random > 0.8 ? 2 : 1) : 0;
        return random > 0.8 ? 1 : 0;
    });

    const months = [
        { name: 'December 2025', daysStudied: 28, totalDays: 31, progress: 90 },
        { name: 'November 2025', daysStudied: 30, totalDays: 30, progress: 100 },
        { name: 'October 2025', daysStudied: 25, totalDays: 31, progress: 80 },
    ];

    return (
        <div className="px-6 pb-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
            >
                <h2 className="text-xl font-semibold text-white mb-6">
                    2025 · 312 days studied
                </h2>

                {/* Contribution Graph Container */}
                <div className="p-2 bg-[#171717] rounded-md border border-white/5 mb-12 overflow-x-auto no-scrollbar">
                    <div className="min-w-max">
                        <div className="grid grid-rows-7 grid-flow-col gap-1.5">
                            {contributionData.map((level, i) => (
                                <div
                                    key={i}
                                    className={`w-3 h-3 rounded-sm ${level === 0 ? 'bg-[#2C2C2E]' :
                                        level === 1 ? 'bg-[#004080]' : // Dark blue
                                            level === 2 ? 'bg-[#007AFF]' : // Medium blue
                                                'bg-[#5AC8FA]' // Light blue
                                        }`}
                                />
                            ))}
                            {/* Add a "current day" indicator at the end */}
                            <div className="w-3 h-3 rounded-full border-2 border-white flex items-center justify-center relative -top-[1px]">
                                <div className="w-1 h-1 bg-white rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Monthly Progress */}
                <div className="space-y-8">
                    {months.map((month, index) => (
                        <div key={month.name} className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-white">{month.name}</span>
                                <span className="text-[#878D96]">{month.daysStudied} days studied</span>
                            </div>
                            <div className="h-1 w-full bg-[#2C2C2E] rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${month.progress}%` }}
                                    transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                                    className="h-full bg-[#5AC8FA] rounded-full"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
