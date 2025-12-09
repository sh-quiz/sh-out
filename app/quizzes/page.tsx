'use client';

import { useEffect, useState } from 'react';
import JourneyPath, { Quiz } from '@/components/Journey/JourneyPath';
import { ReactLenis } from 'lenis/react';
import { Play } from 'lucide-react';
import ParticleBackground from '@/components/ui/ParticleBackground';
import { useRouter } from 'next/navigation';

export default function QuizzesPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                // Using generic fetch for now
                const res = await fetch('http://localhost:4000/v1/quizzes');
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
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

    const currentLevel = 1; // Default to 1 for now, or derive from logic
    const currentQuiz = quizzes.length > 0 ? quizzes[0] : null;

    const handleStartQuiz = async () => {
        if (!currentQuiz) return;

        setLoading(true); // Re-use loading or add a new state, re-using for now usually fine but better to have separate. 
        // Actually rendering relies on loading=false. If I set loading=true, the entire list disappears.
        // Let's NOT set the main loading state. Maybe just a local boolean if we wanted disable button.
        
        try {
            const res = await fetch(`http://localhost:4000/v1/quizzes/${currentQuiz.id}/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` // If we had one
                }
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error('Failed to start quiz:', errorData);
                alert(`Failed to start quiz: ${errorData.message || 'Unknown error'}`);
                return;
            }

            const data = await res.json();
            // Expected: { attemptId: number, attemptToken: string, ... }
            if (data.attemptId && data.attemptToken) {
                router.push(`/quizzes/${currentQuiz.id}?attemptId=${data.attemptId}&token=${data.attemptToken}`);
            } else {
                console.error('Invalid response format:', data);
                alert('Received invalid response from server.');
            }
        } catch (error) {
            console.error('Error starting quiz:', error);
            alert('An error occurred while starting the quiz.');
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