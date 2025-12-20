"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export default function GlassCard({ children, className = "", hoverEffect = false }: GlassCardProps) {
    return (
        <motion.div
            className={`relative overflow-hidden rounded-2xl border border-white/5 bg-[#161B22]/60 backdrop-blur-xl ${className}`}
            whileHover={hoverEffect ? { scale: 1.02, backgroundColor: "rgba(22, 27, 34, 0.8)" } : }
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />


            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
