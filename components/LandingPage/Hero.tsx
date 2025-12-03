"use client";

import { motion } from "framer-motion";
import SharkBackground from "./SharkBackground";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-[#0B0E12]">
            <SharkBackground />

            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full max-w-[1400px]">
                <motion.h1
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
                    className="text-[120px] md:text-[200px] leading-[0.8] font-black tracking-[-0.04em] text-[#E8E9EA] mix-blend-difference select-none"
                    style={{ fontFamily: 'var(--font-display, sans-serif)' }}
                >
                    SHARKS
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.4 }}
                    className="mt-8 text-xl md:text-3xl font-light text-[#E8E9EA]/80 max-w-2xl tracking-wide"
                >
                    How long will you survive the ultimate predator quiz?
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.6 }}
                    className="mt-16"
                >
                    <button className="group relative px-12 py-6 bg-[#FF2D55] text-white text-xl font-bold tracking-wider uppercase overflow-hidden transition-all hover:scale-105 active:scale-95">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
                        <span className="relative flex items-center gap-4">
                            Start Quiz
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </span>
                    </button>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#E8E9EA]/40">Scroll to Dive</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-[#FF2D55] to-transparent" />
            </motion.div>
        </section>
    );
}
