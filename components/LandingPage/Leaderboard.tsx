"use client";

import { motion } from "framer-motion";

const players = [
    { rank: 1, name: "DeepDiver_99", score: "98,450", species: "Great White" },
    { rank: 2, name: "OceanMaster", score: "95,200", species: "Tiger" },
    { rank: 3, name: "SharkBait", score: "92,150", species: "Mako" },
    { rank: 4, name: "AbyssWalker", score: "89,800", species: "Hammerhead" },
    { rank: 5, name: "ReefKing", score: "85,400", species: "Bull" },
];

export default function Leaderboard() {
    return (
        <section className="py-32 px-4 bg-[#0B0E12] relative">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-[#E8E9EA] mb-4">TOP PREDATORS</h2>
                    <p className="text-[#E8E9EA]/60">The ocean's deadliest players this week</p>
                </div>

                <div className="relative bg-[#1C2128]/50 backdrop-blur-md border border-[#E8E9EA]/10 rounded-none p-8">
                    {players.map((player, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center justify-between py-6 border-b border-[#E8E9EA]/5 last:border-0 hover:bg-[#E8E9EA]/5 px-4 transition-colors"
                        >
                            <div className="flex items-center gap-6">
                                <span className={`text-2xl font-black ${i === 0 ? 'text-[#FF2D55]' : 'text-[#E8E9EA]/40'}`}>
                                    #{player.rank}
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-[#E8E9EA]">{player.name}</span>
                                    <span className="text-xs text-[#E8E9EA]/40 uppercase tracking-wider">{player.species}</span>
                                </div>
                            </div>
                            <span className="text-xl font-mono text-[#FF2D55]">{player.score}</span>
                        </motion.div>
                    ))}

                    {/* Glow effect for #1 */}
                    <div className="absolute top-0 left-0 w-full h-24 bg-[#FF2D55]/5 blur-xl pointer-events-none" />
                </div>
            </div>
        </section>
    );
}
