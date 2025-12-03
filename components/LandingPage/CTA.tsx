"use client";

import { motion } from "framer-motion";

export default function CTA() {
    return (
        <section className="relative h-screen flex flex-col items-center justify-center bg-[#0B0E12] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FF2D55_0%,transparent_70%)] opacity-10" />

            <div className="relative z-10 text-center px-4">
                <h2 className="text-5xl md:text-8xl font-black text-[#E8E9EA] mb-12 tracking-tighter uppercase">
                    Face the <br />
                    <span className="text-[#FF2D55]">Apex Predator</span>
                </h2>

                <motion.button
                    whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 1, 0] }}
                    whileTap={{ scale: 0.95 }}
                    className="px-16 py-8 bg-[#FF2D55] text-[#E8E9EA] text-2xl font-black uppercase tracking-widest hover:bg-[#FF2D55] hover:shadow-[0_0_50px_rgba(255,45,85,0.5)] transition-all duration-300"
                >
                    Play Now
                </motion.button>
            </div>
        </section>
    );
}
