'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Zap, Flame, Gem, ChevronRight, ExternalLink } from 'lucide-react';
import { useEnergy, useDiamonds } from '@/hooks/useEconomy';
import { useStats } from '@/hooks/useStats';
import { fetchGlobalLeaderboard, type LeaderboardEntry } from '@/lib/leaderboard';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function DashboardSidebar() {
    const { data: energyData } = useEnergy();
    const { data: diamondsData } = useDiamonds();
    const { data: statsData } = useStats();
    const pathname = usePathname();

    const energy = energyData?.energy ?? 0;
    const maxEnergy = energyData?.maxEnergy ?? 30;
    const diamonds = diamondsData?.diamonds ?? 0;
    const streak = statsData?.dayStreak ?? 0;

    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [bannerIndex, setBannerIndex] = useState(0);

    const isQuizzesPage = pathname.startsWith('/quizzes');

    const banners = [
        {
            title: "Energy Boost Available",
            desc: "Fuel your neural modules. +50 Energy in store.",
            btnText: "Visit Shop",
            link: "/shop",
            color: "border-blitz-yellow"
        },
        {
            title: "Tournament Alert",
            desc: "Bliitz Season 1 ends in 48h. Secure your rank.",
            btnText: "See Rules",
            link: "/leaderboard",
            color: "border-voltage-blue"
        },
        {
            title: "New Quiz Protocol",
            desc: "Quantum Physics modules just uploaded.",
            btnText: "Analyze",
            link: "/quizzes",
            color: "border-white"
        }
    ];

    useEffect(() => {
        const loadLeaderboard = async () => {
            const data = await fetchGlobalLeaderboard(5);
            setLeaderboard(data);
        };
        loadLeaderboard();

        const bannerTimer = setInterval(() => {
            setBannerIndex(prev => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(bannerTimer);
    }, []);

    return (
        <aside className="hidden xl:flex flex-col w-80 border-l border-white/5 bg-black/50 backdrop-blur-xl z-30">
            {isQuizzesPage && (
                <div className="p-6 border-b border-white/5 bg-blitz-yellow/5 group hover:bg-blitz-yellow/10 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-none border-2 border-blitz-yellow flex items-center justify-center font-black text-xl italic text-blitz-yellow shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                            01
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-white/40 tracking-[0.2em]">CURRENT_PROTOCOL</span>
                            <span className="text-sm font-bold text-white uppercase tracking-wider">Neural Fundamentals</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Header */}
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3 px-4 py-2 bg-blitz-yellow/5 border border-blitz-yellow/20 rounded-lg group">
                        <Flame className="w-5 h-5 text-blitz-yellow animate-pulse" fill="#FFD700" />
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest leading-none mb-1">Streak</span>
                            <span className="text-lg font-mono font-bold text-white leading-none">{streak}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-4 py-2 bg-voltage-blue/5 border border-voltage-blue/20 rounded-lg group">
                        <Gem className="w-5 h-5 text-voltage-blue" />
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest leading-none mb-1">Gems</span>
                            <span className="text-lg font-mono font-bold text-white leading-none">{diamonds}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                            <Zap className="w-3 h-3 text-voltage-blue" fill="white" />
                            Energy
                        </span>
                        <span className="text-sm font-mono text-white">{energy}<span className="text-white/30">/{maxEnergy}</span></span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(energy / maxEnergy) * 100}%` }}
                            className={`h-full ${energy < 10 ? 'bg-danger-red' : 'bg-voltage-blue'}`}
                        />
                    </div>
                </div>
            </div>

            {/* Banners Section */}
            <div className="flex-1 p-6 space-y-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={bannerIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className={`relative group cursor-pointer overflow-hidden rounded-2xl border ${banners[bannerIndex].color} aspect-video bg-carbon-grey/40 flex flex-col justify-end p-4 transition-colors`}
                        onClick={() => window.location.href = banners[bannerIndex].link}
                    >
                        <div className="absolute inset-0 cyber-grid opacity-[0.05]" />
                        <div className="relative z-10">
                            <h3 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">{banners[bannerIndex].title}</h3>
                            <p className="text-white/60 text-[10px] mb-3">{banners[bannerIndex].desc}</p>
                            <button className="w-full py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded flex items-center justify-center gap-2 hover:bg-blitz-yellow transition-colors">
                                {banners[bannerIndex].btnText} <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                    <h4 className="text-white text-[10px] font-bold mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blitz-yellow animate-pulse shadow-[0_0_5px_#FFD700]" />
                        Top Operatives
                    </h4>
                    <div className="space-y-4">
                        {leaderboard.length > 0 ? leaderboard.map((entry) => (
                            <div key={entry.userId} className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-none border flex items-center justify-center text-[10px] font-mono font-bold
                                    ${entry.rank === 1 ? 'bg-blitz-yellow border-blitz-yellow text-black' : 'bg-white/5 border-white/10 text-white/40'}
                                `}>
                                    {entry.rank}
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className="text-[10px] text-white font-bold truncate">
                                        {entry.user?.firstName || 'Unknown'} {entry.user?.lastName?.charAt(0)}.
                                    </span>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[8px] text-white/40 uppercase font-mono">{entry.score} XP</span>
                                    </div>
                                </div>
                                {entry.rank === 1 && <Flame className="w-3 h-3 text-blitz-yellow" />}
                            </div>
                        )) : (
                            <div className="animate-pulse flex flex-col gap-4">
                                {[1, 2, 3].map(i => <div key={i} className="h-8 bg-white/5 w-full rounded" />)}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 opacity-40 hover:opacity-100 transition-opacity">
                <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                    <a href="#" className="text-[10px] hover:text-white transition-colors">Terms</a>
                    <a href="#" className="text-[10px] hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="text-[10px] hover:text-white transition-colors">Help</a>
                    <a href="#" className="text-[10px] hover:text-white transition-colors">Blog</a>
                </div>
                <div className="text-[10px] font-mono">
                    &copy; 2025 SHARKS.PROTO
                </div>
            </div>
        </aside>
    );
}
