'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { statsService, type UserStats, type HeatmapItem } from '../../lib/stats';

export default function ActivitySection() {
    const [stats, setStats] = useState<UserStats | null>(null);
    const [heatmap, setHeatmap] = useState<HeatmapItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, heatmapData] = await Promise.all([
                    statsService.getStats(),
                    statsService.getHeatmap()
                ]);
                setStats(statsData);
                setHeatmap(heatmapData);
            } catch (error) {
                console.error("Failed to fetch activity data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const processContributionData = () => {
        const year = new Date().getFullYear();
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year, 11, 31);


        const activityMap = new Map<string, number>();
        heatmap.forEach(item => {
            let level = 0;
            if (item.count > 0) {
                // Determine level based on count/intensity

                if (item.count >= 10) level = 3;
                else if (item.count >= 5) level = 2;
                else level = 1;
            }
            activityMap.set(item.date, level);
        });

        const days = [];
        const current = new Date(startOfYear);
        while (current <= endOfYear) {
            const dateStr = current.toISOString().split('T')[0];
            days.push(activityMap.get(dateStr) || 0);
            current.setDate(current.getDate() + 1);
        }
        return days;
    };

    const contributionData = processContributionData();


    const processMonthlyStats = () => {
        if (!heatmap.length) return [];


        const monthlyData = new Map<string, { daysStudied: number, totalDays: number }>();
        const year = new Date().getFullYear();
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];




        const currentMonth = new Date().getMonth();

        const result = [];
        for (let i = 0; i < 3; i++) {
            let mIndex = currentMonth - i;
            let y = year;
            if (mIndex < 0) {
                mIndex += 12;
                y -= 1;
            }

            const monthName = `${monthNames[mIndex]} ${y}`;
            const daysInMonth = new Date(y, mIndex + 1, 0).getDate();


            let daysStudied = 0;
            heatmap.forEach(h => {
                const d = new Date(h.date);
                if (d.getMonth() === mIndex && d.getFullYear() === y && h.count > 0) {
                    daysStudied++;
                }
            });

            result.push({
                name: monthName,
                daysStudied,
                totalDays: daysInMonth,
                progress: Math.round((daysStudied / daysInMonth) * 100)
            });
        }
        return result;
    };

    const months = processMonthlyStats();


    const totalDaysStudied = heatmap.filter(h => h.date.startsWith(new Date().getFullYear().toString()) && h.count > 0).length;

    if (loading) {
        return <div className="p-6 text-white/50">Loading activity...</div>;
    }

    return (
        <div className="px-6 pb-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
            >
                <h2 className="text-xl font-semibold text-white mb-6">
                    {new Date().getFullYear()} · {totalDaysStudied} days studied
                </h2>


                <div className="p-2 bg-[#171717] rounded-md border border-white/5 mb-12 overflow-x-auto no-scrollbar max-w-full">
                    <div className="min-w-max">

                        <div className="grid grid-rows-7 grid-flow-col gap-1.5">
                            {contributionData.map((level, i) => (
                                <div
                                    key={i}
                                    className={`w-3 h-3 rounded-sm ${level === 0 ? 'bg-[#2C2C2E]' :
                                        level === 1 ? 'bg-[#004080]' :
                                            level === 2 ? 'bg-[#007AFF]' :
                                                'bg-[#5AC8FA]'
                                        }`}
                                    title={`Day ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>


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
