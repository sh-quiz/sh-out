"use client";

import { useEffect, useState, useMemo } from "react";
import Lenis from "lenis";
// GrainOverlay was commented out. I'll keep it commented out.

import CustomCursor from "./components/CustomCursor";
import { useEnergy, useDiamonds } from "@/hooks/useEconomy";
import { useGamemode } from "@/hooks/useGamemode";
import QuizPlayer from "@/components/QuizPlayer/QuizPlayer";
// Import new components
import { OnlineMatchSection } from "./components/OnlineMatchSection";
import { ArcadeModeSection } from "./components/ArcadeModeSection";

import { quizService, AttemptResponse } from "@/lib/quiz";

const ATTEMPT_STATE_KEY = 'current_attempt';

// Helper to load attempt from localStorage
const loadAttempt = (): AttemptResponse | null => {
    if (typeof window === 'undefined') return null;
    try {
        const saved = localStorage.getItem(ATTEMPT_STATE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            console.log('[CategoriesPage] Restored attempt from localStorage:', parsed);
            return parsed;
        }
    } catch (error) {
        console.error('[CategoriesPage] Failed to load attempt:', error);
    }
    return null;
};

export default function CategoriesPage() {
    const { data: energyData } = useEnergy();
    const { data: diamondsData } = useDiamonds();
    const { createGame, joinGame, gameState, isConnected, submitScore, finishGame, resetGame } = useGamemode();
    const [currentAttempt, setCurrentAttempt] = useState<AttemptResponse | null>(loadAttempt);

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

    // Persist attempt to localStorage whenever it changes
    useEffect(() => {
        if (currentAttempt) {
            localStorage.setItem(ATTEMPT_STATE_KEY, JSON.stringify(currentAttempt));
            console.log('[CategoriesPage] Saved attempt to localStorage');
        } else {
            localStorage.removeItem(ATTEMPT_STATE_KEY);
            console.log('[CategoriesPage] Cleared attempt from localStorage');
        }
    }, [currentAttempt]);

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
            <CustomCursor />
            {/* HEADER */}
            <header className="fixed top-0 left-0 md:left-64 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 md:py-6 pointer-events-none">
                {/* HUD Stats Bar */}
                <div className="pointer-events-auto flex items-center bg-black/40 backdrop-blur-md rounded-lg border border-white/5 p-1.5 sm:p-2 gap-1.5 sm:gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 px-3 sm:px-4 md:px-6 py-2 bg-white/5 rounded border border-white/5 hover:bg-white/10 transition-colors group">
                        <div className="w-2 h-2 rounded-sm bg-yellow-500 shadow-[0_0_8px_#EAB308] group-hover:shadow-[0_0_12px_#EAB308] transition-shadow" />
                        <div>
                            <div className="text-[8px] sm:text-[9px] uppercase text-gray-500 font-bold tracking-widest leading-none mb-1">Energy</div>
                            <div className="text-white font-mono font-bold leading-none text-xs sm:text-sm">{energyData?.energy ?? 0}<span className="text-gray-500">/{energyData?.maxEnergy ?? 30}</span></div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 px-3 sm:px-4 md:px-6 py-2 bg-white/5 rounded border border-white/5 hover:bg-white/10 transition-colors group">
                        <div className="w-2 h-2 rounded-sm bg-blue-500 shadow-[0_0_8px_#3B82F6] group-hover:shadow-[0_0_12px_#3B82F6] transition-shadow" />
                        <div>
                            <div className="text-[8px] sm:text-[9px] uppercase text-gray-500 font-bold tracking-widest leading-none mb-1">Diamonds</div>
                            <div className="text-white font-mono font-bold leading-none text-xs sm:text-sm">{diamondsData?.diamonds ?? 0}</div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-col min-h-screen w-full">
                <OnlineMatchSection />
                <ArcadeModeSection
                    gameState={gameState}
                    createGame={createGame}
                    joinGame={joinGame}
                    myPlayerId={myPlayerId}
                />
            </div>
        </main>
    );
}
