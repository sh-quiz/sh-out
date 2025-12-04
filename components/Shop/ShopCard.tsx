"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShopCardProps {
    title: string;
    price: string;
    gems: number;
    energy?: number;
    streakProtector?: number;
    isVIP?: boolean;
    badge?: "Most Popular" | "Limited Time" | "One-time offer";
    buttonColor?: "blue" | "orange";
    delay?: number;
}

export const ShopCard = ({
    title,
    price,
    gems,
    energy,
    streakProtector,
    isVIP,
    badge,
    buttonColor = "blue",
    delay = 0,
}: ShopCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]"
        >
            {/* Badge */}
            {badge && (
                <div
                    className={cn(
                        "absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
                        badge === "Most Popular" && "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]",
                        badge === "Limited Time" && "bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse",
                        badge === "One-time offer" && "bg-white/10 text-white backdrop-blur-md border border-white/20"
                    )}
                >
                    {badge}
                </div>
            )}

            <div>
                <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
                <div className="text-4xl font-black text-white mb-6 tracking-tight">{price}</div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-300">
                        <span className="text-amber-400 text-lg">💎</span>
                        <span className="font-medium">{gems.toLocaleString()} Gems</span>
                    </div>

                    {energy && (
                        <div className="flex items-center gap-3 text-gray-300">
                            <span className="text-emerald-400 text-lg">⚡</span>
                            <span className="font-medium">{energy} Energy {energy < 100 ? "Bars" : ""}</span>
                        </div>
                    )}

                    {streakProtector && (
                        <div className="flex items-center gap-3 text-gray-300">
                            <span className="text-gray-200 text-lg">🛡️</span>
                            <span className="font-medium">Streak Protector ×{streakProtector}</span>
                        </div>
                    )}

                    {isVIP && (
                        <div className="flex items-center gap-3 text-gray-300">
                            <span className="text-blue-400 text-lg">✨</span>
                            <span className="font-medium">Exclusive Avatar Frame</span>
                        </div>
                    )}
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "mt-8 w-full rounded-xl py-3.5 font-bold text-white transition-all duration-300",
                    buttonColor === "blue"
                        ? "bg-[#007AFF] hover:bg-[#0066CC] hover:shadow-[0_0_20px_rgba(0,122,255,0.4)]"
                        : "bg-[#FFB340] text-black hover:bg-[#E6A239] hover:shadow-[0_0_20px_rgba(255,179,64,0.4)]"
                )}
            >
                Purchase
            </motion.button>

            {/* Inner Glow */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </motion.div>
    );
};
