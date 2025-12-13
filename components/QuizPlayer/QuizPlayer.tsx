'use client';

import { useEffect, useState, useCallback } from 'react';
import { quizService, QuizDetail, SubmitAnswerData } from '@/lib/quiz';
import { useRouter } from 'next/navigation';
import { Volume2, VolumeX, Flame, ChevronRight, Mic, MicOff, Users } from 'lucide-react';
import { useTTS } from '@/hooks/useTTS';
import { useSTT } from '@/hooks/useSTT';

interface Props {
    quizId: number;
    attemptId: number;
    attemptToken: string;
    isMultiplayer?: boolean;
    opponentScore?: number;
    onScoreUpdate?: (score: number) => void;
}

export default function QuizPlayer({
    quizId,
    attemptId,
    attemptToken,
    isMultiplayer = false,
    opponentScore = 0,
    onScoreUpdate
}: Props) {
    const [quiz, setQuiz] = useState<QuizDetail | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [submittedQuestions, setSubmittedQuestions] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [myScore, setMyScore] = useState(0); // Track local score for multiplayer
    const { speak, cancel } = useTTS();

    // Voice Command Handler
    const handleVoiceCommand = useCallback((text: string) => {
        console.log("[QuizPlayer] Voice command received:", text);
        if (!quiz) return;
        const currentQuestion = quiz.questions[currentQuestionIndex];
        const command = text.toLowerCase().trim();
        let selectedIndex = -1;

        const regexA = /^(a|option a|answer a|choice a)(\.| |$)/i;
        const regexB = /^(b|option b|answer b|choice b)(\.| |$)/i;
        const regexC = /^(c|option c|answer c|choice c)(\.| |$)/i;
        const regexD = /^(d|option d|answer d|choice d)(\.| |$)/i;

        if (regexA.test(command)) selectedIndex = 0;
        else if (regexB.test(command)) selectedIndex = 1;
        else if (regexC.test(command)) selectedIndex = 2;
        else if (regexD.test(command)) selectedIndex = 3;

        console.log("[QuizPlayer] Parsed command:", command, "| Selected Index:", selectedIndex);

        if (selectedIndex !== -1 && currentQuestion.choices && currentQuestion.choices[selectedIndex]) {
            const selectedChoiceId = currentQuestion.choices[selectedIndex].id;
            handleAnswer(currentQuestion.id, selectedChoiceId);
            setTimeout(() => {
                submitCurrentAnswer(selectedChoiceId);
            }, 800);
        } else if (command === 'submit' || command === 'next' || command === 'confirm' || command === 'go') {
            submitCurrentAnswer();
        } else if (command === 'skip') {
            handleSkip();
        } else {
            speak("Please choose a, b, c, or d from the options");
        }
    }, [quiz, currentQuestionIndex, answers]);

    const { startListening, stopListening, isListening, isSupported: isSTTSupported } = useSTT(handleVoiceCommand);

    const router = useRouter();

    useEffect(() => {
        loadQuizAndAttempt();
    }, [quizId, attemptId]);

    const loadQuizAndAttempt = async () => {
        try {
            // For multiplayer demo, if attemptId is not valid (e.g. 0), we might mock loading
            // But let's assume valid IDs for now or mock if fails
            let quizData, attemptData;

            try {
                [quizData, attemptData] = await Promise.all([
                    quizService.getById(quizId),
                    quizService.getResult(attemptId)
                ]);
            } catch (e) {
                console.warn("Retrying with mock data or handling failure...");
                if (quizId === 1) { // Fallback for demo
                    // Assuming we have some way to get quiz data, otherwise fail
                    throw e;
                }
                throw e;
            }

            setQuiz(quizData);

            // Process existing answers
            const initialAnswers: Record<number, any> = {};
            const submitted = new Set<number>();
            let score = 0;

            attemptData.answers.forEach((ans: any) => {
                submitted.add(ans.questionId);
                // Calculate initial score based on correct answers if available in attemptData
                // Ideally backend calculates score, but for UI we might need to track it locally or fetch it
                if (ans.isCorrect) score += 10; // Dummy score logic

                const question = quizData.questions.find((q: any) => q.id === ans.questionId);
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
            setMyScore(score);

            const firstUnansweredIndex = quizData.questions.findIndex((q: any) => !submitted.has(q.id));
            if (firstUnansweredIndex !== -1) {
                setCurrentQuestionIndex(firstUnansweredIndex);
            } else if (submitted.size === quizData.questions.length && submitted.size > 0) {
                setCurrentQuestionIndex(quizData.questions.length - 1);
            }

        } catch (err) {
            console.error(err);
            // alert('Failed to load quiz data'); 
        } finally {
            setLoading(false);
        }
    };


    // Effect to read question when index changes or quiz loads
    useEffect(() => {
        if (quiz && !loading && !isMuted) {
            readCurrentQuestion();
        } else {
            cancel();
        }
    }, [currentQuestionIndex, quiz, loading, isMuted]);

    // Timer logic
    useEffect(() => {
        setTimeLeft(60);
    }, [currentQuestionIndex]);

    useEffect(() => {
        if (!quiz) return;
        const currentQ = quiz.questions[currentQuestionIndex];
        const isQSubmitted = submittedQuestions.has(currentQ.id);

        if (isQSubmitted) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [quiz, submittedQuestions, currentQuestionIndex]);

    useEffect(() => {
        if (!quiz) return;
        const currentQ = quiz.questions[currentQuestionIndex];
        const isQSubmitted = submittedQuestions.has(currentQ.id);

        if (timeLeft === 0 && !isQSubmitted) {
            handleSkip();
        }
    }, [timeLeft, quiz, submittedQuestions, currentQuestionIndex]);

    // Cleanup speech on unmount
    useEffect(() => {
        return () => {
            cancel();
        };
    }, []);

    const readCurrentQuestion = () => {
        if (!quiz) return;
        const question = quiz.questions[currentQuestionIndex];

        let textToRead = question.text;

        if (question.type === 'single_choice' || question.type === 'true_false') {
            textToRead += ". Options are: ";
            question.choices?.forEach((choice: any, index: number) => {
                textToRead += `Option ${String.fromCharCode(65 + index)}. ${choice.text}. `;
            });
        }

        speak(textToRead);
    };

    const handleAnswer = (questionId: number, value: any) => {
        if (submittedQuestions.has(questionId)) return;
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };


    const submitCurrentAnswer = async (answerOverride?: any) => {
        if (!quiz || submitting) return;
        const question = quiz.questions[currentQuestionIndex];

        if (submittedQuestions.has(question.id)) {
            if (currentQuestionIndex < quiz.questions.length - 1) {
                setCurrentQuestionIndex((prev) => prev + 1);
            } else {
                await finishQuiz();
            }
            return;
        }

        const answer = answerOverride !== undefined ? answerOverride : answers[question.id];
        if (!answer) {
            alert('Please select an answer');
            return;
        }

        const choiceId = typeof answer === 'object' ? answer.choiceId : answer;
        if (choiceId === undefined || choiceId === null) {
            alert('Invalid answer. Please try again.');
            return;
        }

        setSubmitting(true);
        try {
            const submitData: SubmitAnswerData = {
                questionId: question.id,
                selectedChoiceId: choiceId,
                idempotencyKey: Math.random().toString(36).substring(7) + Date.now().toString(),
            };

            await quizService.submitAnswer(attemptId, attemptToken, submitData);
            setSubmittedQuestions(prev => new Set(prev).add(question.id));

            // Hacky score increment for demo
            // In real app, backend returns result correctness
            const newScore = myScore + 100; // Assume correct for visual pop
            setMyScore(newScore);
            if (onScoreUpdate) {
                onScoreUpdate(newScore);
            }

            if (currentQuestionIndex < quiz.questions.length - 1) {
                setCurrentQuestionIndex((prev) => prev + 1);
            } else {
                await finishQuiz();
            }
        } catch (err: any) {
            // Only alert if it's not a "mock" error or if we want to suppress for demo
            console.error("Submission failed", err);
            // Proceed anyway for demo flow if needed? No, let's keep it strict.
            alert(err.response?.data?.message || 'Failed to submit answer');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSkip = () => {
        if (!quiz) return;
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const finishQuiz = async () => {
        setSubmitting(true);
        try {
            await quizService.finishAttempt(attemptId, attemptToken);
            router.push(`/attempts/${attemptId}/result`);
        } catch (err: any) {
            console.error("Finish failed", err);
            router.push(`/attempts/${attemptId}/result`); // Redirect anyway
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading quiz...</div>;
    if (!quiz) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Quiz not found</div>;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
    const isSubmitted = submittedQuestions.has(currentQuestion.id);
    const currentAnswer = answers[currentQuestion.id];

    return (
        <div className="min-h-screen bg-black text-white flex flex-col font-sans relative">

            {/* Multiplayer HUD */}
            {isMultiplayer && (
                <div className="fixed top-28 right-6 z-50 flex flex-col gap-2 pointer-events-none">
                    <div className="bg-red-900/20 backdrop-blur-md border border-red-500/30 p-3 rounded-xl flex items-center gap-3 w-48">
                        <Users className="text-red-500 w-5 h-5" />
                        <div className="flex flex-col w-full">
                            <span className="text-xs text-red-400 font-bold uppercase tracking-wider">Opponent</span>
                            <div className="flex items-end justify-between">
                                <span className="text-xl font-mono font-bold text-white">{opponentScore}</span>
                                <div className="h-1.5 flex-1 ml-3 bg-red-900/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${Math.min((opponentScore || 0) / 10, 100)}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Header */}
            <div className="px-6 py-2 flex items-center justify-between max-w-5xl mx-auto w-full pt-20"> {/* added padding top to avoid header overlap */}
                <div className="flex flex-col w-full max-w-2xl">
                    <span className="text-gray-400 text-sm font-medium mb-2">
                        Question {currentQuestionIndex + 1} of {quiz.questions.length}
                    </span>
                    <div className="h-1.5 bg-gray-800 rounded-full w-full overflow-hidden">
                        <div
                            className="h-full bg-blue-900 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Timer Circle */}
                <div className="ml-6 relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            className="text-gray-800"
                        />
                        <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray={125.6}
                            strokeDashoffset={125.6 * (1 - timeLeft / 60)}
                            className="text-blue-900 transition-all duration-1000 ease-linear"
                        />
                    </svg>
                    <span className="absolute text-sm font-bold">{timeLeft}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-start pt-2 px-4 pb-20 max-w-4xl mx-auto w-full">
                {/* Question Card */}
                <div className="bg-[#0A0F16] border border-gray-900 rounded-3xl p-6 w-full mb-4 relative min-h-[200px] flex items-center justify-center text-center shadow-2xl">

                    {/* Controls container */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        {isSTTSupported && (
                            <button
                                onClick={() => isListening ? stopListening() : startListening()}
                                className={`p-2 rounded-full transition-colors ${isListening
                                    ? 'bg-red-500 hover:bg-red-600 animate-pulse text-white'
                                    : 'bg-blue-900 hover:bg-blue-950 text-white'}`}
                                title={isListening ? "Stop Listening" : "Enable Voice Control"}
                            >
                                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                            </button>
                        )}
                        <button
                            onClick={() => {
                                const newMutedState = !isMuted;
                                setIsMuted(newMutedState);
                                if (newMutedState) {
                                    cancel();
                                } else {
                                    setTimeout(() => readCurrentQuestion(), 100);
                                }
                            }}
                            className="p-2 bg-blue-900 rounded-full hover:bg-blue-950 transition-colors"
                        >
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-thin leading-tight text-gray-200 max-w-3xl">
                        {currentQuestion.text}
                    </h2>
                </div>

                {/* Options */}
                <div className="w-full space-y-2">
                    {(currentQuestion.type === 'single_choice' || currentQuestion.type === 'true_false') && (
                        currentQuestion.choices?.map((choice: any, index: number) => {
                            const isSelected = currentAnswer === choice.id;
                            const letter = String.fromCharCode(65 + index); // A, B, C, D...

                            return (
                                <button
                                    key={choice.id}
                                    onClick={() => handleAnswer(currentQuestion.id, choice.id)}
                                    disabled={isSubmitted}
                                    className={`w-full p-3 rounded-2xl flex items-center transition-all duration-200 group ${isSelected
                                        ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/20 border-transparent'
                                        : 'bg-[#0A0F16] border border-gray-800 text-gray-300 hover:bg-gray-900 hover:border-gray-700'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 transition-colors ${isSelected
                                        ? 'bg-white/20 text-white'
                                        : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700'
                                        }`}>
                                        {letter}
                                    </div>
                                    <span className="text-lg font-medium">{choice.text}</span>
                                </button>
                            );
                        })
                    )}

                    {currentQuestion.type === 'fill_in' && (
                        <div className="w-full">
                            <input
                                type="text"
                                className="w-full bg-[#0A0F16] border border-gray-800 text-white p-6 rounded-2xl text-xl focus:outline-none focus:border-blue-900 transition-colors placeholder-gray-600"
                                value={answers[currentQuestion.id]?.text || ''}
                                onChange={(e) => {
                                    const text = e.target.value;
                                    const match = currentQuestion.choices?.find(
                                        (c: any) => c.text.toLowerCase().trim() === text.toLowerCase().trim()
                                    );
                                    handleAnswer(currentQuestion.id, { text, choiceId: match?.id });
                                }}
                                placeholder="Type your answer here..."
                                disabled={isSubmitted}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-gray-900 p-3 z-10">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold text-lg">
                        <Flame className="text-orange-500 fill-orange-500" />
                        <span>{myScore}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleSkip}
                            className="px-6 py-3 text-gray-400 hover:text-white  transition-colors bg-gray-900/50 hover:bg-gray-900 rounded-3xl"
                        >
                            Skip
                        </button>
                        <button
                            onClick={() => submitCurrentAnswer()}
                            disabled={submitting}
                            className="px-8 py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-3xl transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Processing...' : (
                                <>
                                    {isSubmitted ? 'Next ' : 'Submit'}
                                    <ChevronRight size={20} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}