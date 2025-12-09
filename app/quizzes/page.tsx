'use client';

import { useEffect, useState } from 'react';
import JourneyPath, { Quiz } from '@/components/Journey/JourneyPath';
import { ReactLenis } from 'lenis/react';
import { Play } from 'lucide-react';
import ParticleBackground from '@/components/ui/ParticleBackground';
import { useRouter } from 'next/navigation';
import { api } from '@/api/client';

export default function QuizzesPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const { data } = await api.get('/v1/quizzes');
                setQuizzes(data);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    // Scroll to bottom on load (where level 1 is)
    useEffect(() => {
        if (!loading && quizzes.length > 0) {
            const timer = setTimeout(() => {
                // Scroll to the bottom of the page where Level 1 usually starts in our logic
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [loading, quizzes]);

    // Determine current level based on progress
    const currentQuizIndex = quizzes.findIndex(q => !q.isCompleted);
    // If all completed, maybe just show the last one? or a "All Done" state. Use last one for now.
    const activeIndex = currentQuizIndex === -1 ? quizzes.length - 1 : currentQuizIndex;

    const currentQuiz = quizzes[activeIndex];
    const currentLevel = activeIndex + 1;

    const handleStartQuiz = async () => {
        if (!currentQuiz) return;

        setLoading(true);

        try {
            const { data } = await api.post(`/v1/quizzes/${currentQuiz.id}/start`);

            if (data.attemptId && data.attemptToken) {
                router.push(`/quizzes/${currentQuiz.id}?attemptId=${data.attemptId}&token=${data.attemptToken}`);
            } else {
                console.error('Invalid response format:', data);
                alert('Received invalid response from server.');
            }
        } catch (error: any) {
            console.error('Error starting quiz:', error);
            alert(`Failed to start quiz: ${error.response?.data?.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ReactLenis root>
            <div className="bg-black min-h-screen text-white overflow-hidden">
                <ParticleBackground />

                {loading ? (
                    <div className="flex h-screen items-center justify-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        <JourneyPath quizzes={quizzes} />

                        {/* Fixed Bottom Bar */}
                        <div className="fixed bottom-0 left-0 right-0 z-50 p-6 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none">
                            <div className="max-w-md mx-auto flex items-center justify-between pointer-events-auto">

                                {/* Left Pill */}
                                <div className="flex items-center gap-3 bg-[#161B22] border border-white/10 px-4 py-3 rounded-full backdrop-blur-md shadow-lg">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">
                                        {currentLevel}
                                    </div>
                                    <span className="text-sm font-medium text-white/90">Current Level</span>
                                </div>

                                {/* Right CTA */}
                                <button
                                    onClick={handleStartQuiz}
                                    className="group relative flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_30px_rgba(37,99,235,0.7)] transition-all active:scale-95"
                                >
                                    <span className="relative z-10">Start Level {currentLevel}</span>
                                    <Play className="w-4 h-4 fill-white relative z-10" />

                                    {/* Electric Pulse Border */}
                                    <div className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
                                </button>

                            </div>
                        </div>
                    </>
                )}

            </div>
        </ReactLenis>
    );
}