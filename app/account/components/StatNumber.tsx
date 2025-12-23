"use client";

import { motion } from "framer-motion";

interface StatNumberProps {
    label: string;
    value: string | number;
    subValue?: string;
    accentColor?: "sapphire" | "amber" | "white";
    delay?: number;
    isBreathing?: boolean;
}

export default function StatNumber({
    label,
    value,
    subValue,
    accentColor = "white",
    delay = 0,
    isBreathing = false
}: StatNumberProps) {
    const colors = {
        sapphire: "text-voltage-blue drop-shadow-[0_0_8px_#00F2FF]",
        amber: "text-blitz-yellow drop-shadow-[0_0_8px_#FFD700]",
        white: "text-static-white"
    };

    return (
        <motion.div
            className="flex flex-col items-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
        >
            <span className="text-xs font-medium uppercase tracking-wider text-[#878D96] mb-1">
                {label}
            </span>
            <div className="flex items-baseline gap-2">
                <motion.span
                    className={`text-6xl md:text-8xl font-light tracking-tight ${colors[accentColor]}`}
                    animate={isBreathing ? { opacity: [1, 0.8, 1] } : {}}
                    transition={isBreathing ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : {}}
                >
                    {value}
                </motion.span>
                {subValue && (
                    <span className="text-sm font-medium text-[#878D96]">
                        {subValue}
                    </span>
                )}
            </div>
        </motion.div>
    );
}
