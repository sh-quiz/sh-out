"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ShopCardProps {
    title: string;
    price: string;
    description: string;
    icon: React.ReactNode;
    features?: string[];
    isBestValue?: boolean;
    buttonText?: string;
    onPurchase?: () => void;
    delay?: number;
    priceSuffix?: string;
}

export const ShopCard = ({
    title,
    price,
    description,
    icon,
    features = [],
    isBestValue = false,
    buttonText = "Purchase",
    onPurchase,
    delay = 0,
    priceSuffix,
}: ShopCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay, type: "spring", stiffness: 50 }}
            className={cn(
                "group relative flex flex-col overflow-hidden rounded-[32px] border backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2",
                isBestValue
                    ? "border-yellow-400 bg-white/5 shadow-[0_0_40px_-5px_rgba(250,204,21,0.3)]"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]"
            )}
        >
            {/* Best Value Ribbon */}
            {isBestValue && (
                <div className="absolute top-0 right-0 z-20">
                    <div className="absolute top-0 right-0 h-[100px] w-[100px] overflow-hidden rounded-tr-[32px]">
                        <div className="absolute top-[18px] right-[-34px] w-[140px] rotate-45 bg-yellow-400 py-1 text-center text-[10px] font-black uppercase tracking-wider text-black shadow-lg">
                            Best Value
                        </div>
                    </div>
                </div>
            )}

            {/* Content Container */}
            <div className="relative z-10 flex h-full flex-col p-8">

                {/* Header Icon */}
                <div className="mb-6 flex justify-center">
                    <div className={cn(
                        "flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 shadow-inner transition-transform duration-500 group-hover:scale-110",
                        isBestValue && "border-yellow-400/30 bg-yellow-400/10 shadow-[0_0_30px_-5px_rgba(250,204,21,0.2)]"
                    )}>
                        {icon}
                    </div>
                </div>

                {/* Title & Price */}
                <div className="mb-6 text-center">
                    <h3 className={cn(
                        "mb-2 text-xl font-bold transition-colors group-hover:text-white",
                        isBestValue ? "text-yellow-400" : "text-gray-100"
                    )}>
                        {title}
                    </h3>
                    <div className="mb-2 flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-black text-white tracking-tight">{price}</span>
                        {priceSuffix && <span className="text-sm font-medium text-gray-400">{priceSuffix}</span>}
                    </div>
                </div>

                {/* Features / Content */}
                <div className="mb-8 flex-grow">
                    {features.length > 0 ? (
                        <ul className="space-y-3">
                            {features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                    <div className={cn(
                                        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                                        isBestValue ? "bg-green-500 text-black" : "bg-emerald-500/20 text-emerald-400"
                                    )}>
                                        <Check size={10} strokeWidth={4} />
                                    </div>
                                    <span className="font-medium">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center space-y-2 text-center h-full">
                            <p className="text-sm font-medium text-gray-400 leading-relaxed text-balance">
                                {description}
                            </p>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <button
                    onClick={onPurchase}
                    className={cn(
                        "w-full rounded-2xl py-3.5 text-base font-bold transition-all duration-300 active:scale-95",
                        isBestValue
                            ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
                            : "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                    )}
                >
                    {buttonText}
                </button>
            </div>

            {/* Ambient Glows */}
            <div className="absolute top-1/2 left-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[80px] transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
        </motion.div>
    );
};
