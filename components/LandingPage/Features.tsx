"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
    {
        title: "Cinematic Mode",
        description: "Immersive 4K underwater environments.",
        colSpan: "col-span-1 md:col-span-2",
        bg: "bg-gradient-to-br from-[#1C2128] to-[#0B0E12]"
    },
    {
        title: "Real-time Multiplayer",
        description: "Challenge friends in 1v1 shark attacks.",
        colSpan: "col-span-1",
        bg: "bg-[#1C2128]"
    },
    {
        title: "Daily Challenges",
        description: "New prey every 24 hours.",
        colSpan: "col-span-1",
        bg: "bg-[#1C2128]"
    },
    {
        title: "Marine Biology Database",
        description: "Learn real facts verified by experts.",
        colSpan: "col-span-1 md:col-span-2",
        bg: "bg-gradient-to-bl from-[#1C2128] to-[#0B0E12]"
    }
];

export default function Features() {
    return (
        <section className="py-16 md:py-32 px-4 bg-[#0B0E12] relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 md:mb-24">
                    <h2 className="text-4xl md:text-8xl font-black text-[#E8E9EA] mb-6 tracking-tighter">
                        APEX <span className="text-[#FF2D55]">FEATURES</span>
                    </h2>
                    <div className="w-full h-[1px] bg-[#E8E9EA]/10" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={cn(
                                "group relative p-6 md:p-12 min-h-[250px] md:min-h-[300px] border border-[#E8E9EA]/5 hover:border-[#FF2D55]/30 transition-colors duration-500 overflow-hidden",
                                feature.colSpan,
                                feature.bg
                            )}
                        >
                            <div className="relative z-10 h-full flex flex-col justify-end">
                                <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-[#E8E9EA] group-hover:text-[#FF2D55] transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-[#E8E9EA]/60 text-base md:text-lg">
                                    {feature.description}
                                </p>
                            </div>

                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,45,85,0.1),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
