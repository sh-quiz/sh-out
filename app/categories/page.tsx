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

export default function CategoriesPage() {
    const { data: energyData } = useEnergy();
    const { data: diamondsData } = useDiamonds();
    const { createGame, joinGame, gameState, isConnected, submitScore, finishGame } = useGamemode();
    const [joinInput, setJoinInput] = useState("");

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

    // Auto-join if we created game and haven't joined yet? 
    // Simplified: User must click Join for now to keep it robust in demo.

    if (gameState.status === 'playing') {
        console.log("Playing with quizId:", gameState.quizId);
        return (
            <main className="min-h-screen w-full bg-[#050505] text-[#F0F2F5] font-sans">
                <main className="min-h-screen w-full bg-[#050505] text-[#F0F2F5] font-sans">
                    <QuizPlayer
                        quizId={gameState.quizId || 1}
                        attemptId={123}
                        attemptToken="demo"
                        isMultiplayer={true}
                        opponentScore={gameState.opponentScore}
                        isOpponentFinished={gameState.isOpponentFinished}
                        onScoreUpdate={(score) => gameState.gameId && submitScore(gameState.gameId, myPlayerId, score)}
                        onMultiplayerFinish={() => gameState.gameId && finishGame(gameState.gameId, myPlayerId)}
                    />
                </main>
                );
    }

                return (
                <main className="min-h-screen w-full bg-[#050505] text-[#F0F2F5] selection:bg-[#FF3B30] selection:text-white overflow-hidden font-sans">
                    <GrainOverlay />
                    <CustomCursor />
                    {/* HEADER */}
                    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between pl-72 pr-8 py-6 pointer-events-none">


                        <div className="pointer-events-auto flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/5 rounded-full px-4 py-2">
                        </div>
                    </header>

                    <div className="flex flex-col h-screen w-full">
                        {/* ONLINE MATCH SECTION */}
                        <section className="relative flex-1 group overflow-hidden border-b border-white/5">
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0 scale-105 group-hover:scale-100 transition-transform duration-[1.5s] ease-out">
                                <img
                                    src="/assets/online_match_bg.png"
                                    alt="Online Match Background"
                                    className="w-full h-full object-cover opacity-50"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-black/80" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                                <div className="absolute inset-0 bg-[#FF3B30]/5 mix-blend-overlay" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 pl-72">
                                <div className="flex items-end justify-between w-full max-w-[90rem] mx-auto">
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded text-[#FF3B30] text-xs font-bold tracking-[0.2em] uppercase">
                                            Live Combat
                                        </div>
                                        <h2 className="text-7xl md:text-9xl font-black tracking-[-0.04em] text-white uppercase leading-[0.9] italic">
                                            Online <br />
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">Match</span>
                                        </h2>
                                        <p className="text-gray-400 text-sm md:text-base font-mono tracking-widest uppercase opacity-80 pt-4">
                                    // 12,847 Warriors Online <span className="text-[#FF3B30] mx-2">•</span> 7 Battles Active
                                        </p>
                                    </div>

                                    <div className="relative group/btn">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-[#FF3B30] to-[#FF9500] rounded-lg blur opacity-20 group-hover/btn:opacity-50 transition duration-500" />
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="relative flex items-center justify-center -skew-x-12 px-12 py-6 bg-[#FF3B30] hover:bg-[#ff4f44] text-white transition-all duration-300 border-l border-t border-white/20 shadow-[0_0_20px_rgba(255,59,48,0.3)]"
                                        >
                                            <div className="skew-x-12 flex items-center gap-3">
                                                <span className="text-lg font-black tracking-widest uppercase">Enter Battle</span>
                                                <ArrowLeft className="w-5 h-5 rotate-180" />
                                            </div>
                                        </motion.button>
                                    </div>
                                </div>
                            </div>

                            {/* Laser Beams / Tech Detials */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF3B30]/50 to-transparent opacity-50" />
                            </div>
                        </section>

                        {/* ARCADE MODE SECTION */}
                        <section className="relative flex-1 group overflow-hidden">
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
                            <div className="relative z-10 h-full flex flex-col justify-end pb-16 px-6 md:px-12 pl-72">
                                <div className="w-full max-w-[90rem] mx-auto">
                                    <div className="flex items-end justify-between mb-12">
                                        <div className="space-y-4">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFB340]/10 border border-[#FFB300]/20 rounded text-[#FFB340] text-xs font-bold tracking-[0.2em] uppercase">
                                                <Sparkles className="w-3 h-3" />
                                                Single Player
                                            </div>
                                            <h2 className="text-7xl md:text-9xl font-black tracking-[-0.04em] text-white uppercase leading-[0.9] italic">
                                                Arcade <br />
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB340] via-[#FFE5A0] to-[#FFB340]/50">Mode</span>
                                            </h2>
                                        </div>

                                        <div className="relative group/btn">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-[#FFB340] to-[#FFE5A0] rounded-lg blur opacity-20 group-hover/btn:opacity-50 transition duration-500" />
                                            <div className="relative flex flex-col items-center justify-center -skew-x-12 px-8 py-6 bg-[#FFB340] hover:bg-[#ffc163] text-black transition-all duration-300 border-l border-t border-white/20 shadow-[0_0_20px_rgba(255,179,64,0.3)] gap-4">
                                                <div className="skew-x-12 flex flex-col items-center gap-2 w-full">
                                                    {gameState.gameId ? (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <span className="text-lg font-black tracking-widest uppercase">Game ID Created</span>
                                                            <div className="text-2xl font-mono font-bold bg-black/20 px-4 py-2 rounded border border-black/10 select-all">
                                                                {gameState.gameId}
                                                            </div>
                                                            <p className="text-xs font-mono uppercase opacity-70">Share with player 2</p>
                                                            <button
                                                                onClick={() => joinGame(gameState.gameId!, myPlayerId)}
                                                                className="text-xs bg-black/20 px-2 py-1 rounded hover:bg-black/30"
                                                            >
                                                                Join Lobby
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <button onClick={createGame} className="w-full bg-black/10 hover:bg-black/20 p-2 rounded uppercase font-bold tracking-wider transition-colors">
                                                                Create Game ID
                                                            </button>

                                                            <div className="w-full h-px bg-black/10 my-1" />

                                                            <div className="flex gap-2 w-full">
                                                                <input
                                                                    type="text"
                                                                    value={joinInput}
                                                                    onChange={(e) => setJoinInput(e.target.value)}
                                                                    placeholder="ENTER ID"
                                                                    className="w-full bg-black/10 border-none outline-none px-2 py-1 font-mono text-sm placeholder:text-black/30"
                                                                />
                                                                <button
                                                                    onClick={() => joinGame(joinInput, myPlayerId)}
                                                                    disabled={!joinInput}
                                                                    className="bg-black text-[#FFB340] px-3 py-1 font-bold uppercase text-xs disabled:opacity-50"
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

                                    {/* HUD Stats Bar */}
                                    <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8 mt-8">
                                        <div className="flex items-center gap-8 text-[#878D96] text-sm font-mono tracking-wider uppercase">
                                            <span>System Ready</span>
                                            <span>v2.4.0</span>
                                        </div>

                                        <div className="flex items-center bg-black/40 backdrop-blur-md rounded-lg border border-white/5 p-2 gap-2">
                                            <div className="flex items-center gap-4 px-6 py-2 bg-white/5 rounded border border-white/5 hover:bg-white/10 transition-colors">
                                                <div className="w-2 h-2 rounded-sm bg-yellow-500 shadow-[0_0_8px_#EAB308]" />
                                                <div>
                                                    <div className="text-[9px] uppercase text-gray-500 font-bold tracking-widest leading-none mb-1">Energy</div>
                                                    <div className="text-white font-mono font-bold leading-none">{energyData?.energy ?? 0}<span className="text-gray-500">/{energyData?.maxEnergy ?? 30}</span></div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 px-6 py-2 bg-white/5 rounded border border-white/5 hover:bg-white/10 transition-colors">
                                                <div className="w-2 h-2 rounded-sm bg-blue-500 shadow-[0_0_8px_#3B82F6]" />
                                                <div>
                                                    <div className="text-[9px] uppercase text-gray-500 font-bold tracking-widest leading-none mb-1">Diamonds</div>
                                                    <div className="text-white font-mono font-bold leading-none">{diamondsData?.diamonds ?? 0}</div>
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
