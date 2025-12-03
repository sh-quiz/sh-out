"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MajorCategoryCardProps {
    title: string;
    subtitle: string;
    gradient: string;
    lightRayPosition: "top-left" | "bottom-right";
    onClick?: () => void;
    className?: string;
}

export default function MajorCategoryCard({
    title,
    subtitle,
    gradient,
    lightRayPosition,
    onClick,
    className,
}: MajorCategoryCardProps) {
    return (
        <motion.div
            className={cn(
                "relative w-full h-[50vh] min-h-[400px] overflow-hidden cursor-pointer group rounded-3xl",
                className
            )}
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            whileHover={{
                y: -8,
                scale: 1.005,
                transition: { duration: 0.4, ease: "easeOut" }
            }}
        >
            {/* Background Gradient */}
            <div
                className="absolute inset-0 transition-transform duration-[8s] ease-linear group-hover:scale-105"
                style={{ background: gradient }}
            />

            {/* Light Rays */}
            <div
                className={cn(
                    "absolute inset-0 opacity-20 transition-opacity duration-700 group-hover:opacity-40",
                    lightRayPosition === "top-left"
                        ? "bg-[radial-gradient(circle_at_0%_0%,_rgba(0,122,255,0.3)_0%,_transparent_50%)]"
                        : "bg-[radial-gradient(circle_at_100%_100%,_rgba(0,122,255,0.3)_0%,_transparent_50%)]"
                )}
            />

            {/* Sapphire Glow (Bottom Border) */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#007AFF] opacity-0 shadow-[0_0_30px_#007AFF]"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "circOut" }}
            />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-8">
                <motion.h2
                    className="text-[clamp(3rem,8vw,180px)] font-light tracking-[-2px] text-[#F0F2F5] leading-none mix-blend-overlay"
                    style={{ fontFamily: 'PP Mori, sans-serif' }} // Assuming font is loaded globally or we use a fallback
                >
                    {title}
                </motion.h2>
                <motion.p
                    className="mt-6 text-lg md:text-xl text-[#878D96] max-w-md font-light tracking-wide"
                    initial={{ opacity: 0.6 }}
                    whileHover={{ opacity: 1, color: "#F0F2F5" }}
                >
                    {subtitle}
                </motion.p>
            </div>
        </motion.div>
    );
}
