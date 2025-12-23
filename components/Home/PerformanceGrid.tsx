'use client';

import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Volume2, VolumeX, Mic, MicOff, Settings, AlertTriangle, CheckCircle2, XCircle, Info, Clock, Trophy, Zap, Flame, Gem, Users } from 'lucide-react';
import CyberLoader from '@/components/ui/CyberLoader';
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
        },
        {
            label: 'Total Study Time',
            value: isLoading || !statsData ? '...' : formatStudyTime(statsData.totalStudyTimeSeconds),
        },
    ];

    return (
        <div className="px-4 md:px-6 mb-8 max-w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 w-full">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                        className="flex flex-col p-4 bg-carbon-grey/40 border border-white/5 relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-blitz-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 relative z-10">{stat.label}</span>
                        <span className="text-2xl font-mono font-black text-blitz-yellow relative z-10 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                            {stat.value}
                        </span>
                    </motion.div>
                ))}
            </div>

            <ContributionGraph />
        </div>
    );
}
