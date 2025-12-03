"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import GrainOverlay from "@/components/ui/GrainOverlay";
import MajorCategoryCard from "./components/MajorCategoryCard";
import SubjectCard from "./components/SubjectCard";
import CustomCursor from "./components/CustomCursor";

export default function CategoriesPage() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <main className="min-h-screen bg-[#000000] text-[#F0F2F5] selection:bg-[#007AFF] selection:text-white overflow-x-hidden">
            <GrainOverlay />
            <CustomCursor />

            {/* FIXED HEADER */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 mix-blend-difference">
                <Link href="/" className="p-2 hover:opacity-70 transition-opacity">
                    <ArrowLeft className="w-6 h-6 text-[#F0F2F5]" />
                </Link>

                <h1 className="text-xl md:text-2xl font-medium tracking-tight" style={{ fontFamily: 'PP Mori, sans-serif' }}>
                    Choose Your Subject
                </h1>

                <div className="p-2">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    >
                        <Sparkles className="w-5 h-5 text-[#007AFF]" />
                    </motion.div>
                </div>
            </header>

            <div className="container mx-auto px-4 md:px-8 pt-32 pb-32">

                {/* MAJOR CATEGORIES */}
                <div className="flex flex-col gap-[120px] md:gap-[200px] mb-[200px]">
                    <MajorCategoryCard
                        title="Past Questions"
                        subtitle="Master real exam questions from previous years"
                        gradient="linear-gradient(180deg, #000000 0%, #0A0E14 100%)"
                        lightRayPosition="top-left"
                    />

                    <MajorCategoryCard
                        title="Trial Questions"
                        subtitle="Practice with unlimited mock exams & timed tests"
                        gradient="linear-gradient(180deg, #000000 0%, #0A0E14 100%)"
                        lightRayPosition="bottom-right"
                    />
                </div>

                {/* SUBCATEGORIES GRID */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                    <SubjectCard
                        subject="Mathematics"
                        count="2,847 questions"
                        iconType="math"
                        index={0}
                        isActive={true} // Demo active state
                        progress={75}
                    />
                    <SubjectCard
                        subject="Science"
                        count="1,932 questions"
                        iconType="science"
                        index={1}
                    />
                    <SubjectCard
                        subject="Social Studies"
                        count="1,420 questions"
                        iconType="social"
                        index={2}
                    />
                    <SubjectCard
                        subject="General Science"
                        count="980 questions"
                        iconType="general"
                        index={3}
                    />
                    <SubjectCard
                        subject="English"
                        count="3,105 questions"
                        iconType="english"
                        index={4}
                    />
                </div>

            </div>
        </main>
    );
}
