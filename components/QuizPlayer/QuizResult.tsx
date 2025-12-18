'use client';

import { useEffect, useState, useRef } from 'react';
import { quizService, AttemptResult } from '@/lib/quiz';
import { economyService } from '@/lib/economy';
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
import { useUserRank } from '@/hooks/useLeaderboard';
import QuestionReview from './QuestionReview';

interface Props {
    attemptId: number;
}

export default function QuizResult({ attemptId }: Props) {
    const [result, setResult] = useState<AttemptResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasClaimed, setHasClaimed] = useState(false);
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const reviewRef = useRef<HTMLDivElement>(null);

    // Data Fetching
    const { data: userRank } = useUserRank();

    const scrollToReview = () => {
        reviewRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Smooth Scroll - Disabled on mobile for better performance
    useEffect(() => {
        // Only enable smooth scroll on larger screens
        const mediaQuery = window.matchMedia('(min-width: 768px)');
        if (!mediaQuery.matches) return;

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

            // Award energy if perfect score
            if (data && data.score === data.totalPoints && !hasClaimed) {
                try {
                    await economyService.awardEnergy({
                        amount: 5,
                        reason: `Perfect Score: Quiz ${data.quiz.title}`
                    });
                    setHasClaimed(true);
                } catch (error) {
                    console.error('Failed to claim reward:', error);
                }
            }
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

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Mock Data for Visuals (some still mocked)
    const speedRank = "Top 15%";
    const timeTaken = formatTime(result.timeTaken || 0);
    const rankClimb = 0; // Climbing calculation requires historical data not yet available
    const globalRank = userRank?.rank ?? 0;

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 relative overflow-x-hidden">
            <ParticleBackground />

            <main className="relative z-10 max-w-sm sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 pb-24 sm:pb-28 lg:pb-32 flex flex-col items-center w-full" role="main">

                {/* Hero Section */}
                <ScoreHero
                    score={correctAnswers}
                    total={result.totalPoints}
                    streak={1} // Mock streak
                />

                {/* Performance Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="w-full mb-12 sm:mb-14 lg:mb-16"
                >
                    <h3 className="text-center text-zinc-400 font-medium mb-4 sm:mb-5 lg:mb-6 text-sm sm:text-base">Performance Breakdown</h3>
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-5">
                        <StatCard
                            className="w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.667rem)] lg:w-[calc(20%-1rem)]"
                            title="Correct Answers"
                            value={correctAnswers}
                            type="correct"
                            delay={0.5}
                        />
                        <StatCard
                            className="w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.667rem)] lg:w-[calc(20%-1rem)]"
                            title="Wrong Answers"
                            value={wrongAnswers}
                            type="wrong"
                            delay={0.6}
                        />
                        <StatCard
                            className="w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.667rem)] lg:w-[calc(20%-1rem)]"
                            title="Accuracy"
                            value={`${accuracy}%`}
                            type="accuracy"
                            accuracy={accuracy}
                            delay={0.7}
                        />
                        <StatCard
                            className="w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.667rem)] lg:w-[calc(20%-1rem)]"
                            title="Time Taken"
                            value={timeTaken}
                            type="default"
                            delay={0.8}
                        />
                    </div>
                </motion.div>

                {/* Rewards Unlocked */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="w-full mb-16 sm:mb-18 lg:mb-20"
                >
                    <h3 className="text-center text-zinc-400 font-medium mb-4 sm:mb-5 lg:mb-6 text-sm sm:text-base">Rewards Unlocked</h3>
                    <div className="flex overflow-x-auto pb-6 sm:pb-8 gap-3 sm:gap-4 px-3 sm:px-4 -mx-3 sm:-mx-4 scrollbar-hide snap-x justify-center" role="list">
                        <div className="snap-center shrink-0">
                            <RewardCard type="gems" value="+0 Gems" delay={1.1} />
                        </div>
                        <div className="snap-center shrink-0">
                            <RewardCard type="energy" value={`+${correctAnswers === result.totalPoints ? 5 : 0} Energy Bars`} delay={1.2} />
                        </div>

                    </div>
                </motion.div>

                {/* Rank Reveal */}
                <RankReveal climb={rankClimb} rank={globalRank} />

                {/* Question Review Section */}
                <div ref={reviewRef} className="w-full">
                    {result && <QuestionReview answers={result.answers} />}
                </div>

            </main>

            {/* Fixed Bottom CTA Bar */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ delay: 2, type: "spring", stiffness: 100, damping: 20 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-zinc-800/50 p-3 sm:p-4 md:p-5 lg:p-6 pb-safe"
                role="navigation"
                aria-label="Quiz result actions"
            >
                <div className="max-w-sm sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
                    <button
                        className="hidden md:flex px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl border border-zinc-700 text-zinc-400 font-medium hover:bg-zinc-900 transition-colors items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        aria-label="Share your score"
                    >
                        <Share2 className="w-4 h-4" aria-hidden="true" />
                        <span className="hidden lg:inline">Share Score</span>
                        <span className="lg:hidden">Share</span>
                    </button>

                    <button
                        onClick={() => router.push('/quizzes')}
                        className="flex-1 md:flex-none md:w-80 lg:w-96 py-3 sm:py-3.5 lg:py-4 rounded-xl bg-[#007AFF] text-white font-bold text-base sm:text-lg hover:bg-blue-600 transition-all shadow-[0_0_20px_rgba(0,122,255,0.4)] hover:shadow-[0_0_40px_rgba(0,122,255,0.6)] active:scale-95 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[44px]"
                        aria-label="Continue to dashboard"
                    >
                        Continue Journey
                    </button>

                    <button
                        className="hidden md:block text-zinc-500 hover:text-zinc-300 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded px-2 py-1"
                        onClick={scrollToReview}
                    >
                        Review Mistakes
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

