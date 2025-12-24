'use client';

import { useEffect, useState } from 'react';
import JourneyPath, { Quiz } from '@/components/Journey/JourneyPath';
import { ReactLenis } from 'lenis/react';
import { Play, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/api/client';
import CyberLoader from '@/components/ui/CyberLoader';

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


    const handleStartQuiz = async (quizId: number) => {
        setLoading(true);
        try {
            const { data } = await api.post(`/v1/quizzes/${quizId}/start`);
            if (data.attemptId && data.attemptToken) {
                router.push(`/quizzes/${quizId}?attemptId=${data.attemptId}&token=${data.attemptToken}`);
            } else {
                console.error('Invalid response format:', data);
                alert('Received invalid response from server.');
                setLoading(false);
            }
        } catch (error: any) {
            console.error('Error starting quiz:', error);
            alert(`Failed to start quiz: ${error.response?.data?.message || 'Unknown error'}`);
            setLoading(false);
        }
    };

    return (
        <ReactLenis root>
            <div className="relative min-h-screen text-white overflow-x-hidden">
                <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
                    {loading ? (
                        <div className="flex h-[calc(100vh-250px)] items-center justify-center">
                            <CyberLoader text="ACCESSING ARCHIVES..." />
                        </div>
                    ) : (
                        <JourneyPath
                            quizzes={quizzes}
                            onStartQuiz={handleStartQuiz}
                        />
                    )}
                </div>
            </div>
        </ReactLenis>
    );
}