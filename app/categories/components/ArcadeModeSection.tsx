"use client";

import { Sparkles, Copy, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";



interface ArcadeModeProps {
    gameState: {
        gameId: string | null;
        status: string;
        players: string[];
    };
    createGame: () => void;
    joinGame: (gameId: string, playerId: string) => void;
    myPlayerId: string;
}

export const ArcadeModeSection = ({ gameState, createGame, joinGame, myPlayerId }: ArcadeModeProps) => {
    const [joinInput, setJoinInput] = useState("");
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (gameState.gameId) {
            navigator.clipboard.writeText(gameState.gameId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <section className="relative flex-1 group overflow-hidden min-h-[50vh] md:min-h-0 border border-white/5 bg-carbon-grey/40 cyber-border">

            <div className="absolute inset-0 z-0 cyber-grid opacity-10" />


            <div className="relative z-10 h-full flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 py-12">
                <div className="w-full">
                    <div className="flex flex-col items-center mb-12 gap-8">


                        <div className="space-y-4 flex flex-col items-center text-center max-w-full">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1 bg-blitz-yellow/10 border border-blitz-yellow/20 rounded text-blitz-yellow text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase"
                            >
                                <Sparkles className="w-3 h-3" />
                                Custom Match
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.04em] text-white uppercase leading-[0.9] italic font-orbitron"
                            >
                                Arcade <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blitz-yellow via-blitz-yellow/40 to-blitz-yellow/10">Mode</span>
                            </motion.h2>
                        </div>


                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative group/btn w-full max-w-sm"
                        >
                            <div className="relative flex flex-col items-center justify-center p-6 bg-black border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)] gap-4 w-full cyber-border overflow-hidden">
                                <div className="flex flex-col items-center gap-4 w-full">
                                    <AnimatePresence mode="wait">
                                        {gameState.gameId ? (
                                            <motion.div
                                                key="lobby"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex flex-col items-center gap-4 w-full"
                                            >
                                                <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/60">Lobby Created</span>
                                                <div className="flex items-center gap-2 w-full">
                                                    <div className="flex-1 text-xl font-mono font-bold bg-white/5 px-4 py-3 rounded border border-white/10 select-all text-center tracking-widest text-white">
                                                        {gameState.gameId}
                                                    </div>
                                                    <button
                                                        onClick={handleCopy}
                                                        className="p-3 bg-white/10 hover:bg-white/20 rounded border border-white/10 transition-colors text-white"
                                                        title="Copy Game ID"
                                                    >
                                                        {copied ? <Check className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5" />}
                                                    </button>
                                                </div>

                                                <p className="text-[10px] font-mono uppercase text-white/40">Share ID with Player 2</p>

                                                <div className="w-full h-px bg-white/5 my-2" />

                                                <div className="flex flex-col w-full gap-2">
                                                    <p className="text-[10px] font-bold uppercase text-white/40 self-center tracking-widest">Players in Lobby:</p>
                                                    <div className="flex gap-2 flex-wrap justify-center">
                                                        <span className="text-[10px] bg-white/10 px-3 py-1 rounded font-mono text-white/80 uppercase">You</span>

                                                        {gameState.players.filter(p => p !== myPlayerId).map(p => (
                                                            <span key={p} className="text-[10px] bg-white/20 px-3 py-1 rounded font-mono text-white uppercase animate-pulse">Opponent</span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => joinGame(gameState.gameId!, myPlayerId)}
                                                    className="mt-4 w-full py-4 bg-blitz-yellow text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-blitz-yellow/90 transition-colors shadow-[0_0_15px_rgba(255,215,0,0.2)]"
                                                >
                                                    Start Match
                                                </button>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="create-join"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="w-full space-y-4"
                                            >
                                                <button onClick={createGame} className="w-full bg-blitz-yellow text-black py-4 px-4 font-black uppercase tracking-[0.2em] text-xs hover:bg-blitz-yellow/90 transition-colors shadow-[0_0_15px_rgba(255,215,0,0.2)]">
                                                    Create Game ID
                                                </button>

                                                <div className="flex items-center gap-4 opacity-20">
                                                    <div className="h-px bg-white flex-1" />
                                                    <span className="text-[10px] font-mono">OR</span>
                                                    <div className="h-px bg-white flex-1" />
                                                </div>

                                                <div className="flex gap-2 w-full">
                                                    <input
                                                        type="text"
                                                        value={joinInput}
                                                        onChange={(e) => setJoinInput(e.target.value)}
                                                        placeholder="ENTER ID"
                                                        className="flex-1 bg-white/5 border border-white/10 outline-none px-4 py-3 font-mono text-xs placeholder:text-white/20 rounded-none text-white font-bold uppercase text-center focus:border-white/40 transition-colors"
                                                    />
                                                    <button
                                                        onClick={() => joinGame(joinInput, myPlayerId)}
                                                        disabled={!joinInput}
                                                        className="shrink-0 bg-white/10 text-white px-6 py-3 font-bold uppercase text-xs disabled:opacity-50 hover:bg-white/20 transition-colors border border-white/10"
                                                    >
                                                        Join
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
