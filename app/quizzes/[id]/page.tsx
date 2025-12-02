'use client';

import { use } from 'react';
import { useSearchParams } from 'next/navigation';
import QuizPlayer from '@/components/QuizPlayer/QuizPlayer';

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
    const searchParams = useSearchParams();
    const attemptId = searchParams.get('attemptId');
    const token = searchParams.get('token');

    const { id } = use(params);
    const quizId = parseInt(id);

    if (!attemptId || !token) {
        return (
            <div className="p-4 text-center">
                <p className="text-red-600">Invalid quiz attempt</p>
            </div>
        );
    }

    return (
        <QuizPlayer
            quizId={quizId}
            attemptId={parseInt(attemptId)}
            attemptToken={token}
        />
    );
}
