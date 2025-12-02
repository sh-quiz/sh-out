"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Crown } from "lucide-react";

const players = [
    {
        rank: 1,
        name: "Alex_99",
        score: "12,450 XP",
        avatar: "👑",
        color: "bg-yellow-500",
    },
    {
        rank: 2,
        name: "Sarah_Quiz",
        score: "11,200 XP",
        avatar: "🥈",
        color: "bg-gray-300",
    },
    {
        rank: 3,
        name: "Mike_Pro",
        score: "10,850 XP",
        avatar: "🥉",
        color: "bg-orange-400",
    },
];

export default function LeaderboardPreview() {
    return (
        <section className="py-20 bg-sharks-navy relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-sharks-blue/20 to-transparent rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl lg:text-5xl font-bold text-sharks-white"
                    >
                        Rise to the Top
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-sharks-rose/80 max-w-2xl mx-auto"
                    >
                        Compete in daily tournaments and see your name on the global leaderboard.
                        Earn XP, unlock achievements, and become a legend.
                    </motion.p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <div className="bg-sharks-white/5 backdrop-blur-xl rounded-3xl border border-sharks-white/10 overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-sharks-white/10 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-sharks-white flex items-center gap-2">
                                <Trophy className="w-6 h-6 text-yellow-500" /> Global Rankings
                            </h3>
                            <span className="text-sm text-sharks-blue bg-sharks-blue/10 px-3 py-1 rounded-full">
                                Season 4
                            </span>
                        </div>

                        <div className="p-6 space-y-4">
                            {players.map((player, index) => (
                                <motion.div
                                    key={player.rank}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-sharks-white/5 hover:bg-sharks-white/10 transition-colors border border-transparent hover:border-sharks-white/10 group"
                                >
                                    <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-full ${index === 0 ? "bg-yellow-500/20 text-yellow-500" :
                                            index === 1 ? "bg-gray-300/20 text-gray-300" :
                                                "bg-orange-400/20 text-orange-400"
                                        }`}>
                                        {player.rank}
                                    </div>

                                    <div className="w-12 h-12 rounded-full bg-sharks-navy flex items-center justify-center text-2xl border-2 border-sharks-white/10 group-hover:border-sharks-blue transition-colors">
                                        {player.avatar}
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="font-bold text-sharks-white group-hover:text-sharks-blue transition-colors">
                                            {player.name}
                                        </h4>
                                        <div className="w-full bg-sharks-navy/50 h-1.5 rounded-full mt-2 overflow-hidden">
                                            <div
                                                className="h-full bg-sharks-blue rounded-full"
                                                style={{ width: `${100 - (index * 15)}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-bold text-sharks-white">{player.score}</p>
                                        <p className="text-xs text-sharks-rose/60">Top 1%</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
