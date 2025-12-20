'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Diamond, Battery, Award, Shield } from 'lucide-react';

interface Props {
    type: 'gems' | 'energy' | 'badge' | 'shield';
    value: string;
    delay?: number;
}

export default function RewardCard({ type, value, delay = 0 }: Props) {
    const getIcon = () => {
        switch (type) {
            case 'gems': return <Diamond className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-amber-400 fill-amber-400/20" />;
            case 'energy': return <Battery className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-400 fill-green-400/20" />;
            case 'badge': return <Award className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-400 fill-purple-400/20" />;
            case 'shield': return <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-yellow-500 fill-yellow-500/20" />;
        }
    };

    const getLabel = () => {
        switch (type) {
            case 'gems': return 'Gems';
            case 'energy': return 'Energy Bars';
            case 'badge': return 'Scholar';
            case 'shield': return 'Protected';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
                duration: 0.6,
                delay,
                type: "spring",
                stiffness: 200,
                damping: 15
            }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="
                min-w-[120px] sm:min-w-[140px] md:min-w-[160px]
                h-[110px] sm:h-[130px] md:h-[140px]
                rounded-xl sm:rounded-2xl p-4 sm:p-4 md:p-5
                flex flex-col items-center justify-center text-center gap-2 sm:gap-3
                backdrop-blur-[32px] border border-zinc-800/60
                transition-all duration-300
                focus-within:ring-2 focus-within:ring-blue-500/50
            "
            role="article"
            aria-label={`Reward: ${value}`}
            tabIndex={0}
        >
            <div className="p-2 sm:p-2.5 md:p-3 rounded-full bg-zinc-900/50 border border-zinc-800">
                {getIcon()}
            </div>
            <span className="text-white font-bold text-xs sm:text-sm">{value}</span>
        </motion.div>
    );
}
