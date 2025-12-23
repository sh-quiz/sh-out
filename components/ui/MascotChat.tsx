'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface MascotChatProps {
    message: string;
    onComplete?: () => void;
    position?: 'bottom-right' | 'top-right' | 'relative';
}

export default function MascotChat({ message, onComplete, position = 'relative' }: MascotChatProps) {
    const containerClasses = {
        'bottom-right': 'fixed bottom-8 right-8 z-[100] max-w-sm',
        'top-right': 'fixed top-24 right-8 z-[100] max-w-sm',
        'relative': 'relative w-full'
    };

    return (
        <div className={containerClasses[position]}>
            <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                className="flex items-end gap-3"
            >
                <div className="flex-1 bg-carbon-grey border border-blitz-yellow p-4 shadow-[0_0_30px_rgba(255,215,0,0.15)] relative">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black text-blitz-yellow uppercase tracking-widest">Bliitz-bee // COMM_PROTOCOL</span>
                        <div className="flex-1 h-[1px] bg-blitz-yellow/20" />
                    </div>
                    <p className="text-xs font-mono text-white leading-relaxed italic">
                        "{message}"
                    </p>
                    {/* Cyberpunk corner accents */}
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blitz-yellow" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-blitz-yellow" />

                    {/* Chat bubble tail */}
                    <div className="absolute bottom-2 -right-2 w-4 h-4 bg-carbon-grey border-r border-b border-blitz-yellow rotate-45" />
                </div>

                <div className="w-12 h-12 flex-shrink-0 bg-blitz-yellow/5 border border-blitz-yellow/20 rounded-lg flex items-center justify-center overflow-hidden">
                    <motion.img
                        animate={{
                            y: [0, -5, 0],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        src="/assets/mascot.png"
                        alt="Mascot"
                        className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]"
                    />
                </div>
            </motion.div>
        </div>
    );
}
