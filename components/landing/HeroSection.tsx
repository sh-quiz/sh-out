"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-sharks-navy text-sharks-white flex items-center justify-center pt-20">
            {/* Background Abstract Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-sharks-blue/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-sharks-red/20 rounded-full blur-[100px]" />
                <svg
                    className="absolute top-0 left-0 w-full h-full opacity-10"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0 50 Q 25 25, 50 50 T 100 50"
                        stroke="white"
                        strokeWidth="0.5"
                        fill="none"
                    />
                    <path
                        d="M0 60 Q 25 35, 50 60 T 100 60"
                        stroke="white"
                        strokeWidth="0.5"
                        fill="none"
                    />
                </svg>
            </div>

            <div className="container mx-auto px-4 z-10 grid lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-8 text-center lg:text-left"
                >
                    <div className="inline-block px-4 py-2 rounded-full bg-sharks-blue/10 border border-sharks-blue/20 text-sharks-blue text-sm font-semibold tracking-wider uppercase">
                        The #1 Competitive Quiz App
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                        Challenge Your Mind. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sharks-red to-sharks-blue">
                            Earn Your Crown.
                        </span>
                    </h1>
                    <p className="text-xl text-sharks-rose/80 max-w-2xl mx-auto lg:mx-0">
                        Compete with the smartest players worldwide. Rise on the leaderboard,
                        earn rewards, and prove your knowledge in real-time battles.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <button className="px-8 py-4 bg-sharks-red hover:bg-red-600 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-sharks-red/25 flex items-center justify-center gap-2">
                            Start Quiz <ArrowRight className="w-5 h-5" />
                        </button>
                        <button className="px-8 py-4 bg-sharks-white/10 hover:bg-sharks-white/20 text-white rounded-xl font-bold text-lg transition-all backdrop-blur-sm flex items-center justify-center gap-2">
                            Join Community <Users className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 opacity-80">
                        <div>
                            <p className="text-3xl font-bold text-sharks-blue">10K+</p>
                            <p className="text-sm text-sharks-rose/60">Active Players</p>
                        </div>
                        <div className="w-px h-12 bg-sharks-white/10" />
                        <div>
                            <p className="text-3xl font-bold text-sharks-red">500+</p>
                            <p className="text-sm text-sharks-rose/60">Daily Quizzes</p>
                        </div>
                    </div>
                </motion.div>

                {/* Hero Image / Graphic Placeholder */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="relative hidden lg:block"
                >
                    <div className="relative w-full aspect-square max-w-lg mx-auto">
                        {/* Abstract decorative circle */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-sharks-blue to-sharks-red rounded-full opacity-20 blur-3xl animate-pulse" />

                        {/* Placeholder for Hero Image */}
                        <div className="relative z-10 w-full h-full bg-sharks-white/5 backdrop-blur-md rounded-3xl border border-sharks-white/10 p-6 flex items-center justify-center overflow-hidden">
                            <div className="text-center space-y-4">
                                <div className="w-32 h-32 mx-auto bg-sharks-red rounded-full flex items-center justify-center text-4xl shadow-xl shadow-sharks-red/40">
                                    🦈
                                </div>
                                <h3 className="text-2xl font-bold">The Sharks</h3>
                                <p className="text-sharks-rose/60">Level 99 • Grandmaster</p>

                                {/* Mock Energy Bar */}
                                <div className="w-48 h-3 bg-sharks-rose/20 rounded-full mx-auto overflow-hidden">
                                    <div className="h-full w-[80%] bg-sharks-blue rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-10 -right-10 bg-sharks-navy p-4 rounded-2xl border border-sharks-white/10 shadow-xl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">👑</div>
                                <div>
                                    <p className="text-xs text-sharks-rose/60">Current Leader</p>
                                    <p className="font-bold">Alex_99</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-5 -left-5 bg-sharks-navy p-4 rounded-2xl border border-sharks-white/10 shadow-xl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-sharks-blue rounded-full flex items-center justify-center text-white">⚡</div>
                                <div>
                                    <p className="text-xs text-sharks-rose/60">Win Streak</p>
                                    <p className="font-bold">12 Games</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
