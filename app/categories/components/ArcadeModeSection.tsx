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
        <section className="relative flex-1 group overflow-hidden min-h-[60vh] md:min-h-0">

            <div
                className="absolute inset-0 z-0 bg-cover bg-center scale-105 group-hover:scale-100 transition-transform duration-[1.5s] ease-out"
                style={{ backgroundImage: 'url(/assets/arcade_mode_bg.png)' }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-black/80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                <div className="absolute inset-0 bg-[#FFB340]/5 mix-blend-overlay" />
            </div>


            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,179,64,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,179,64,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
            </div>


            <div className="relative z-10 h-full flex flex-col justify-center items-center px-4 sm:px-6 md:px-8">
                <div className="w-full">
                    <div className="flex flex-col items-center mb-6 sm:mb-8 md:mb-12 gap-6 sm:gap-8">


                        <div className="space-y-3 md:space-y-4 flex flex-col items-center text-center max-w-full">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 bg-[#FFB340]/10 border border-[#FFB300]/20 rounded text-[#FFB340] text-[10px] md:text-xs font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase"
                            >
                                <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                Custom Match
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-black tracking-[-0.04em] text-white uppercase leading-[0.9] italic"
                            >
                                Arcade <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB340] via-[#FFE5A0] to-[#FFB340]/50">Mode</span>
                            </motion.h2>
                        </div>


                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative group/btn w-full max-w-xs"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#FFB340] to-[#FFE5A0] rounded-lg blur opacity-20 group-hover/btn:opacity-50 transition duration-500" />
                            <div className="relative flex flex-col items-center justify-center -skew-x-12 px-4 py-4 bg-[#FFB340] hover:bg-[#ffc163] text-black transition-all duration-300 border-l border-t border-white/20 shadow-[0_0_20px_rgba(255,179,64,0.3)] gap-2 w-full min-h-[48px]">
                                <div className="skew-x-12 flex flex-col items-center gap-2 w-full">
                                    <AnimatePresence mode="wait">
                                        {gameState.gameId ? (
                                            <motion.div
                                                key="lobby"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex flex-col items-center gap-2 w-full"
                                            >
                                                <span className="text-sm sm:text-base md:text-lg font-black tracking-wider sm:tracking-widest uppercase">Lobby Created</span>
                                                <div className="flex items-center gap-2 w-full">
                                                    <div className="flex-1 text-lg sm:text-xl md:text-2xl font-mono font-bold bg-black/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded border border-black/10 select-all text-center">
                                                        {gameState.gameId}
                                                    </div>
                                                    <button
                                                        onClick={handleCopy}
                                                        className="p-2 bg-black/20 hover:bg-black/30 rounded border border-black/10 transition-colors"
                                                        title="Copy Game ID"
                                                    >
                                                        {copied ? <Check className="w-5 h-5 text-green-700" /> : <Copy className="w-5 h-5" />}
                                                    </button>
                                                </div>

                                                <p className="text-[10px] sm:text-xs font-mono uppercase opacity-70">Share ID with Player 2</p>

                                                <div className="w-full h-px bg-black/10 my-1" />

                                                <div className="flex flex-col w-full gap-1">
                                                    <p className="text-[10px] font-bold uppercase opacity-60 self-center">Players in Lobby:</p>
                                                    <div className="flex gap-1 flex-wrap justify-center">
                                                        <span className="text-xs bg-black/10 px-2 py-0.5 rounded font-mono">You</span>

                                                        {gameState.players.filter(p => p !== myPlayerId).map(p => (
                                                            <span key={p} className="text-xs bg-black/10 px-2 py-0.5 rounded font-mono">P2</span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => joinGame(gameState.gameId!, myPlayerId)}
                                                    className="mt-2 text-xs sm:text-sm bg-black text-[#FFB340] px-3 sm:px-4 py-2 rounded hover:bg-gray-900 transition-colors min-h-[40px] w-full font-bold uppercase tracking-wider"
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
                                                className="w-full"
                                            >
                                                <button onClick={createGame} className="w-full bg-black/10 hover:bg-black/20 p-2.5 sm:p-3 rounded uppercase font-bold tracking-wider transition-colors text-sm sm:text-base min-h-[44px]">
                                                    Create Game ID
                                                </button>

                                                <div className="flex items-center gap-2 my-2 opacity-50">
                                                    <div className="h-px bg-black flex-1" />
                                                    <span className="text-[10px] font-mono">OR</span>
                                                    <div className="h-px bg-black flex-1" />
                                                </div>

                                                <div className="flex gap-2 w-full">
                                                    <input
                                                        type="text"
                                                        value={joinInput}
                                                        onChange={(e) => setJoinInput(e.target.value)}
                                                        placeholder="ENTER ID"
                                                        className="flex-1 min-w-0 bg-black/10 border-none outline-none px-2.5 sm:px-3 py-2 sm:py-2.5 font-mono text-xs sm:text-sm placeholder:text-black/50 rounded min-h-[44px] text-black font-bold uppercase text-center"
                                                    />
                                                    <button
                                                        onClick={() => joinGame(joinInput, myPlayerId)}
                                                        disabled={!joinInput}
                                                        className="shrink-0 bg-black text-[#FFB340] px-3 py-2 sm:py-2.5 font-bold uppercase text-xs sm:text-sm disabled:opacity-50 rounded min-h-[44px] hover:bg-gray-900 transition-colors"
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
