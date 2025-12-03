"use client";

import { motion } from "framer-motion";
import { Edit2 } from "lucide-react";
import Image from "next/image";

interface ProfileHeroProps {
    name: string;
    username: string;
    school: string;
    avatarUrl?: string;
    isPremium?: boolean;
    streak?: number;
}

export default function ProfileHero({
    name,
    username,
    school,
    avatarUrl,
    isPremium = false,
    streak = 0
}: ProfileHeroProps) {
    return (
        <div className="relative flex flex-col items-center justify-center py-12 md:py-20">
            {/* Background Glow */}
            {streak > 0 && (
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-radial from-[#FFB340]/10 to-transparent rounded-full blur-3xl pointer-events-none"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
            )}

            {/* Avatar */}
            <motion.div
                className="relative group cursor-pointer"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.02 }}
                data-cursor="avatar"
                data-cursor-image={avatarUrl}
            >
                <div className={`relative w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-full overflow-hidden border-2 ${isPremium ? "border-[#007AFF]" : "border-white/10"}`}>
                    <div className="absolute inset-0 bg-[#161B22] animate-pulse" /> {/* Placeholder */}
                    {avatarUrl && (
                        <Image
                            src={avatarUrl}
                            alt={name}
                            fill
                            className="object-cover"
                        />
                    )}

                    {/* Edit Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Edit2 className="w-6 h-6 text-white" />
                    </div>
                </div>
            </motion.div>

            {/* Name */}
            <div className="mt-8 text-center">
                <motion.h1
                    className="text-3xl md:text-4xl font-medium text-[#F0F2F5] tracking-tight"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {name}
                </motion.h1>
                <motion.p
                    className="mt-2 text-sm font-medium uppercase tracking-widest text-[#878D96]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    @{username} · {school}
                </motion.p>
            </div>
        </div>
    );
}
