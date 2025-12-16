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
    isOpponentFinished?: boolean;
    onScoreUpdate?: (score: number) => void;
    onMultiplayerFinish?: () => void;
}

export default function QuizPlayer({
    quizId,
    attemptId,
    attemptToken,
    isMultiplayer = false,
    opponentScore = 0,
    isOpponentFinished = false,
    onScoreUpdate,
    onMultiplayerFinish
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
    const [correctCount, setCorrectCount] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const { speak, cancel } = useTTS();
    const [hasInteracted, setHasInteracted] = useState(false);

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
            if (isMultiplayer) {
                // In multiplayer, we don't fetch a previous attempt result from persistence
                // We just load the quiz definition
                const quizData = await quizService.getById(quizId);
                setQuiz(quizData);
                setAnswers({});
                setSubmittedQuestions(new Set());
                setMyScore(0);

                // Reset to first question
                if (quizData.questions && quizData.questions.length > 0) {
                    setCurrentQuestionIndex(0);
                }
                setLoading(false);
                return;
            }

            const [quizData, attemptData] = await Promise.all([
                quizService.getById(quizId),
                quizService.getResult(attemptId)
            ]);

            setQuiz(quizData);

            // Process existing answers
            const initialAnswers: Record<number, any> = {};
            const submitted = new Set<number>();
            let score = 0;
            let correct = 0;

            attemptData.answers.forEach((ans: any) => {
                submitted.add(ans.questionId);
                if (ans.isCorrect) {
                    score += ans.pointsAwarded || 10;
                    correct++;
                }

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
            setCorrectCount(correct);

            const firstUnansweredIndex = quizData.questions.findIndex((q: any) => !submitted.has(q.id));
            if (firstUnansweredIndex !== -1) {
                setCurrentQuestionIndex(firstUnansweredIndex);
            } else if (submitted.size === quizData.questions.length && submitted.size > 0) {
                setCurrentQuestionIndex(quizData.questions.length - 1);
            }

        } catch (err) {
            console.error(err);
            // In demo mode or if error, we might just fail silently or show error
        } finally {
            setLoading(false);
        }
    };


    // Effect to read question when index changes or quiz loads
    useEffect(() => {
        if (quiz && !loading && !isMuted && hasInteracted) {
            readCurrentQuestion();
        } else {
            cancel();
        }
    }, [currentQuestionIndex, quiz, loading, isMuted, hasInteracted]);

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
            // Skip persistence in multiplayer for now to avoid invalid attempt errors
            if (!isMultiplayer) {
                const submitData: SubmitAnswerData = {
                    questionId: question.id,
                    selectedChoiceId: choiceId,
                    idempotencyKey: Math.random().toString(36).substring(7) + Date.now().toString(),
                };

                const res = await quizService.submitAnswer(attemptId, attemptToken, submitData);

                if (res.isCorrect) {
                    setCorrectCount(prev => prev + 1);
                }

                setMyScore(res.currentScore);
                if (onScoreUpdate) {
                    onScoreUpdate(res.currentScore);
                }
            } else {
                setSubmittedQuestions(prev => new Set(prev).add(question.id));

                // Hacky score increment for demo
                const newScore = myScore + 100; // Assume correct for visual pop
                setMyScore(newScore);
                // Assuming always correct in demo multiplayer for now for consistency with score
                setCorrectCount(prev => prev + 1);

                if (onScoreUpdate) {
                    onScoreUpdate(newScore);
                }
            }

            setSubmittedQuestions(prev => new Set(prev).add(question.id));

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
            if (!isMultiplayer) {
                await quizService.finishAttempt(attemptId, attemptToken);
            }
            // In multiplayer we might just want to show a "Game Over" screen or summary inside the modal?
            // For now, redirecting to result of dummy attempt will fail.
            // Let's redirect to categories for now or stay on screen.
            if (isMultiplayer) {
                if (onMultiplayerFinish) {
                    onMultiplayerFinish();
                }
                setShowResults(true);
                return;
            }
            router.push(`/attempts/${attemptId}/result`);
        } catch (err: any) {
            console.error("Finish failed", err);
            if (isMultiplayer) {
                setShowResults(true);
            } else {
                router.push(`/attempts/${attemptId}/result`);
            }
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
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-red-400 font-bold uppercase tracking-wider">Opponent</span>
                                {isOpponentFinished && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">DONE</span>}
                            </div>
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
                        <span>{myScore} <span className="text-gray-500 text-sm ml-2">({correctCount} / {quiz.questions.length})</span></span>
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


            {/* Match Results Overlay */}
            {
                showResults && (
                    <div className="fixed inset-0 z-[100] bg-[#020508]/95 backdrop-blur-xl flex items-center justify-center p-4">
                        <div className="bg-[#0A0F16] border border-white/5 rounded-[3rem] p-8 max-w-sm w-full text-center relative overflow-hidden shadow-2xl shadow-black/50">

                            {/* Header */}
                            <div className="relative z-10 mb-8">
                                <h2 className="text-xl font-bold text-white tracking-wider mb-1">
                                    MATCH COMPLETE
                                </h2>
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                                    BATTLE REPORT
                                </div>
                            </div>

                            {/* Result Status */}
                            <div className="relative z-10 flex flex-col items-center mb-8">
                                <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-3">
                                    {/* Icon based on result */}
                                    {myScore === opponentScore ? (
                                        <Users className="text-yellow-500 w-6 h-6" /> // Using Scale/Balance icon would be better if available, falling back to Users or standard
                                    ) : myScore > opponentScore ? (
                                        <Flame className="text-yellow-500 w-6 h-6" /> // Trophy equivalent
                                    ) : (
                                        <VolumeX className="text-gray-500 w-6 h-6" /> // Skull equivalent
                                    )}
                                </div>

                                {myScore === opponentScore ? (
                                    <div className="text-4xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-lg">
                                        DRAW
                                    </div>
                                ) : myScore > opponentScore ? (
                                    <div className="text-4xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-green-300 to-green-600 drop-shadow-lg">
                                        VICTORY
                                    </div>
                                ) : (
                                    <div className="text-4xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-red-300 to-red-600 drop-shadow-lg">
                                        DEFEAT
                                    </div>
                                )}
                            </div>

                            {/* Players Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                                {/* YOU */}
                                <div className="bg-[#131922] rounded-[2rem] p-4 flex flex-col items-center shadow-inner">
                                    <div className="relative mb-3">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-b from-blue-200 to-blue-100 p-0.5 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                                            <div className="w-full h-full rounded-full bg-gray-300 overflow-hidden">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=You`} alt="You" />
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-[#131922]">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">YOU</span>
                                    <span className="text-3xl font-black text-white mb-2">{myScore}</span>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1A212C] rounded-full">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                        <span className="text-[10px] text-gray-400 font-medium">{correctCount}/{quiz.questions.length} Correct</span>
                                    </div>
                                </div>

                                {/* OPPONENT */}
                                <div className="bg-[#131922] rounded-[2rem] p-4 flex flex-col items-center shadow-inner">
                                    <div className="relative mb-3">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-b from-pink-200 to-pink-100 p-0.5 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                                            <div className="w-full h-full rounded-full bg-gray-300 overflow-hidden">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Opponent`} alt="Opponent" />
                                            </div>
                                        </div>
                                        {/* Status icon for opponent - can be dynamic, hardcoded to X for visual match to design */}
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-[#131922]">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-white"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">OPPONENT</span>
                                    <span className="text-3xl font-black text-white mb-2">{opponentScore}</span>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1A212C] rounded-full">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                        {/* Randomized or calculated stat for opponent */}
                                        <span className="text-[10px] text-gray-400 font-medium">{Math.floor((opponentScore / 100) * quiz.questions.length) || 0}/{quiz.questions.length} Correct</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="relative z-10 w-full space-y-4">
                                <button
                                    onClick={() => router.push('/categories')}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-900/40 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                                >
                                    Return directly to Lobby
                                    <ChevronRight size={14} />
                                </button>

                                <button
                                    onClick={() => alert("Rematch requested!")} // Placeholder functionality
                                    className="flex items-center justify-center gap-2 text-gray-500 text-xs font-medium hover:text-white transition-colors"
                                >
                                    <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" /></svg>
                                    </div>
                                    Request Rematch
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Interaction Overlay to enable Autoplay */}
            {!hasInteracted && !loading && quiz && !showResults && (
                <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-[#0A0F16] border border-blue-500/30 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl shadow-blue-900/40 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
                        <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Start Quiz</h2>
                        <p className="text-gray-400 mb-8 relative z-10">Click below to enable audio and start the challenge.</p>
                        <button
                            onClick={() => setHasInteracted(true)}
                            className="relative z-10 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all transform hover:scale-[1.02] shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2"
                        >
                            <span className="uppercase tracking-widest">Start Now</span>
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div >
    );
}