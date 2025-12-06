"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import GrainOverlay from "@/components/ui/GrainOverlay";
import CustomCursor from "./components/CustomCursor";

export default function CategoriesPage() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <main className="min-h-screen w-full bg-[#000000] text-[#F0F2F5] selection:bg-[#007AFF] selection:text-white overflow-hidden font-sans">
            <GrainOverlay />
            <CustomCursor />
            {/* HEADER */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between pl-72 pr-6 py-6 md:pr-12">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                    Choose Your Battlefield, Benedict.
                </h1>

                <div className="flex items-center gap-2">
                    <div className="text-[#FF4433] animate-pulse">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M12 2C10 2 8 4 8 6C8 8 10 10 12 10C14 10 16 8 16 6C16 4 14 2 12 2ZM12 22C7 22 3 17 3 12C3 7 7 3 12 3C17 3 21 7 21 12C21 17 17 22 12 22Z" opacity="0.2" />
                            <path d="M12 22C14.5 22 17 20 18 18C18 16 16 14 14 14C12 14 10 16 10 18C10 20 12.5 22 12 22Z" />
                            <path d="M12 14C11 14 10 13 10 12C10 11 11 10 12 10C13 10 14 11 14 12C14 13 13 14 12 14Z" />
                            <path d="M12 2C12 2 8 7 8 12C8 16 10 19 12 19C14 19 16 16 16 12C16 7 12 2 12 2Z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-white">12</span>
                </div>
            </header>

            <div className="flex flex-col h-screen w-full">
                {/* ONLINE MATCH SECTION */}
                <section className="relative flex-1 group overflow-hidden border-b border-white/10">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/assets/online_match_bg.png"
                            alt="Online Match Background"
                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                        <div className="absolute inset-0 bg-red-900/10 mix-blend-overlay" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12">
                        <div className="flex items-end justify-between w-full max-w-7xl mx-auto">
                            <div>
                                <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-2 uppercase drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">
                                    Online <span className="text-white">Match</span>
                                </h2>
                                <p className="text-gray-300 text-lg md:text-xl font-medium tracking-wide drop-shadow-md">
                                    12,847 warriors online • 7 battles active
                                </p>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-[#FF3B30] hover:bg-[#ff554d] text-white font-bold tracking-wider uppercase rounded-lg shadow-[0_0_30px_rgba(255,59,48,0.4)] transition-all duration-300"
                            >
                                Enter Battle
                            </motion.button>
                        </div>
                    </div>

                    {/* Laser Beams */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-1/4 w-0.5 h-full bg-red-500/40 blur-sm transform -skew-x-12" />
                        <div className="absolute top-0 right-1/4 w-0.5 h-full bg-red-500/40 blur-sm transform skew-x-12" />
                    </div>
                </section>

                {/* ARCADE MODE SECTION */}
                <section className="relative flex-1 group overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/assets/arcade_mode_bg.png"
                            alt="Online Match Background"
                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                        <div className="absolute inset-0 bg-red-900/10 mix-blend-overlay" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-end pb-12 px-6 md:px-12">
                        <div className="w-full max-w-7xl mx-auto">

                            <div className="flex items-end justify-between mb-12">
                                <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase drop-shadow-[0_0_15px_rgba(255,165,0,0.5)]">
                                    Arcade Mode
                                </h2>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 py-4 bg-[#FFB340] hover:bg-[#ffc163] text-black font-black tracking-wider uppercase rounded-lg shadow-[0_0_30px_rgba(255,179,64,0.4)] transition-all duration-300"
                                >
                                    Deploy
                                </motion.button>
                            </div>

                            {/* Bottom Bar */}
                            <div className="flex flex-col md:flex-row items-center justify-end gap-8">
                                {/* Stats Bar */}

                                {/* Stats Bar */}
                                <div className="flex items-center bg-black/40 backdrop-blur-md rounded-xl border border-white/10 px-6 py-3 gap-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" /></svg>
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Energy</div>
                                            <div className="text-white font-bold">100/100</div>
                                        </div>
                                    </div>
                                    <div className="w-px h-8 bg-white/10" />
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2L2 12H7V22H17V12H22L12 2Z" /></svg>
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Gems</div>
                                            <div className="text-white font-bold">2,480</div>
                                        </div>
                                    </div>
                                    <div className="w-px h-8 bg-white/10" />
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" /></svg>
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Rank</div>
                                            <div className="text-white font-bold">Diamond III</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
