"use client";

import { useEffect, useState, useMemo } from "react";
import Lenis from "lenis";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import GrainOverlay from "@/components/ui/GrainOverlay";
import CustomCursor from "./components/CustomCursor";
import { useEnergy, useDiamonds } from "@/hooks/useEconomy";
import { useGamemode } from "@/hooks/useGamemode";
import QuizPlayer from "@/components/QuizPlayer/QuizPlayer";

import { quizService, AttemptResponse } from "@/lib/quiz";

export default function CategoriesPage() {
    const { data: energyData } = useEnergy();
    const { data: diamondsData } = useDiamonds();
    const { createGame, joinGame, gameState, isConnected, submitScore, finishGame, resetGame } = useGamemode();
    const [joinInput, setJoinInput] = useState("");
    const [currentAttempt, setCurrentAttempt] = useState<AttemptResponse | null>(null);

    // Persist player ID so refreshing doesn't lose identity in demo
    const myPlayerId = useMemo(() => {
        if (typeof window !== 'undefined') {
            let id = localStorage.getItem('playerId');
            if (!id) {
                id = Math.random().toString(36).substring(7);
                localStorage.setItem('playerId', id);
            }
            return id;
        }
        return "player_" + Math.random().toString(36).substring(7);
    }, []);

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

    // Start attempt when game starts
    useEffect(() => {
        const startMultiplayerAttempt = async () => {
            if (gameState.status === 'playing' && gameState.quizId && !currentAttempt) {
                try {
                    console.log("Starting multiplayer attempt for quiz:", gameState.quizId);
                    const attempt = await quizService.startAttempt(gameState.quizId);
                    setCurrentAttempt(attempt);
                } catch (error) {
                    console.error("Failed to start multiplayer attempt:", error);
                }
            }
        };

        startMultiplayerAttempt();
    }, [gameState.status, gameState.quizId, currentAttempt]);

    // Auto-join if we created game and haven't joined yet? 
    // Simplified: User must click Join for now to keep it robust in demo.

    if (gameState.status === 'playing') {
        if (!currentAttempt) {
            return (
                <main className="min-h-screen w-full bg-[#050505] text-[#F0F2F5] font-sans flex items-center justify-center">
                    <div className="animate-pulse text-blue-500 font-mono">INITIALIZING BATTLE...</div>
                </main>
            );
        }

        console.log("Playing with quizId:", gameState.quizId);
        return (
            <main className="min-h-screen w-full bg-[#050505] text-[#F0F2F5] font-sans">
                <QuizPlayer
                    quizId={gameState.quizId || 1}
                    attemptId={currentAttempt.attemptId}
                    attemptToken={currentAttempt.attemptToken}
                    isMultiplayer={true}
                    opponentScore={gameState.opponentScore}
                    opponentCorrectCount={gameState.opponentCorrectCount}
                    isOpponentFinished={gameState.isOpponentFinished}
                    onScoreUpdate={(score, correctCount) => gameState.gameId && submitScore(gameState.gameId, myPlayerId, score, correctCount)}
                    onMultiplayerFinish={() => gameState.gameId && finishGame(gameState.gameId, myPlayerId)}
                    onLeave={() => {
                        resetGame();
                        setCurrentAttempt(null);
                    }}
                />
            </main>
        );
    }

    return (
        <main className="min-h-screen w-full bg-[#050505] text-[#F0F2F5] selection:bg-[#FF3B30] selection:text-white overflow-hidden font-sans">
            {/* <GrainOverlay /> */}
            <CustomCursor />
            {/* HEADER */}
            <header className="fixed top-0 left-0 md:left-64 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 md:py-6 pointer-events-none">
                {/* HUD Stats Bar */}
                <div className="pointer-events-auto flex items-center bg-black/40 backdrop-blur-md rounded-lg border border-white/5 p-1.5 sm:p-2 gap-1.5 sm:gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 px-3 sm:px-4 md:px-6 py-2 bg-white/5 rounded border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="w-2 h-2 rounded-sm bg-yellow-500 shadow-[0_0_8px_#EAB308]" />
                        <div>
                            <div className="text-[8px] sm:text-[9px] uppercase text-gray-500 font-bold tracking-widest leading-none mb-1">Energy</div>
                            <div className="text-white font-mono font-bold leading-none text-xs sm:text-sm">{energyData?.energy ?? 0}<span className="text-gray-500">/{energyData?.maxEnergy ?? 30}</span></div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 px-3 sm:px-4 md:px-6 py-2 bg-white/5 rounded border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="w-2 h-2 rounded-sm bg-blue-500 shadow-[0_0_8px_#3B82F6]" />
                        <div>
                            <div className="text-[8px] sm:text-[9px] uppercase text-gray-500 font-bold tracking-widest leading-none mb-1">Diamonds</div>
                            <div className="text-white font-mono font-bold leading-none text-xs sm:text-sm">{diamondsData?.diamonds ?? 0}</div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-col min-h-screen w-full">
                {/* ONLINE MATCH SECTION */}
                <section className="relative flex-1 group overflow-hidden border-b border-white/5 min-h-[60vh] md:min-h-0">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0 scale-105 group-hover:scale-100 transition-transform duration-[1.5s] ease-out">
                        <img
                            src="/assets/online_match_bg.png"
                            alt="Online Match Background"
                            className="w-full h-full object-cover opacity-50"
                        />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col px-4 sm:px-6 md:px-12 md:pl-72 py-12 md:py-20">
                        {/* Text Content at Top */}
                        <div className="flex flex-col items-start text-left space-y-4 mb-8">
                            <div className="inline-flex items-center gap-2 px-2.5 md:px-3 py-1 bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded text-[#FF3B30] text-[10px] md:text-xs font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase">
                                Live Combat
                            </div>
                            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-black tracking-[-0.04em] text-white uppercase leading-[0.9] italic">
                                Online <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">Match</span>
                            </h2>
                            <p className="text-gray-400 text-xs sm:text-sm md:text-base font-mono tracking-wider md:tracking-widest uppercase opacity-80 pt-2">
                                <span className="hidden sm:inline">// </span>12,847 Warriors <span className="text-[#FF3B30] mx-1 md:mx-2">•</span> <span className="hidden sm:inline">7 Battles Active</span><span className="sm:hidden">Live</span>
                            </p>
                        </div>

                        {/* Button Centered Vertically & Horizontally in remaining space */}
                        <div className="flex-1 flex items-center justify-center">
                            <div className="relative group/btn w-full sm:w-auto min-w-[280px] max-w-md">
                                <Link href="/quizzes">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="relative flex items-center justify-center -skew-x-12 px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 bg-[#FF3B30] hover:bg-[#ff4f44] text-white transition-all duration-300 border-l border-t border-white/20 shadow-[0_0_20px_rgba(255,59,48,0.3)] w-full min-h-[56px]"
                                    >
                                        <div className="skew-x-12 flex items-center gap-2 sm:gap-3">
                                            <span className="text-base sm:text-lg font-black tracking-wider sm:tracking-widest uppercase">Enter Battle</span>
                                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" />
                                        </div>
                                    </motion.div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Laser Beams / Tech Detials */}

                </section>

                {/* ARCADE MODE SECTION */}
                <section className="relative flex-1 group overflow-hidden min-h-[60vh] md:min-h-0">
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center scale-105 group-hover:scale-100 transition-transform duration-[1.5s] ease-out"
                        style={{ backgroundImage: 'url(/assets/arcade_mode_bg.png)' }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-black/80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                        <div className="absolute inset-0 bg-[#FFB340]/5 mix-blend-overlay" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-end pb-8 sm:pb-12 md:pb-16 px-4 sm:px-6 md:px-12 md:pl-72">
                        <div className="w-full max-w-[90rem] mx-auto">
                            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-6 sm:mb-8 md:mb-12 gap-6 sm:gap-8 md:gap-0">
                                <div className="space-y-3 md:space-y-4 flex flex-col items-start text-left">
                                    <div className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 bg-[#FFB340]/10 border border-[#FFB300]/20 rounded text-[#FFB340] text-[10px] md:text-xs font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase">
                                        <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                        Single Player
                                    </div>
                                    <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-black tracking-[-0.04em] text-white uppercase leading-[0.9] italic">
                                        Arcade <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB340] via-[#FFE5A0] to-[#FFB340]/50">Mode</span>
                                    </h2>
                                </div>

                                <div className="relative group/btn w-full md:w-auto">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-[#FFB340] to-[#FFE5A0] rounded-lg blur opacity-20 group-hover/btn:opacity-50 transition duration-500" />
                                    <div className="relative flex flex-col items-center justify-center -skew-x-12 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 bg-[#FFB340] hover:bg-[#ffc163] text-black transition-all duration-300 border-l border-t border-white/20 shadow-[0_0_20px_rgba(255,179,64,0.3)] gap-3 md:gap-4 w-full md:w-auto min-h-[56px]">
                                        <div className="skew-x-12 flex flex-col items-center gap-2 w-full">
                                            {gameState.gameId ? (
                                                <div className="flex flex-col items-center gap-2 w-full">
                                                    <span className="text-sm sm:text-base md:text-lg font-black tracking-wider sm:tracking-widest uppercase">Game ID Created</span>
                                                    <div className="text-lg sm:text-xl md:text-2xl font-mono font-bold bg-black/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded border border-black/10 select-all">
                                                        {gameState.gameId}
                                                    </div>
                                                    <p className="text-[10px] sm:text-xs font-mono uppercase opacity-70">Share with player 2</p>
                                                    <button
                                                        onClick={() => joinGame(gameState.gameId!, myPlayerId)}
                                                        className="text-xs sm:text-sm bg-black/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-black/30 transition-colors min-h-[40px] w-full sm:w-auto"
                                                    >
                                                        Join Lobby
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <button onClick={createGame} className="w-full bg-black/10 hover:bg-black/20 p-2.5 sm:p-3 rounded uppercase font-bold tracking-wider transition-colors text-sm sm:text-base min-h-[44px]">
                                                        Create Game ID
                                                    </button>

                                                    <div className="w-full h-px bg-black/10 my-1" />

                                                    <div className="flex gap-2 w-full">
                                                        <input
                                                            type="text"
                                                            value={joinInput}
                                                            onChange={(e) => setJoinInput(e.target.value)}
                                                            placeholder="ENTER ID"
                                                            className="flex-1 bg-black/10 border-none outline-none px-2.5 sm:px-3 py-2 sm:py-2.5 font-mono text-xs sm:text-sm placeholder:text-black/30 rounded min-h-[44px]"
                                                        />
                                                        <button
                                                            onClick={() => joinGame(joinInput, myPlayerId)}
                                                            disabled={!joinInput}
                                                            className="bg-black text-[#FFB340] px-4 sm:px-5 py-2 sm:py-2.5 font-bold uppercase text-xs sm:text-sm disabled:opacity-50 rounded min-h-[44px]"
                                                        >
                                                            Join
                                                        </button>
                                                    </div>
                                                </>
                                            )}
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
