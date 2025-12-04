'use client';

import { motion } from 'framer-motion';
import { Lock, Flame } from 'lucide-react';

interface LevelNodeProps {
    level: number;
    status: 'completed' | 'current' | 'locked';
    position: { x: number; y: number };
}

export default function LevelNode({ level, status, position }: LevelNodeProps) {
    const isCurrent = status === 'current';
    const isCompleted = status === 'completed';
    const isLocked = status === 'locked';

    return (
        <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center"
            style={{ left: `${position.x}%`, top: `${position.y}px` }}
        >
            {/* Current Level Halo & Effects */}
            {isCurrent && (
                <>
                    {/* Outer pulsing glow */}
                    <motion.div
                        className="absolute w-32 h-32 rounded-full bg-blue-500/20 blur-xl"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Thick electric ring */}
                    <motion.div
                        className="absolute w-24 h-24 rounded-full border-4 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                </>
            )}

            {/* Main Node Circle */}
            <motion.div
                className={`
                    relative flex items-center justify-center rounded-full shadow-lg transition-all duration-300
                    ${isCurrent ? 'w-20 h-20 bg-blue-600 text-white z-30' : ''}
                    ${isCompleted ? 'w-10 h-10 bg-blue-900/80 border border-blue-500/50 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]' : ''}
                    ${isLocked ? 'w-8 h-8 bg-zinc-900 border border-zinc-800 text-zinc-600' : ''}
                `}
                whileHover={{ scale: isCurrent ? 1.1 : 1.2 }}
                animate={isCurrent ? { scale: [1, 1.06, 1] } : {}}
                transition={isCurrent ? { duration: 6, repeat: Infinity, ease: "easeInOut" } : {}}
            >
                {isLocked ? (
                    <Lock className="w-3 h-3" />
                ) : (
                    <span className={`font-bold ${isCurrent ? 'text-3xl font-display' : 'text-sm'}`}>
                        {level}
                    </span>
                )}

                {/* Completed subtle halo */}
                {isCompleted && (
                    <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-md -z-10" />
                )}
            </motion.div>

            {/* Flame for Current Level */}
            {isCurrent && (
                <motion.div
                    className="absolute -bottom-8 text-amber-500 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                    animate={{ opacity: [0.8, 1, 0.8], scale: [0.9, 1.1, 0.9], y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <Flame className="w-6 h-6 fill-amber-500" />
                </motion.div>
            )}

            {/* Level Number Label for non-current nodes (optional, if needed for clarity) */}
            {/* {isLocked && <div className="absolute -bottom-5 text-[10px] text-zinc-600 font-mono">{level}</div>} */}
        </div>
    );
}
