'use client';

import { motion } from 'framer-motion';
import { Zap, Gem, Plus } from 'lucide-react';

export default function EnergyGemsRow() {
    return (
        <div className="w-full overflow-x-auto no-scrollbar pl-6 pr-6 py-4">
            <div className="flex items-center gap-4 min-w-max">
                {/* Energy Card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="flex flex-col justify-between w-[200px] h-[120px] p-5 rounded-[24px] bg-[#0D1117] border border-[#161B22] relative group"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#34D399]/10 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-[#34D399]" fill="#34D399" />
                            </div>
                            <span className="text-white font-medium">Energy</span>
                        </div>
                        <button className="w-6 h-6 rounded-full bg-[#161B22] flex items-center justify-center hover:bg-[#34D399]/20 transition-colors">
                            <Plus className="w-3 h-3 text-[#34D399]" />
                        </button>
                    </div>

                    <div className="flex gap-[2px] mt-auto">
                        {[...Array(25)].map((_, i) => (
                            <div
                                key={i}
                                className={`h-6 flex-1 rounded-full ${i < 25 ? 'bg-[#34D399]' : 'bg-[#161B22]'}`}
                                style={{ opacity: i < 25 ? 0.8 : 1 }}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Gems Card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="flex flex-col justify-between w-[200px] h-[120px] p-5 rounded-[24px] bg-[#0D1117] border border-[#161B22] relative group"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#007AFF]/10 flex items-center justify-center">
                                <Gem className="w-4 h-4 text-[#007AFF]" />
                            </div>
                            <span className="text-white font-medium">Gems</span>
                        </div>
                        <button className="w-6 h-6 rounded-full bg-[#161B22] flex items-center justify-center hover:bg-[#007AFF]/20 transition-colors">
                            <Plus className="w-3 h-3 text-[#007AFF]" />
                        </button>
                    </div>

                    <div className="mt-auto">
                        <span className="text-2xl font-semibold text-white">0</span>
                        <span className="text-xs text-[#878D96] ml-2">Available</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
