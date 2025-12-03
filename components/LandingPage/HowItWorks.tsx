"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const steps = [
    {
        id: "01",
        title: "Choose Your Predator",
        description: "Select from 50+ shark species, each with unique stats and abilities."
    },
    {
        id: "02",
        title: "Survive the Deep",
        description: "Answer rapid-fire questions before the oxygen runs out."
    },
    {
        id: "03",
        title: "Evolve & Adapt",
        description: "Earn DNA points to upgrade your shark's senses and speed."
    },
    {
        id: "04",
        title: "Dominate the Ocean",
        description: "Climb the global food chain and become the Apex Predator."
    }
];

export default function HowItWorks() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-75%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-[#0B0E12]">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-12 px-24">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className="group relative h-[60vh] w-[40vw] min-w-[500px] bg-[#1C2128] border border-[#E8E9EA]/10 p-12 flex flex-col justify-between overflow-hidden transition-colors hover:border-[#FF2D55]/50"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-[120px] leading-none select-none group-hover:text-[#FF2D55] transition-colors duration-500">
                                {step.id}
                            </div>

                            <div className="relative z-10">
                                <div className="w-16 h-1 bg-[#FF2D55] mb-8" />
                                <h3 className="text-4xl font-bold mb-6 text-[#E8E9EA]">{step.title}</h3>
                                <p className="text-xl text-[#E8E9EA]/60 leading-relaxed max-w-md">
                                    {step.description}
                                </p>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF2D55] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
