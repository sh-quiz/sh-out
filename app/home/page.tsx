'use client';

import { useMemo, useState, useEffect } from "react";
import { useEnergy, useDiamonds } from "@/hooks/useEconomy";
import { useGamemode } from "@/hooks/useGamemode";
import QuizPlayer from "@/components/QuizPlayer/QuizPlayer";
import { OnlineMatchSection } from "../categories/components/OnlineMatchSection";
import { ArcadeModeSection } from "../categories/components/ArcadeModeSection";
import { quizService, AttemptResponse } from "@/lib/quiz";
import PerformanceGrid from "@/components/Home/PerformanceGrid";
import ActivitySection from "@/components/Home/ActivitySection";
import CyberLoader from "@/components/ui/CyberLoader";
import { motion, AnimatePresence } from "framer-motion";

const ATTEMPT_STATE_KEY = 'current_attempt';

const loadAttempt = (): AttemptResponse | null => {
    if (typeof window === 'undefined') return null;
    try {
        const saved = localStorage.getItem(ATTEMPT_STATE_KEY);
        if (saved) return JSON.parse(saved);
    } catch (error) {
        console.error('Failed to load attempt:', error);
    }
    return null;
};

export default function HomePage() {
    const { createGame, joinGame, gameState, isConnected, submitScore, finishGame, resetGame } = useGamemode();
    const [currentAttempt, setCurrentAttempt] = useState<AttemptResponse | null>(loadAttempt);

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
        if (currentAttempt) {
            localStorage.setItem(ATTEMPT_STATE_KEY, JSON.stringify(currentAttempt));
        } else {
            localStorage.removeItem(ATTEMPT_STATE_KEY);
        }
    }, [currentAttempt]);

    useEffect(() => {
        const startMultiplayerAttempt = async () => {
            if (gameState.status === 'playing' && gameState.quizId && !currentAttempt) {
                try {
                    const attempt = await quizService.startAttempt(gameState.quizId);
                    setCurrentAttempt(attempt);
                } catch (error) {
                    console.error("Failed to start multiplayer attempt:", error);
                }
            }
        };
        startMultiplayerAttempt();
    }, [gameState.status, gameState.quizId, currentAttempt]);

    if (gameState.status === 'playing') {
        if (!currentAttempt) {
            return (
                <main className="min-h-screen w-full bg-[#0B0E14] flex flex-col items-center justify-center font-mono">
                    <CyberLoader text="STABILIZING NEURAL LINK..." />
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="text-[10px] text-white/30 uppercase tracking-widest mt-8"
                    >
                        // Bliitz Protocol Active
                    </motion.p>
                </main>
            );
        }

        return (
            <main className="min-h-screen w-full bg-black text-white">
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

    const [mascotMessage, setMascotMessage] = useState("Oh, hey. Welcome to Bliitz. Yeah, the name is... well, it's what happens when your creators spend all their budget on neon lights and two minutes on a thesaurus.");

    const messages = [
        "Bliitz. Brilliant name, right? It's like 'Blitz', but with more... typing required. Truly revolutionary thinking from the humans.",
        "Scanning your progress. My circuits suggest you're doing better than the person who named me. Low bar, but still.",
        "Bliitz-bee. That's my name. It combines my two favorite things: being fast and being an oversight in a branding meeting.",
        "Don't mind me. I'm just a high-performance AI stuck in a box designed by people who thought adding a second 'i' was a personality trait.",
        "Look at all these analytics. If only we tracked how many better names were rejected before we landed on 'Bliitz'."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            const randomMsg = messages[Math.floor(Math.random() * messages.length)];
            setMascotMessage(randomMsg);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="pb-24">
            {/* Mascot Interaction Zone */}
            <header className="mb-12 flex flex-col md:flex-row items-center gap-8 bg-carbon-grey/40 p-8 border border-white/5 rounded-2xl relative overflow-hidden group">
                <div className="absolute inset-0 cyber-grid opacity-[0.05] pointer-events-none" />
                <div className="absolute top-0 right-0 p-4 opacity-5 hover:opacity-20 transition-opacity">
                    <img src="/assets/logo.png" alt="" className="w-24 h-24 rotate-12" />
                </div>

                <div className="relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full cyber-border bg-blitz-yellow/5 flex items-center justify-center relative z-10">
                        <motion.img
                            animate={{
                                y: [0, -5, 0],
                                rotate: [0, 2, -2, 0]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            src="/assets/mascot.png"
                            alt="Bliitz-bee"
                            className="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                        />
                    </div>
                    {/* Floating HUD elements */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 border-t border-r border-blitz-yellow/40" />
                    <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b border-l border-blitz-yellow/40" />
                </div>

                <div className="flex-1 space-y-4 relative z-10 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-white font-orbitron">
                            Bliitz Dashboard
                        </h1>
                        <span className="text-[10px] font-mono text-blitz-yellow font-bold px-2 py-0.5 border border-blitz-yellow/20 bg-blitz-yellow/5 self-center">
                            // CONNECTED: BLIITZ-BEE_V1.0
                        </span>
                    </div>

                    <div className="relative min-h-[60px] flex items-center">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={mascotMessage}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="text-sm md:text-base font-mono text-white/70 italic leading-relaxed"
                            >
                                "{mascotMessage}"
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <OnlineMatchSection />
                <ArcadeModeSection
                    gameState={gameState}
                    createGame={createGame}
                    joinGame={joinGame}
                    myPlayerId={myPlayerId}
                />
            </div>

            <div className="space-y-16">
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-8 flex items-center gap-3">
                        <div className="w-6 h-[1px] bg-blitz-yellow" />
                        <span className="text-white hover:text-blitz-yellow transition-colors cursor-default">Performance Analytics</span>
                        <div className="flex-1 h-[1px] bg-white/5" />
                    </h3>
                    <PerformanceGrid />
                </div>

                <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-8 flex items-center gap-3">
                        <div className="w-6 h-[1px] bg-voltage-blue" />
                        <span className="text-white hover:text-voltage-blue transition-colors cursor-default">Neural Activity Heatmap</span>
                        <div className="flex-1 h-[1px] bg-white/5" />
                    </h3>
                    <ActivitySection />
                </div>
            </div>
        </div>
    );
}