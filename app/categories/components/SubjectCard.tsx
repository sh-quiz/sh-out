"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SubjectCardProps {
    subject: string;
    count: string;
    iconType: "math" | "science" | "social" | "general" | "english";
    isActive?: boolean;
    progress?: number;
    index: number;
}

const Icons = {
    math: (progress: number) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
            <motion.path
                d="M4 4h16v16H4z"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            <motion.path
                d="M8 8l8 8M16 8l-8 8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
            />
        </svg>
    ),
    science: (progress: number) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
            <motion.path
                d="M12 2v20M2 12h20"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress }}
            />
            <motion.circle
                cx="12" cy="12" r="6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress }}
                transition={{ delay: 0.2 }}
            />
        </svg>
    ),
    social: (progress: number) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
            <motion.circle cx="12" cy="12" r="10" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} />
            <motion.path d="M2 12h20" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={{ delay: 0.2 }} />
            <motion.path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={{ delay: 0.4 }} />
        </svg>
    ),
    general: (progress: number) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
            <motion.path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} />
        </svg>
    ),
    english: (progress: number) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
            <motion.path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} />
            <motion.path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={{ delay: 0.2 }} />
        </svg>
    )
};

export default function SubjectCard({
    subject,
    count,
    iconType,
    isActive = false,
    progress = 0,
    index
}: SubjectCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className={cn(
                "relative flex flex-col items-center justify-center p-8 rounded-[24px] bg-[#161B22] border border-[#1F252D] cursor-pointer overflow-hidden aspect-[1/1.3]",
                isActive && "border-l-[6px] border-l-[#007AFF]"
            )}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            {/* Active Glow */}
            {isActive && (
                <div className="absolute inset-0 bg-[#007AFF] opacity-[0.03]" />
            )}

            {/* Hover Glow */}
            <motion.div
                className="absolute inset-0 bg-[#007AFF] opacity-0 blur-2xl"
                animate={{ opacity: isHovered ? 0.05 : 0 }}
            />

            {/* Icon */}
            <div className={cn("mb-6 relative", isActive ? "text-[#007AFF]" : "text-[#F0F2F5]")}>
                {isActive && (
                    <svg className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] rotate-[-90deg]">
                        <circle
                            cx="50%" cy="50%" r="28"
                            fill="none"
                            stroke="#FFB340"
                            strokeWidth="2"
                            strokeDasharray="175"
                            strokeDashoffset={175 - (175 * progress) / 100}
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                )}
                {Icons[iconType](isHovered || isActive ? 1 : 0)}
            </div>

            {/* Text */}
            <h3 className="text-2xl font-semibold text-[#F0F2F5] mb-2 text-center">{subject}</h3>
            <p className="text-sm text-[#878D96]">{count}</p>
        </motion.div>
    );
}
