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
            case 'gems': return <Diamond className="w-8 h-8 text-amber-400 fill-amber-400/20" />;
            case 'energy': return <Battery className="w-8 h-8 text-green-400 fill-green-400/20" />;
            case 'badge': return <Award className="w-8 h-8 text-purple-400 fill-purple-400/20" />;
            case 'shield': return <Shield className="w-8 h-8 text-yellow-500 fill-yellow-500/20" />;
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
                min-w-[160px] h-[140px] rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3
                bg-[#161B22]/90 backdrop-blur-[32px] border border-zinc-800/60
                shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]
                transition-all duration-300
            "
        >
            <div className="p-3 rounded-full bg-zinc-900/50 border border-zinc-800">
                {getIcon()}
            </div>
            <span className="text-white font-bold text-sm">{value}</span>
        </motion.div>
    );
}
