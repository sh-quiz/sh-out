'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface TooltipProps {
    text: string;
    children: React.ReactNode;
}

export default function BliitzBeeTooltip({ text, children }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="absolute z-[100] bottom-full left-1/2 -translate-x-1/2 mb-2 w-48"
                    >
                        <div className="bg-[#1C212B] border border-blitz-yellow p-3 shadow-[0_0_20px_rgba(255,215,0,0.2)] relative">
                            <div className="flex items-start gap-2">
                                <img src="/assets/mascot.png" alt="Bee" className="w-6 h-6 object-contain" />
                                <p className="text-[10px] font-mono text-white leading-tight">
                                    <span className="text-blitz-yellow font-bold uppercase block mb-1">Bliitz-bee:</span>
                                    {text}
                                </p>
                            </div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#1C212B]" />
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-9 border-transparent border-t-blitz-yellow -z-10" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
