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
import MascotChat from "@/components/ui/MascotChat";
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

    const [tourStep, setTourStep] = useState(0);
    const tourMessages = [
        "Welcome Operative. I'm Bliitz-bee. I'm basically the brains of this operation, while you're... the one clicking things.",
        "To your left is Single Player mode. Perfect for when you want to fail in private.",
        "And there's Multiplayer. You can challenge others to see whose neural links are less fried.",
        "Check your metrics below. I've tracked every misstep so you don't have to.",
        "Got questions? Don't ask me. I'm busy maintaining this gorgeous neon glow. Just get back to work."
    ];

    const nextTourStep = () => {
        if (tourStep < tourMessages.length - 1) {
            setTourStep(prev => prev + 1);
        }
    };

    useEffect(() => {
        if (tourStep < tourMessages.length - 1) {
            const timer = setTimeout(nextTourStep, 6000);
            return () => clearTimeout(timer);
        }
    }, [tourStep]);

    return (
        <div className="pb-24">
            {/* Mascot Tour Zone */}
            <div className="mb-12">
                <MascotChat
                    message={tourMessages[tourStep]}
                    onComplete={nextTourStep}
                />
                <div className="mt-4 flex justify-end gap-2">
                    {tourStep < tourMessages.length - 1 ? (
                        <button
                            onClick={nextTourStep}
                            className="text-[10px] font-bold text-blitz-yellow uppercase tracking-[0.2em] px-3 py-1 border border-blitz-yellow/20 bg-blitz-yellow/5 hover:bg-blitz-yellow/10 transition-colors"
                        >
                            Next Protocol_
                        </button>
                    ) : (
                        <button
                            onClick={() => setTourStep(0)}
                            className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] px-3 py-1 hover:text-white transition-colors"
                        >
                            Restart Tour
                        </button>
                    )}
                </div>
            </div>

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