'use client';

import { useEffect, useState } from 'react';
import { quizService, Quiz } from '@/lib/quiz';
import { useRouter } from 'next/navigation';

export default function QuizList() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        loadQuizzes();
    }, []);

    const loadQuizzes = async () => {
        try {
            const data = await quizService.getAll();
            setQuizzes(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load quizzes');
        } finally {
            setLoading(false);
        }
    };

    const startQuiz = async (quizId: number) => {
        try {
            const attempt = await quizService.startAttempt(quizId);
            router.push(`/quizzes/${quizId}?attemptId=${attempt.attemptId}&token=${attempt.attemptToken}`);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to start quiz');
        }
    };

    if (loading) return <div className="p-4">Loading quizzes...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Available Quizzes</h1>

            {quizzes.length === 0 ? (
                <p>No quizzes available</p>
            ) : (
                <div className="space-y-4">
                    {quizzes.map((quiz) => (
                        <div key={quiz.id} className="border border-gray-300 p-4 rounded">
                            <h2 className="text-xl font-semibold">{quiz.title}</h2>
                            <p className="text-gray-600 my-2">{quiz.description}</p>

                            <div className="flex gap-4 text-sm text-gray-500 mb-3">
                                <span>Time: {quiz.timeLimit} minutes</span>
                                <span>Passing Score: {quiz.passingScore}%</span>
                                {quiz.totalQuestions && <span>Questions: {quiz.totalQuestions}</span>}
                            </div>

                            {quiz.userAttemptCount !== undefined && (
                                <p className="text-sm text-gray-500 mb-3">
                                    Attempts: {quiz.userAttemptCount}
                                    {quiz.userBestScore !== undefined && ` | Best Score: ${quiz.userBestScore}%`}
                                </p>
                            )}

                            <button
                                onClick={() => startQuiz(quiz.id)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Start Quiz
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
