"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface EnergyPackCardProps {
    energy: number;
    price: string;
    image: string;
    isPopular?: boolean;
    delay?: number;
}

export const EnergyPackCard = ({
    energy,
    price,
    image,
    isPopular,
    delay = 0,
}: EnergyPackCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="group relative h-48 overflow-hidden rounded-2xl border border-white/10 bg-black transition-all duration-300 hover:border-white/30 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)]"
        >
            {/* Background Image */}
            <div className="absolute inset-0 opacity-60 transition-transform duration-700 group-hover:scale-110">
                <Image
                    src={image}
                    alt={`${energy} Energy`}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            </div>

            <div className="relative flex h-full flex-col justify-end p-5">
                <div className="flex items-end justify-between">
                    <div>
                        <div className="text-xl font-bold text-white">{energy} Energy</div>
                        {isPopular && (
                            <div className="mt-1 text-xs font-medium text-[#007AFF]">Popular</div>
                        )}
                    </div>
                    <div className="text-xl font-medium text-gray-300">{price}</div>
                </div>
            </div>
        </motion.div>
    );
};
