'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/api/client';
import { Lesson, Challenge } from '@/app/types/course';
import { ChevronRight, Check, X } from 'lucide-react';

interface Props {
    lessonId: number;
}

export default function LessonPlayer({ lessonId }: Props) {
    const router = useRouter();
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
    const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ correct: boolean; message: string; explanation?: string } | null>(null);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const { data } = await api.get(`/v1/courses/lessons/${lessonId}`);
                setLesson(data);
            } catch (error) {
                console.error("Failed to load lesson:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLesson();
    }, [lessonId]);

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Lesson...</div>;
    if (!lesson) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Lesson Not Found</div>;

    const currentChallenge = lesson.challenges[currentChallengeIndex];
    if (!currentChallenge) {
        // No more challenges - Lesson Complete
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 space-y-6">
                <h1 className="text-4xl font-bold text-green-500">Lesson Complete!</h1>
                <p className="text-gray-400">You have finished {lesson.title}.</p>
                <button
                    onClick={() => router.push('/quizzes')}
                    className="px-8 py-3 bg-blue-600 rounded-full font-bold hover:bg-blue-500 transition"
                >
                    Return to Journey
                </button>
            </div>
        );
    }

    const handleOptionSelect = (id: number) => {
        if (feedback) return; // Prevent changing after submission
        setSelectedOptionId(id);
    };

    const handleSubmit = async () => {
        if (!selectedOptionId) return;
        setSubmitting(true);

        try {
            const res = await api.post('/v1/courses/challenges/check', {
                challengeId: currentChallenge.id,
                optionId: selectedOptionId
            });

            setFeedback({
                correct: res.data.correct, // Note: verify standard response structure from axios wrapper
                message: res.data.message,
                explanation: res.data.explanation
            });

        } catch (error) {
            console.error(error);
            alert("Error submitting answer");
        } finally {
            setSubmitting(false);
        }
    };

    const handleNext = () => {
        setFeedback(null);
        setSelectedOptionId(null);
        setCurrentChallengeIndex(prev => prev + 1);
    };

    const progress = ((currentChallengeIndex) / lesson.challenges.length) * 100;

    return (
        <div className="min-h-screen bg-black text-white flex flex-col font-sans">
            {/* Header / Progress */}
            <div className="fixed top-0 left-0 right-0 p-4 bg-black/80 backdrop-blur z-10">
                <div className="max-w-2xl mx-auto flex flex-col gap-2">
                    <div className="flex justify-between text-xs text-gray-400 uppercase tracking-widest">
                        <span>{lesson.title}</span>
                        <span>{currentChallengeIndex + 1} / {lesson.challenges.length}</span>
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 pt-24 pb-32 max-w-2xl mx-auto w-full">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 leading-tight">
                    {currentChallenge.question}
                </h2>

                <div className="w-full space-y-3">
                    {currentChallenge.options.map((option: any) => {
                        const isSelected = selectedOptionId === option.id;
                        let statusClass = "border-gray-800 hover:bg-gray-900";

                        if (feedback) {
                            if (option.correct) statusClass = "bg-green-900/30 border-green-500 text-green-100";
                            else if (isSelected && !feedback.correct) statusClass = "bg-red-900/30 border-red-500 text-red-100";
                            else statusClass = "border-gray-800 opacity-50";
                        } else if (isSelected) {
                            statusClass = "bg-blue-900/30 border-blue-500 text-blue-100";
                        }

                        return (
                            <button
                                key={option.id}
                                onClick={() => handleOptionSelect(option.id)}
                                disabled={!!feedback}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${statusClass}`}
                            >
                                {option.text}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Footer / Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur border-t border-gray-900">
                <div className="max-w-2xl mx-auto space-y-4">
                    {feedback && (
                        <div className={`p-4 rounded-xl ${feedback.correct ? 'bg-green-900/20 text-green-200' : 'bg-red-900/20 text-red-200'}`}>
                            <div className="flex items-center gap-2 font-bold mb-1">
                                {feedback.correct ? <Check size={20} /> : <X size={20} />}
                                {feedback.correct ? 'Excellent!' : 'Incorrect'}
                            </div>
                            <p className="text-sm opacity-90">{feedback.explanation}</p>
                        </div>
                    )}

                    {!feedback ? (
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedOptionId || submitting}
                            className="w-full py-4 bg-blue-600 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-blue-900/20"
                        >
                            {submitting ? 'Checking...' : 'Check Answer'}
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition shadow-lg ${feedback.correct ? 'bg-green-600 hover:bg-green-500 shadow-green-900/20' : 'bg-gray-700 hover:bg-gray-600'}`}
                        >
                            Continue
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
