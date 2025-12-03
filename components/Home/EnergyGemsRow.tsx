'use client';

import { motion } from 'framer-motion';
import { Zap, Gem } from 'lucide-react';

export default function EnergyGemsRow() {
    return (
        <div className="px-6 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Energy Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="p-6 bg-[#171717] rounded-md border border-white/5 flex flex-col justify-between min-h-[140px]"
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[15px] font-medium text-white">Energy</span>
                        <div className="flex items-center gap-1.5 text-[#FFB340] text-xs font-medium">
                            <Zap className="w-3.5 h-3.5" fill="#FFB340" />
                            Refill
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex gap-1.5">
                            {[...Array(5)].map((_, i) => (
                                <div key={`r1-${i}`} className="h-2 flex-1 rounded-full bg-[#34D399]" />
                            ))}
                        </div>
                        <div className="flex gap-1.5">
                            {[...Array(5)].map((_, i) => (
                                <div key={`r2-${i}`} className="h-2 flex-1 rounded-full bg-[#34D399]" />
                            ))}
                        </div>
                        <div className="flex gap-1.5">
                            {[...Array(5)].map((_, i) => (
                                <div key={`r3-${i}`} className="h-2 flex-1 rounded-full bg-[#34D399]" />
                            ))}
                        </div>
                        <div className="flex gap-1.5">
                            {[...Array(5)].map((_, i) => (
                                <div key={`r4-${i}`} className="h-2 flex-1 rounded-md bg-[#34D399]" />
                            ))}
                        </div>
                        <div className="flex gap-1.5">
                            {[...Array(5)].map((_, i) => (
                                <div key={`r5-${i}`} className="h-2 flex-1 rounded-md bg-[#34D399]" />
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 text-xs text-[#878D96] font-medium">
                        25/25 · Ready for a new quiz
                    </div>
                </motion.div>

                {/* Gems Card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="p-6 bg-[#171717] rounded-md border border-white/5 flex flex-col justify-between min-h-[140px]"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[15px] font-medium text-white">Gems</span>
                        <Gem className="w-4 h-4 text-[#FFB340]" fill="#FFB340" />
                    </div>

                    <div>
                        <span className="text-[32px] font-bold text-white leading-none tracking-tight">0</span>
                    </div>

                    <div className="mt-auto text-xs text-[#878D96] font-medium">
                        Exchange for rewards in the shop
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
