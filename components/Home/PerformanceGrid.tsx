'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '../../app/api/client';
import ContributionGraph from './ContributionGraph';

interface UserStatsResponse {
    xp: number;
    globalRank: number;
    totalStudyTimeSeconds: number | string;
    quizzesSolved: number;
}

export default function PerformanceGrid() {
    const { data: statsData, isLoading } = useQuery({
        queryKey: ['userStats'],
        queryFn: async () => {
            const { data } = await api.get<UserStatsResponse>('/users/me/stats');
            return data;
        },
    });

    // Format study time (seconds -> hours)
    const formatStudyTime = (seconds: number | string) => {
        const totalSeconds = typeof seconds === 'string' ? parseInt(seconds, 10) : seconds;
        const hours = Math.floor(totalSeconds / 3600);
        return `${hours}h`;
    };

    const stats = [
        {
            label: 'Quizzes Solved',
            value: isLoading || !statsData ? '...' : statsData.quizzesSolved.toLocaleString(),
        },
        {
            label: 'Global Rank',
            value: isLoading || !statsData ? '...' : `#${statsData.globalRank.toLocaleString()}`,
            color: '#007AFF'
        },
        {
            label: 'Total Study Time',
            value: isLoading || !statsData ? '...' : formatStudyTime(statsData.totalStudyTimeSeconds),
        },
    ];

    return (
        <div className="px-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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

            <ContributionGraph />
        </div>
    );
}
