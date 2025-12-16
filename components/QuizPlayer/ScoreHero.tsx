'use client';

import { motion, useSpring, useTransform, useMotionValue, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';

interface Props {
    score: number;
    total: number;
    streak: number;
}

export default function ScoreHero({ score, total, streak }: Props) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const [displayScore, setDisplayScore] = useState(0);

    useEffect(() => {
        const controls = animate(count, score, { duration: 2, ease: "easeOut" });
        return controls.stop;
    }, [score]);

    useEffect(() => {
        const unsubscribe = rounded.on("change", (latest) => {
            setDisplayScore(latest);
        });
        return unsubscribe;
    }, [rounded]);

    return (
        <div className="flex flex-col items-center justify-center relative z-10 mb-8 sm:mb-10 lg:mb-12">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-zinc-500 text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-3 sm:mb-4 text-center px-4"
            >
                Final Quiz Completion Scoreboard
            </motion.h2>

            <div className="relative flex flex-col md:flex-row items-center justify-center w-full">
                {/* Main Score */}
                <div className="flex items-baseline gap-2 sm:gap-3 md:gap-4">
                    <motion.div
                        className="text-[4rem] xs:text-[5rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] font-black leading-none tracking-tighter text-[#007AFF]"
                        style={{
                            textShadow: '0 0 40px rgba(0, 122, 255, 0.5), 0 0 80px rgba(0, 122, 255, 0.3)'
                        }}
                        aria-label={`Score: ${displayScore} out of ${total}`}
                    >
                        {displayScore}
                    </motion.div>
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-zinc-700"
                        aria-hidden="true"
                    >
                        / {total}
                    </motion.span>
                </div>

                {/* Flame & Streak - Hidden on mobile, shown on medium+ screens */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ delay: 1.5, type: "spring" }}
                    className="hidden md:flex md:absolute md:-right-24 md:top-1/2 md:-translate-y-1/2 flex-col items-center mt-4 md:mt-0"
                    aria-label={`${streak} day streak`}
                >
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            filter: [
                                'drop-shadow(0 0 10px rgba(255, 165, 0, 0.5))',
                                'drop-shadow(0 0 20px rgba(255, 165, 0, 0.8))',
                                'drop-shadow(0 0 10px rgba(255, 165, 0, 0.5))'
                            ]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Flame className="w-10 h-10 md:w-12 md:h-12 text-amber-500 fill-amber-500" aria-hidden="true" />
                    </motion.div>
                    <span className="text-amber-500 font-bold text-xs md:text-sm mt-1">+{streak} Streak</span>
                </motion.div>
            </div>

            {/* Mobile Streak Indicator */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, type: "spring" }}
                className="md:hidden flex items-center gap-2 mt-4"
                aria-label={`${streak} day streak`}
            >
                <Flame className="w-6 h-6 text-amber-500 fill-amber-500" aria-hidden="true" />
                <span className="text-amber-500 font-bold text-sm">+{streak} Day Streak</span>
            </motion.div>

            {/* Outstanding Text */}
            <motion.div
                className="mt-4 sm:mt-6 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <div className="flex gap-0.5 sm:gap-1">
                    {"OUTSTANDING!".split("").map((char, i) => (
                        <motion.span
                            key={i}
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                delay: 2 + (i * 0.05),
                                type: "spring",
                                stiffness: 200,
                                damping: 10
                            }}
                            className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-black tracking-widest text-[#007AFF]"
                            style={{
                                textShadow: '0 0 20px rgba(0, 122, 255, 0.6)'
                            }}
                            aria-hidden="true"
                        >
                            {char}
                        </motion.span>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
