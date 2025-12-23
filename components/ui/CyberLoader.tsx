'use client';

import { motion } from 'framer-motion';

interface CyberLoaderProps {
    text?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function CyberLoader({ text = 'INITIALIZING SYSTEM...', size = 'md' }: CyberLoaderProps) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-16 h-16',
        lg: 'w-24 h-24'
    };

    return (
        <div className="flex flex-col items-center justify-center gap-6">
            <div className={`relative ${sizeClasses[size]}`}>
                {/* Outer Ring */}
                <motion.div
                    className="absolute inset-0 border-2 border-blitz-yellow/20 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                {/* Scanning Arc */}
                <motion.div
                    className="absolute inset-0 border-t-2 border-blitz-yellow rounded-full shadow-[0_0_15px_#FFD700]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner Hexagon/Pulse */}
                <motion.div
                    className="absolute inset-4 bg-voltage-blue/10 border border-voltage-blue/30 rounded-lg flex items-center justify-center"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div className="w-1/2 h-1/2 bg-voltage-blue shadow-[0_0_10px_#00F2FF]" />
                </motion.div>
            </div>

            {text && (
                <div className="flex flex-col items-center gap-1">
                    <motion.span
                        className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-blitz-yellow"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    >
                        {text}
                    </motion.span>
                    <div className="w-32 h-[1px] bg-white/10 relative overflow-hidden">
                        <motion.div
                            className="absolute inset-0 bg-blitz-yellow"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
