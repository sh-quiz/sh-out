'use client';

import { motion } from 'framer-motion';

interface Props {
    climb: number;
    rank: number;
}

export default function RankReveal({ climb, rank }: Props) {
    return (
        <div className="flex flex-col items-center justify-center mb-12 sm:mb-14 lg:mb-16 relative">
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-zinc-400 text-xs sm:text-sm font-medium mb-3 sm:mb-4 px-4 text-center"
            >
                You just climbed <span className="text-white font-bold">{climb} places!</span>
            </motion.p>

            <div className="relative">
                {/* Crackling Border Effect */}
                <motion.div
                    className="absolute -inset-3 sm:-inset-4 rounded-xl opacity-50"
                    style={{
                        background: 'conic-gradient(from 0deg, transparent 0deg, #007AFF 90deg, transparent 180deg)',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    aria-hidden="true"
                />
                <motion.div
                    className="absolute -inset-3 sm:-inset-4 rounded-xl opacity-50"
                    style={{
                        background: 'conic-gradient(from 180deg, transparent 0deg, #007AFF 90deg, transparent 180deg)',
                    }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    aria-hidden="true"
                />

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: 0.4
                    }}
                    className="relative z-10 bg-black/80 backdrop-blur-md px-6 sm:px-8 py-3 sm:py-4 rounded-lg border border-blue-500/30"
                    role="status"
                    aria-label={`New global rank: ${rank}`}
                >
                    <p className="text-center text-blue-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-0.5 sm:mb-1">
                        New Global Rank
                    </p>
                    <h3
                        className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter"
                        style={{ textShadow: '0 0 30px rgba(0, 122, 255, 0.6)' }}
                    >
                        #{rank}
                    </h3>
                </motion.div>
            </div>
        </div>
    );
}
