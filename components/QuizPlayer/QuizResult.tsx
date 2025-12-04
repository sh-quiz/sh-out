'use client';

import { useEffect, useState, useRef } from 'react';
import { quizService, AttemptResult } from '@/lib/quiz';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Share2, ArrowRight } from 'lucide-react';
import Lenis from 'lenis';

// Components
import ParticleBackground from '@/components/ui/ParticleBackground';
import ScoreHero from './ScoreHero';
import StatCard from './StatCard';
import RewardCard from './RewardCard';
import RankReveal from './RankReveal';

interface Props {
    attemptId: number;
}

export default function QuizResult({ attemptId }: Props) {
    const [result, setResult] = useState<AttemptResult | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

    // Smooth Scroll
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
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

    useEffect(() => {
        loadResult();
    }, [attemptId]);

    const loadResult = async () => {
        try {
            const data = await quizService.getResult(attemptId);
            setResult(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-pulse text-blue-500 font-mono tracking-widest">LOADING DATA...</div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-red-500 font-mono">RESULT NOT FOUND</div>
            </div>
        );
    }

    // Derived Data
    const correctAnswers = result.score;
    const wrongAnswers = result.totalPoints - result.score;
    const accuracy = Math.round(result.percentage);

    // Mock Data for Visuals
    const speedRank = "Top 15%";
    const timeTaken = "02:15";
    const rankClimb = 127;
    const globalRank = 842;

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 relative overflow-x-hidden">
            <ParticleBackground />

            <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 pb-32 flex flex-col items-center w-full">

                {/* Hero Section */}
                <ScoreHero
                    score={correctAnswers}
                    total={result.totalPoints}
                    streak={8} // Mock streak
                />

                {/* Performance Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="w-full mb-16"
                >
                    <h3 className="text-center text-zinc-400 font-medium mb-6">Performance Breakdown</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <StatCard
                            title="Correct Answers"
                            value={correctAnswers}
                            type="correct"
                            delay={0.5}
                        />
                        <StatCard
                            title="Wrong Answers"
                            value={wrongAnswers}
                            type="wrong"
                            delay={0.6}
                        />
                        <StatCard
                            title="Accuracy"
                            value={`${accuracy}%`}
                            type="accuracy"
                            accuracy={accuracy}
                            delay={0.7}
                        />
                        <StatCard
                            title="Time Taken"
                            value={timeTaken}
                            type="default"
                            delay={0.8}
                        />
                        <StatCard
                            title="Speed Rank"
                            value={speedRank}
                            subValue="" // Icon handled inside
                            type="speed"
                            delay={0.9}
                        />
                    </div>
                </motion.div>

                {/* Rewards Unlocked */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="w-full mb-20"
                >
                    <h3 className="text-center text-zinc-400 font-medium mb-6">Rewards Unlocked</h3>
                    <div className="flex overflow-x-auto pb-8 gap-4 px-4 -mx-4 scrollbar-hide snap-x">
                        <div className="snap-center shrink-0">
                            <RewardCard type="gems" value="+250 Gems" delay={1.1} />
                        </div>
                        <div className="snap-center shrink-0">
                            <RewardCard type="energy" value="+5 Energy Bars" delay={1.2} />
                        </div>
                        <div className="snap-center shrink-0">
                            <RewardCard type="badge" value="Mathematics Scholar" delay={1.3} />
                        </div>
                        <div className="snap-center shrink-0">
                            <RewardCard type="shield" value="Streak Protected ×1" delay={1.4} />
                        </div>
                    </div>
                </motion.div>

                {/* Rank Reveal */}
                <RankReveal climb={rankClimb} rank={globalRank} />

            </main>

            {/* Fixed Bottom CTA Bar */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ delay: 2, type: "spring", stiffness: 100, damping: 20 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-zinc-800/50 p-4 md:p-6"
            >
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <button className="hidden md:flex px-6 py-3 rounded-xl border border-zinc-700 text-zinc-400 font-medium hover:bg-zinc-900 transition-colors items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Share Score
                    </button>

                    <button
                        onClick={() => router.push('/')}
                        className="flex-1 md:flex-none md:w-96 py-4 rounded-xl bg-[#007AFF] text-white font-bold text-lg hover:bg-blue-600 transition-all shadow-[0_0_20px_rgba(0,122,255,0.4)] hover:shadow-[0_0_40px_rgba(0,122,255,0.6)] active:scale-95 flex items-center justify-center gap-2"
                    >
                        Continue Journey
                    </button>

                    <button className="hidden md:block text-zinc-500 hover:text-zinc-300 transition-colors text-sm font-medium">
                        Review Mistakes
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

