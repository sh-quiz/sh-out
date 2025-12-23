'use client';

import { useEffect, useState } from 'react';
import JourneyPath, { Quiz } from '@/components/Journey/JourneyPath';
import { ReactLenis } from 'lenis/react';
import { Play } from 'lucide-react';
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
            <div className="bg-transparent min-h-screen text-white overflow-hidden relative">
                <div className="absolute inset-0 z-0">
                    <div className="w-full h-full bg-cover bg-center opacity-30" style={{ backgroundImage: 'url("/brain/63bbd1f4-5752-4464-8755-2789be25175c/cyberpunk_quizzes_v3_bg_1766527439989.png")' }} />
                    <div className="absolute inset-0 bg-[#0B0E14] opacity-40" />
                    <div className="absolute inset-0 cyber-grid opacity-10" />
                </div>

                {loading ? (
                    <div className="flex h-screen items-center justify-center relative z-10">
                        <CyberLoader text="ACCESSING ARCHIVES..." />
                    </div>
                ) : (
                    <JourneyPath quizzes={quizzes} onStartQuiz={handleStartQuiz} />
                )}
            </div>
        </ReactLenis>
    );
}