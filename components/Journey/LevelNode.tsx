'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Brain, Shield, Lock } from 'lucide-react';

interface LevelNodeProps {
    title: string;
    level: number;
    status: 'completed' | 'current' | 'locked' | 'unlocked';
    position: { x: number; y: number };
    onStart?: () => void;
}

export default function LevelNode({ title, level, status, position, onStart }: LevelNodeProps) {
    const isCurrent = status === 'current';
    const isCompleted = status === 'completed';
    const isLocked = status === 'locked';

    const [showTooltip, setShowTooltip] = useState(false);

    // Variation of icons matching the image (Lightning, Brain, Shield)
    const Icon = level % 3 === 1 ? Zap : level % 3 === 2 ? Brain : Shield;

    // Colors based on status
    const primaryColor = isCurrent ? '#FFD700' : isCompleted ? '#00A3FF' : '#2D3436';
    const glowColor = isCurrent ? 'rgba(255, 215, 0, 0.5)' : isCompleted ? 'rgba(0, 163, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)';

    return (
        <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center justify-center cursor-pointer group"
            style={{ left: `${position.x}%`, top: `${position.y}px` }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => {
                setShowTooltip(!showTooltip);
                if (!isLocked) onStart?.();
            }}
        >
            {/* Light Beam / Aura (Vertical) */}
            <AnimatePresence>
                {(isCurrent || isCompleted) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 160 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="absolute bottom-[20px] w-20 pointer-events-none z-0"
                        style={{
                            background: `linear-gradient(to top, ${glowColor}, transparent)`,
                            clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                            filter: 'blur(8px)',
                        }}
                    >
                        {isCurrent && (
                            <motion.div
                                className="absolute inset-x-0 bottom-0 h-full bg-white/20"
                                animate={{ opacity: [0.2, 0.5, 0.2] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Isometric Hexagon Platform */}
            <div className="relative w-24 h-24 mb-4 transition-transform duration-300 group-hover:scale-110">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]">
                    {/* Shadow/Base Wall */}
                    <path
                        d="M50 85 L85 67 L85 45 L50 63 L15 45 L15 67 Z"
                        fill="#1A1F26"
                        opacity="0.8"
                    />
                    {/* Main Hex Body (Sides) */}
                    <path
                        d="M50 80 L85 62 L85 35 L50 53 L15 35 L15 62 Z"
                        fill={isLocked ? '#222' : '#2D3436'}
                        stroke={primaryColor}
                        strokeWidth="1"
                        opacity="0.9"
                    />
                    {/* Top Surface */}
                    <path
                        d="M50 53 L85 35 L50 17 L15 35 Z"
                        fill={isCurrent ? '#FFD700' : isCompleted ? '#007AFF' : '#161B22'}
                        stroke={primaryColor}
                        strokeWidth="2"
                    />
                    {/* Inner Surface Glow */}
                    {(isCurrent || isCompleted) && (
                        <path
                            d="M50 48 L78 35 L50 22 L22 35 Z"
                            fill="white"
                            opacity="0.2"
                            className="animate-pulse"
                        />
                    )}
                </svg>

                {/* Center Content (Icon) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-2">
                    {isLocked ? (
                        <Lock className="w-5 h-5 text-white/20" />
                    ) : (
                        <motion.div
                            animate={isCurrent ? {
                                y: [-2, 2, -2],
                                filter: [`drop-shadow(0 0 5px ${primaryColor})`, `drop-shadow(0 0 15px ${primaryColor})`, `drop-shadow(0 0 5px ${primaryColor})`]
                            } : {}}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Icon
                                className="w-8 h-8"
                                color={isCurrent || isCompleted ? 'white' : 'rgba(255,255,255,0.4)'}
                                fill={isCurrent || isCompleted ? 'currentColor' : 'none'}
                            />
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Level Badge (Floating underneath) */}
            <div className={`
                px-3 py-1 rounded-sm border skew-x-[-15deg] font-mono font-black text-[10px] tracking-tighter transition-all duration-300
                ${isCurrent ? 'bg-blitz-yellow text-black border-white' : 'bg-black/80 text-white/40 border-white/10 group-hover:border-white/30'}
            `}>
                NODE_{level.toString().padStart(2, '0')}
            </div>

            {/* Tooltip */}
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                        className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase font-black px-4 py-2 rounded-none shadow-[0_0_20px_rgba(0,0,0,0.5)] z-50 pointer-events-none italic"
                    >
                        <div className="flex flex-col items-center">
                            <span className="text-white/40 text-[8px] mb-1">ACCESSING_PROTOCOL</span>
                            {title}
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white/80" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
