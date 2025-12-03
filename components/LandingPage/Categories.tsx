"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const categories = [
    { name: "Great White", level: "Apex" },
    { name: "Hammerhead", level: "Elite" },
    { name: "Megalodon", level: "Legendary" },
    { name: "Tiger Shark", level: "Deadly" }
];

export default function Categories() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

    return (
        <section ref={containerRef} className="py-32 bg-[#0B0E12] overflow-hidden">
            <div className="max-w-[1800px] mx-auto px-4">
                <motion.div style={{ y }} className="flex flex-col gap-4">
                    {categories.map((cat, i) => (
                        <div
                            key={i}
                            className="group relative h-[200px] md:h-[300px] w-full border-y border-[#E8E9EA]/10 flex items-center justify-between px-8 md:px-24 hover:bg-[#1C2128] transition-colors duration-500 cursor-pointer overflow-hidden"
                        >
                            <h3 className="text-6xl md:text-9xl font-black text-[#E8E9EA]/20 group-hover:text-[#FF2D55] group-hover:translate-x-12 transition-all duration-500 uppercase tracking-tighter">
                                {cat.name}
                            </h3>

                            <div className="absolute right-24 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <span className="text-[#E8E9EA] text-xl tracking-widest uppercase border border-[#FF2D55] px-4 py-2 rounded-full">
                                    {cat.level}
                                </span>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF2D55]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
