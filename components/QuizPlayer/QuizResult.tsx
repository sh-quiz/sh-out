'use client';

import { useEffect, useState } from 'react';
import { quizService, AttemptResult } from '@/lib/quiz';
import { useRouter } from 'next/navigation';

interface Props {
    attemptId: number;
}

export default function QuizResult({ attemptId }: Props) {
    const [result, setResult] = useState<AttemptResult | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        loadResult();
    }, [attemptId]);

    const loadResult = async () => {
        try {
            const data = await quizService.getResult(attemptId);
            setResult(data);
        } catch (err) {
            alert('Failed to load result');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-4">Loading result...</div>;
    if (!result) return <div className="p-4">Result not found</div>;

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold mb-2">{result.quiz.title}</h1>
                <div
                    className={`text-6xl font-bold mb-4 ${result.passed ? 'text-green-600' : 'text-red-600'
                        }`}
                >
                    {result.percentage.toFixed(1)}%
                </div>
                <p className="text-xl">
                    {result.passed ? '✅ Passed!' : '❌ Failed'}
                </p>
            </div>

            <div className="border border-gray-300 rounded p-6 space-y-3">
                <div className="flex justify-between">
                    <span className="text-gray-600">Score:</span>
                    <span className="font-semibold">
                        {result.score} / {result.totalPoints} points
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-600">Passing Score:</span>
                    <span className="font-semibold">{result.quiz.passingScore}%</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-600">Time Taken:</span>
                    <span className="font-semibold">
                        {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-600">Completed At:</span>
                    <span className="font-semibold">
                        {new Date(result.completedAt).toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    onClick={() => router.push('/')}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Back to Quizzes
                </button>
            </div>
        </div>
    );
}
