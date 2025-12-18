'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Zap } from 'lucide-react';

interface Props {
    title: string;
    value: string | number;
    subValue?: string;
    type?: 'default' | 'correct' | 'wrong' | 'accuracy' | 'speed';
    delay?: number;
    accuracy?: number;
    className?: string;
}

export default function StatCard({ title, value, subValue, type = 'default', delay = 0, accuracy = 0, className = '' }: Props) {
    const getGlowColor = () => {
        switch (type) {
            case 'correct': return 'shadow-[0_0_20px_rgba(74,222,128,0.1)] hover:shadow-[0_0_30px_rgba(74,222,128,0.2)] border-green-500/20';
            case 'wrong': return 'shadow-[0_0_20px_rgba(248,113,113,0.1)] hover:shadow-[0_0_30px_rgba(248,113,113,0.2)] border-red-500/20';
            case 'accuracy': return 'shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] border-blue-500/20';
            case 'speed': return 'shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] border-zinc-700/50';
            default: return 'shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] border-zinc-700/50';
        }
    };

    const getValueColor = () => {
        switch (type) {
            case 'correct': return 'text-green-400';
            case 'wrong': return 'text-white';
            case 'accuracy': return 'text-blue-500';
            case 'speed': return 'text-white';
            default: return 'text-white';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={`
                relative overflow-hidden rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 flex flex-col items-center justify-center text-center
                 backdrop-blur-[32px] border transition-all duration-300
                ${getGlowColor()}
                h-[110px] sm:h-[130px] md:h-[140px] w-full
                focus-within:ring-2 focus-within:ring-blue-500/50
                ${className}
            `}
            role="article"
            aria-label={`${title}: ${value}`}
            tabIndex={0}
        >
            <span className="text-zinc-400 text-[10px] sm:text-xs font-medium mb-1.5 sm:mb-2 uppercase tracking-wide">
                {title}
            </span>

            {type === 'accuracy' ? (
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#1f2937"
                            strokeWidth="3"
                        />
                        <motion.path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                            strokeDasharray="100, 100"
                            initial={{ strokeDashoffset: 100 }}
                            animate={{ strokeDashoffset: 100 - accuracy }}
                            transition={{ duration: 1.5, delay: delay + 0.5, ease: "circOut" }}
                        />
                    </svg>
                    <span className="absolute text-xs sm:text-sm font-bold text-blue-500">
                        {accuracy}%
                    </span>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <span className={`text-2xl sm:text-2xl md:text-3xl font-bold ${getValueColor()}`}>
                        {value}
                    </span>
                    {subValue && (
                        <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                            {type === 'speed' && <Zap className="w-3 h-3 text-blue-500 fill-blue-500" aria-hidden="true" />}
                            <span className="text-zinc-400 text-xs sm:text-sm font-medium">{subValue}</span>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}
