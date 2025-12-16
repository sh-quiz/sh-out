"use client";

import { motion } from "framer-motion";

export default function Testimonials() {
    return (
        <section className="py-16 md:py-32 px-4 bg-[#0B0E12] flex items-center justify-center min-h-[50vh] md:min-h-[80vh]">
            <div className="max-w-5xl mx-auto text-center">
                <motion.blockquote
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-2xl md:text-6xl font-light leading-tight text-[#E8E9EA]"
                >
                    &ldquo;The most <span className="text-[#FF2D55] font-bold">terrifyingly beautiful</span> quiz experience I've ever played. It feels like the ocean is watching you.&rdquo;
                </motion.blockquote>
                <div className="mt-8 md:mt-12 flex flex-col items-center gap-2">
                    <cite className="text-lg md:text-xl font-bold text-[#E8E9EA] not-italic">Sarah Jenkins</cite>
                    <span className="text-[#E8E9EA]/40 uppercase tracking-widest text-xs md:text-sm">Marine Biologist</span>
                </div>
            </div>
        </section>
    );
}
