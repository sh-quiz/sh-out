'use client';

import { motion } from 'framer-motion';

interface CyberLoaderProps {
    text?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function CyberLoader({ text = 'INITIALIZING SYSTEM...', size = 'md' }: CyberLoaderProps) {
    const sizeClasses = {
        sm: 'w-12 h-12',
        md: 'w-24 h-24',
        lg: 'w-32 h-32'
    };

    return (
        <div className="flex flex-col items-center justify-center gap-8">
            <div className={`relative ${sizeClasses[size]}`}>
                {/* Outer Glitch Ring */}
                <motion.div
                    className="absolute inset-0 border-t-2 border-l-2 border-blitz-yellow rounded-full"
                    animate={{
                        rotate: 360,
                        opacity: [1, 0.4, 1, 0.8, 1],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{
                        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                        opacity: { duration: 0.2, repeat: Infinity },
                        scale: { duration: 1, repeat: Infinity }
                    }}
                />

                {/* Inner Counter-Rotating Ring */}
                <motion.div
                    className="absolute inset-2 border-b-2 border-r-2 border-voltage-blue rounded-full opacity-40"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                {/* Center Core */}
                <motion.div
                    className="absolute inset-6 bg-white flex items-center justify-center"
                    animate={{
                        scale: [1, 1.2, 0.9, 1.1, 1],
                        rotate: [0, 45, 90, 135, 180],
                        backgroundColor: ['#FFD700', '#00F2FF', '#FFFFFF', '#FFD700']
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        times: [0, 0.3, 0.5, 0.8, 1]
                    }}
                >
                    <div className="w-2/3 h-2/3 bg-black" />
                </motion.div>

                {/* Data Streams */}
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-8 bg-blitz-yellow/30"
                        style={{
                            left: '50%',
                            top: '50%',
                            marginLeft: '-0.125rem',
                            transformOrigin: '0 40px'
                        }}
                        animate={{
                            rotate: i * 90 + 360,
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2
                        }}
                    />
                ))}
            </div>

            {text && (
                <div className="flex flex-col items-center gap-2">
                    <motion.div
                        className="relative"
                        animate={{ x: [-1, 1, -1] }}
                        transition={{ duration: 0.1, repeat: Infinity }}
                    >
                        <span className="text-xs font-black font-orbitron tracking-[0.4em] uppercase text-white drop-shadow-[0_0_8px_white]">
                            {text}
                        </span>
                        <div className="absolute -inset-1 border border-white/10" />
                    </motion.div>

                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-4 h-1 bg-blitz-yellow"
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

