'use client';

import { motion } from 'framer-motion';
import { Zap, Flame, Gem } from 'lucide-react';
import { useEnergy, useDiamonds } from '@/hooks/useEconomy';
import { useStats } from '@/hooks/useStats';

export default function MobileStatsHeader() {
    const { data: energyData } = useEnergy();
    const { data: diamondsData } = useDiamonds();
    const { data: statsData } = useStats();

    const energy = energyData?.energy ?? 0;
    const diamonds = diamondsData?.diamonds ?? 0;
    const streak = statsData?.dayStreak ?? 0;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex md:hidden items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-md border-b border-white/5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                <Flame className="w-3.5 h-3.5 text-white" fill="white" />
                <span className="text-xs font-mono font-bold text-white">{streak}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                <Zap className="w-3.5 h-3.5 text-white" fill="white" />
                <span className="text-xs font-mono font-bold text-white">{energy}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                <Gem className="w-3.5 h-3.5 text-white" fill="white" />
                <span className="text-xs font-mono font-bold text-white">{diamonds}</span>
            </div>
        </header>
    );
}
