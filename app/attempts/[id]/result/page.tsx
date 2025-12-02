'use client';

import { use } from 'react';
import QuizResult from '@/components/QuizPlayer/QuizResult';

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const attemptId = parseInt(id);

    return <QuizResult attemptId={attemptId} />;
}
