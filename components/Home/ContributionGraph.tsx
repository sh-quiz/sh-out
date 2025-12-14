'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getContributions, Contribution } from '../../app/api/contributions';

export default function ContributionGraph() {
    const { data: contributions, isLoading } = useQuery({
        queryKey: ['contributions'],
        queryFn: getContributions,
    });

    // Helper to generate a grid of days for the last year
    // For simplicity, we'll display the last 365 days or a fixed grid
    // This is a simplified implementation of a GitHub-style graph
    const generateCalendarGrid = () => {
        const today = new Date();
        const days = [];
        // Generate last ~1 year of days (52 weeks * 7 days = 364 days)
        for (let i = 364; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            days.push(dateString);
        }
        return days;
    };

    const days = generateCalendarGrid();

    const getContributionLevel = (count: number) => {
        if (count === 0) return 0;
        if (count <= 1) return 1;
        if (count <= 3) return 2;
        if (count <= 5) return 3;
        return 4;
    };

    const getColor = (level: number) => {
        switch (level) {
            case 0: return 'bg-[#1e1e1e]'; // Empty
            case 1: return 'bg-emerald-900'; // Low
            case 2: return 'bg-emerald-700';
            case 3: return 'bg-emerald-500';
            case 4: return 'bg-emerald-400'; // High
            default: return 'bg-[#1e1e1e]';
        }
    };

    // Transform API data to a map for easy lookup
    const contributionsMap = new Map<string, number>();
    if (contributions) {
        contributions.forEach((c: Contribution) => {
            contributionsMap.set(c.date, c.count);
        });
    }

    // Calculate total contributions
    const totalContributions = contributions ? contributions.reduce((acc, curr) => acc + curr.count, 0) : 0;
    const currentYear = new Date().getFullYear();

    return (
        <div className="px-6 mb-8">
            <div className="p-6 bg-[#0a0a0a] rounded-md border border-white/5">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-white mb-2">
                        {totalContributions} contributions in the last year
                    </h3>
                </div>

                {isLoading ? (
                    <div className="h-32 flex items-center justify-center text-gray-500">Loading contributions...</div>
                ) : (
                    <div className="flex flex-wrap gap-[3px]">
                        {days.map((dateStr) => {
                            const count = contributionsMap.get(dateStr) || 0;
                            const level = getContributionLevel(count);
                            return (
                                <motion.div
                                    key={dateStr}
                                    className={`w-[10px] h-[10px] rounded-sm ${getColor(level)}`}
                                    title={`${count} contributions on ${dateStr}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    whileHover={{ scale: 1.2 }}
                                />
                            );
                        })}
                    </div>
                )}
                <div className="flex items-center justify-end mt-4 gap-2 text-xs text-gray-500">
                    <span>Less</span>
                    <div className="flex gap-[2px]">
                        <div className="w-[10px] h-[10px] rounded-sm bg-[#1e1e1e]" />
                        <div className="w-[10px] h-[10px] rounded-sm bg-emerald-900" />
                        <div className="w-[10px] h-[10px] rounded-sm bg-emerald-700" />
                        <div className="w-[10px] h-[10px] rounded-sm bg-emerald-500" />
                        <div className="w-[10px] h-[10px] rounded-sm bg-emerald-400" />
                    </div>
                    <span>More</span>
                </div>
            </div>
        </div>
    );
}
