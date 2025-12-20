'use client';

import { motion } from 'framer-motion';
import { Zap, Gem, RefreshCw } from 'lucide-react';
import { useEnergy, useDiamonds, useConvertDiamonds } from '@/hooks/useEconomy';
import { useState } from 'react';

export default function EnergyGemsRow() {
    const { data: energyData, refetch: refetchEnergy } = useEnergy();
    const { data: diamondsData, refetch: refetchDiamonds } = useDiamonds();
    const { mutate: convertDiamonds, isPending: isConverting } = useConvertDiamonds();

    const energy = energyData?.energy || 0;
    const maxEnergy = energyData?.maxEnergy || 30;
    const diamonds = diamondsData?.diamonds || 0;

    const handleConvert = () => {
        if (diamonds > 0 && energy < maxEnergy) {
            convertDiamonds(1, {
                onSuccess: () => {
                    refetchEnergy();
                    refetchDiamonds();
                }
            });
        }
    };


    // 30 / 5 = 6 groups
    const groups = [];
    for (let i = 0; i < 6; i++) {
        groups.push(i);
    }


    const getBarStatus = (groupIndex: number, barIndex: number) => {
        const absoluteIndex = groupIndex * 5 + barIndex + 1;
        return absoluteIndex <= energy;
    };

    return (
        <div className="px-4 md:px-6 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="p-6 bg-[#171717] rounded-md border border-white/5 flex flex-col justify-between min-h-[140px] overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[15px] font-medium text-white">Energy</span>
                        <div className="flex items-center gap-1.5 text-[#FFB340] text-xs font-medium">
                            <Zap className="w-3.5 h-3.5" fill="#FFB340" />
                            {energy < maxEnergy && energyData?.nextRefillAt ? (
                                <span>Refill in {Math.ceil((new Date(energyData.nextRefillAt).getTime() - Date.now()) / (1000 * 60))}m</span>
                            ) : (
                                <span>Full</span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        {groups.map((groupIndex) => (
                            <div key={`group-${groupIndex}`} className="flex gap-1.5">
                                {[...Array(5)].map((_, barIndex) => {
                                    const active = getBarStatus(groupIndex, barIndex);
                                    return (
                                        <div
                                            key={`bar-${groupIndex}-${barIndex}`}
                                            className={`h-2 flex-1 rounded-full transition-colors duration-300 ${active ? 'bg-[#34D399] shadow-[0_0_8px_rgba(52,211,153,0.4)]' : 'bg-white/10'
                                                }`}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex justify-between items-center text-xs text-[#878D96] font-medium">
                        <span>{energy}/{maxEnergy} bars based on activity</span>


                        {diamonds > 0 && energy <= maxEnergy - 10 && (
                            <button
                                onClick={handleConvert}
                                disabled={isConverting}
                                className="flex items-center gap-1 text-[#34D399] hover:text-[#2bb582] transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`w-3 h-3 ${isConverting ? 'animate-spin' : ''}`} />
                                +10 bars (1 Diamond)
                            </button>
                        )}
                    </div>
                </motion.div>


                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="p-6 bg-[#171717] rounded-md border border-white/5 flex flex-col justify-between min-h-[140px]"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[15px] font-medium text-white">Diamonds</span>
                        <Gem className="w-4 h-4 text-[#38BDF8]" fill="#38BDF8" />
                    </div>

                    <div>
                        <span className="text-[32px] font-bold text-white leading-none tracking-tight">
                            {diamonds}
                        </span>
                    </div>

                    <div className="mt-auto flex justify-between items-center text-xs text-[#878D96] font-medium">
                        <span>Earned by perfecting quizzes</span>

                        {diamonds > 0 && energy < maxEnergy && (
                            <button
                                onClick={handleConvert}
                                disabled={isConverting}
                                className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-white flex items-center gap-1 transition-colors"
                            >
                                <Zap className="w-3 h-3 text-[#FFB340]" fill="#FFB340" />
                                Convert 1 for 10 Energy
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
