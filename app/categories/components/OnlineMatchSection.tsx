"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export const OnlineMatchSection = () => {
    return (
        <section className="relative flex-1 group overflow-hidden border-b border-white/5 min-h-[60vh] md:min-h-0">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 scale-105 group-hover:scale-100 transition-transform duration-[1.5s] ease-out">
                <img
                    src="/assets/online_match_bg.png"
                    alt="Online Match Background"
                    className="w-full h-full object-cover opacity-50"
                />
            </div>

            {/* Tech Details / Laser Beams Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,59,48,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,59,48,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

                {/* Scanning Line */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF3B30]/50 to-transparent animate-scan" />
            </div>


            {/* Content */}
            <div className="relative z-10 h-full flex flex-col px-4 sm:px-6 md:px-8 md:pl-72 md:pr-8 py-12 md:py-20">
                {/* Text Content at Top */}
                <div className="flex flex-col items-start text-left space-y-4 mb-8 max-w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-2.5 md:px-3 py-1 bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded text-[#FF3B30] text-[10px] md:text-xs font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-pulse" />
                        Live Combat
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl font-black tracking-[-0.04em] text-white uppercase leading-[0.9] italic"
                    >
                        Online <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">Match</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-gray-400 text-xs sm:text-sm md:text-base font-mono tracking-wider md:tracking-widest uppercase opacity-80 pt-2 truncate max-w-full"
                    >
                        <span className="hidden sm:inline text-[#FF3B30]">// </span>12,847 Warriors <span className="text-[#FF3B30] mx-1 md:mx-2">•</span> <span className="hidden sm:inline">7 Battles Active</span><span className="sm:hidden">Live</span>
                    </motion.p>
                </div>

                {/* Button Centered Vertically & Horizontally in remaining space */}
                <div className="flex-1 flex items-center justify-center md:justify-start">
                    <div className="relative group/btn w-full sm:w-auto min-w-[280px] max-w-md">
                        <Link href="/quizzes">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative flex items-center justify-center -skew-x-[18deg] px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 bg-[#FF3B30] hover:bg-[#ff4f44] text-white transition-all duration-300 border-l border-t border-white/20 shadow-[0_0_20px_rgba(255,59,48,0.3)] w-full min-h-[56px] overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shine" />
                                <div className="skew-x-[18deg] flex items-center gap-2 sm:gap-3">
                                    <span className="text-base sm:text-lg font-black tracking-wider sm:tracking-widest uppercase">Enter Battle</span>
                                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 rotate-180 transition-transform group-hover/btn:translate-x-1" />
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
