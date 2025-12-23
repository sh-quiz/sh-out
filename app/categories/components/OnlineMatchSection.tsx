"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export const OnlineMatchSection = () => {
    return (
        <section className="relative flex-1 group overflow-hidden border border-white/5 bg-carbon-grey/40 min-h-[50vh] md:min-h-0 cyber-border">
            <div className="absolute inset-0 z-0 scale-105 group-hover:scale-100 transition-transform duration-[1.5s] ease-out">
                <div className="w-full h-full bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: 'url("/brain/63bbd1f4-5752-4464-8755-2789be25175c/cyberpunk_single_player_bg_1766525805914.png")' }} />
                <div className="absolute inset-0 bg-linear-to-t from-[#0B0E14] via-transparent to-transparent opacity-60" />
            </div>


            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent animate-scan" />
            </div>



            <div className="relative z-10 h-full flex flex-col px-4 sm:px-6 md:px-8 py-12 md:py-16">

                <div className="flex flex-col items-start text-left space-y-4 mb-8 max-w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-2.5 md:px-3 py-1 bg-danger-red/10 border border-danger-red/20 rounded text-danger-red text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-danger-red animate-pulse" />
                        Live Combat
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.04em] text-white uppercase leading-[0.9] italic font-orbitron"
                    >
                        Single <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-voltage-blue via-voltage-blue/50 to-voltage-blue/10">Player</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-white/40 text-xs sm:text-sm font-mono tracking-widest uppercase pt-2 truncate max-w-full"
                    >
                        // 12,847 Warriors <span className="text-white mx-2 animate-pulse">•</span> 7 Battles Active
                    </motion.p>
                </div>


                <div className="flex-1 flex items-center justify-center md:justify-start">
                    <div className="relative group/btn w-full sm:w-auto min-w-[280px]">
                        <Link href="/quizzes">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative flex items-center justify-center px-8 py-5 bg-voltage-blue text-black transition-all duration-300 border border-voltage-blue/20 shadow-[0_0_20px_rgba(0,242,255,0.2)] w-full overflow-hidden group/inner"
                            >
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover/inner:animate-shine" />
                                <div className="flex items-center gap-3 relative z-10">
                                    <span className="text-sm font-black tracking-[0.2em] uppercase">Enter Battle</span>
                                    <ArrowLeft className="w-4 h-4 rotate-180 transition-transform group-hover/inner:translate-x-1" />
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                </div>
            </div>
        </section >
    );
};
