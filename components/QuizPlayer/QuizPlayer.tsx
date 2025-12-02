'use client';

import { useEffect, useState } from 'react';
import { quizService, QuizDetail, SubmitAnswerData, AttemptResult } from '@/lib/quiz';
import { useRouter } from 'next/navigation';

interface Props {
    quizId: number;
    attemptId: number;
    attemptToken: string;
}

export default function QuizPlayer({ quizId, attemptId, attemptToken }: Props) {
    const [quiz, setQuiz] = useState<QuizDetail | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [submittedQuestions, setSubmittedQuestions] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        loadQuizAndAttempt();
    }, [quizId, attemptId]);

    const loadQuizAndAttempt = async () => {
        try {
            const [quizData, attemptData] = await Promise.all([
                quizService.getById(quizId),
                quizService.getResult(attemptId)
            ]);

            setQuiz(quizData);

            // Process existing answers
            const initialAnswers: Record<number, any> = {};
            const submitted = new Set<number>();

            attemptData.answers.forEach((ans: any) => {
                submitted.add(ans.questionId);

                // Find the question to check type
                const question = quizData.questions.find(q => q.id === ans.questionId);
                if (question?.type === 'fill_in') {
                    initialAnswers[ans.questionId] = {
                        text: ans.yourAnswer.choiceText,
                        choiceId: ans.yourAnswer.choiceId
                    };
                } else {
                    initialAnswers[ans.questionId] = ans.yourAnswer.choiceId;
                }
            });

            setAnswers(initialAnswers);
            setSubmittedQuestions(submitted);

            // Find first unanswered question
            const firstUnansweredIndex = quizData.questions.findIndex(q => !submitted.has(q.id));
            if (firstUnansweredIndex !== -1) {
                setCurrentQuestionIndex(firstUnansweredIndex);
            } else if (submitted.size === quizData.questions.length && submitted.size > 0) {
                // All answered, go to last
                setCurrentQuestionIndex(quizData.questions.length - 1);
            }

        } catch (err) {
            console.error(err);
            alert('Failed to load quiz data');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (questionId: number, value: any) => {
        if (submittedQuestions.has(questionId)) return; // Prevent changing submitted answers
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const submitCurrentAnswer = async () => {
        if (!quiz) return;

        const question = quiz.questions[currentQuestionIndex];

        // If already submitted, just move next
        if (submittedQuestions.has(question.id)) {
            if (currentQuestionIndex < quiz.questions.length - 1) {
                setCurrentQuestionIndex((prev) => prev + 1);
            } else {
                await finishQuiz();
            }
            return;
        }

        const answer = answers[question.id];

        if (!answer) {
            alert('Please select an answer');
            return;
        }

        // For fill_in, answer is { text, choiceId }
        // For others, answer is choiceId (number)
        const choiceId = typeof answer === 'object' ? answer.choiceId : answer;

        if (!choiceId) {
            alert('Invalid answer. Please try again.');
            return;
        }

        setSubmitting(true);
        try {
            const submitData: SubmitAnswerData = {
                questionId: question.id,
                selectedChoiceId: choiceId,
                idempotencyKey: Math.random().toString(36).substring(7) + Date.now().toString(), // Simple unique key
            };

            await quizService.submitAnswer(attemptId, attemptToken, submitData);

            setSubmittedQuestions(prev => new Set(prev).add(question.id));

            if (currentQuestionIndex < quiz.questions.length - 1) {
                setCurrentQuestionIndex((prev) => prev + 1);
            } else {
                await finishQuiz();
            }
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to submit answer');
        } finally {
            setSubmitting(false);
        }
    };

    const finishQuiz = async () => {
        setSubmitting(true);
        try {
            await quizService.finishAttempt(attemptId, attemptToken);
            router.push(`/attempts/${attemptId}/result`);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to finish quiz');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-4">Loading quiz...</div>;
    if (!quiz) return <div className="p-4">Quiz not found</div>;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
    const isSubmitted = submittedQuestions.has(currentQuestion.id);

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">{quiz.title}</h1>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                    Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </p>
            </div>

            <div className="border border-gray-300 p-6 rounded mb-4">
                <h2 className="text-lg font-semibold mb-4">{currentQuestion.text}</h2>

                {/* Single Choice & True/False (Radio Buttons) */}
                {(currentQuestion.type === 'single_choice' || currentQuestion.type === 'true_false') && (
                    <div className="space-y-2">
                        {currentQuestion.choices?.map((choice: any) => (
                            <label key={choice.id} className={`flex items-center gap-2 p-2 border rounded cursor-pointer ${isSubmitted ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-50'}`}>
                                <input
                                    type="radio"
                                    name={`question-${currentQuestion.id}`}
                                    value={choice.id}
                                    checked={answers[currentQuestion.id] === choice.id}
                                    onChange={(e) => handleAnswer(currentQuestion.id, parseInt(e.target.value))}
                                    disabled={isSubmitted}
                                />
                                <span>{choice.text}</span>
                            </label>
                        ))}
                    </div>
                )}

                {/* Fill in the blanks (Text Input matching a choice) */}
                {currentQuestion.type === 'fill_in' && (
                    <div>
                        <input
                            type="text"
                            className={`w-full border border-gray-300 p-3 rounded ${isSubmitted ? 'bg-gray-100' : ''}`}
                            value={answers[currentQuestion.id]?.text || ''}
                            onChange={(e) => {
                                const text = e.target.value;
                                // Find matching choice (case-insensitive)
                                const match = currentQuestion.choices?.find(
                                    (c: any) => c.text.toLowerCase().trim() === text.toLowerCase().trim()
                                );
                                // Store both text (for UI) and choiceId (for submission)
                                // If no match, choiceId will be undefined
                                handleAnswer(currentQuestion.id, { text, choiceId: match?.id });
                            }}
                            placeholder="Type your answer here..."
                            disabled={isSubmitted}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Type the correct answer to fill in the blank.
                        </p>
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                {currentQuestionIndex > 0 && (
                    <button
                        onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                    >
                        Previous
                    </button>
                )}

                <button
                    onClick={submitCurrentAnswer}
                    disabled={submitting}
                    className="ml-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {submitting
                        ? 'Submitting...'
                        : currentQuestionIndex === quiz.questions.length - 1
                            ? 'Finish Quiz'
                            : isSubmitted ? 'Next Question' : 'Submit & Next'}
                </button>
            </div>
        </div>
    );
}
