'use client';

import { motion } from 'framer-motion';
import { Zap, Flame, Gem, Target } from 'lucide-react';
import { useEnergy, useDiamonds } from '@/hooks/useEconomy';
import { useStats } from '@/hooks/useStats';
import { usePathname } from 'next/navigation';

export default function MobileStatsHeader() {
    const { data: energyData } = useEnergy();
    const { data: diamondsData } = useDiamonds();
    const { data: statsData } = useStats();
    const pathname = usePathname();

    const energy = energyData?.energy ?? 0;
    const maxEnergy = energyData?.maxEnergy ?? 30;
    const diamonds = diamondsData?.diamonds ?? 0;
    const streak = statsData?.dayStreak ?? 0;

    const isQuizzesPage = pathname === '/quizzes';

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex md:hidden items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-md border-b border-white/5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-blitz-yellow">
                <Flame className="w-3.5 h-3.5" fill="currentColor" />
                <span className="text-xs font-mono font-bold">{streak}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-voltage-blue">
                <Zap className="w-3.5 h-3.5" fill="currentColor" />
                <span className="text-xs font-mono font-bold">{energy}/{maxEnergy}</span>
            </div>

            {isQuizzesPage && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-white">
                    <Target className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono font-black uppercase tracking-tighter">LVL PROX</span>
                </div>
            )}

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-static-white">
                <Gem className="w-3.5 h-3.5" fill="currentColor" />
                <span className="text-xs font-mono font-bold">{diamonds}</span>
            </div>
        </header>
    );
}
