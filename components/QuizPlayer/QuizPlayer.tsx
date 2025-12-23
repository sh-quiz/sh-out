'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { quizService, QuizDetail, SubmitAnswerData } from '@/lib/quiz';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Volume2, VolumeX, Mic, MicOff, Settings, AlertTriangle, CheckCircle2, XCircle, Info, Clock, Trophy, Zap, Flame, Gem, Users } from 'lucide-react';
import CyberLoader from '@/components/ui/CyberLoader';
import { useTTS } from '@/hooks/useTTS';
import { useSTT } from '@/hooks/useSTT';
import { useRouter } from 'next/navigation'; // Keep useRouter as it's used later

interface Props {
    quizId: number;
    attemptId: number;
    attemptToken: string;
    isMultiplayer?: boolean;
    opponentScore?: number;
    opponentCorrectCount?: number;
    isOpponentFinished?: boolean;
    onScoreUpdate?: (score: number, correctCount: number) => void;
    onMultiplayerFinish?: () => void;
    onLeave?: () => void;
}

export default function QuizPlayer({
    quizId,
    attemptId,
    attemptToken,
    isMultiplayer = false,
    opponentScore = 0,
    opponentCorrectCount,
    isOpponentFinished = false,
    onScoreUpdate,
    onMultiplayerFinish,
    onLeave
}: Props) {
    const [quiz, setQuiz] = useState<QuizDetail | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number | { text: string; choiceId: number }>>({});
    const [submittedQuestions, setSubmittedQuestions] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const submittingRef = useRef(false);
    const [isMuted, setIsMuted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [myScore, setMyScore] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const { speak, cancel } = useTTS();
    const [hasInteracted, setHasInteracted] = useState(false);

    const toggleMute = () => setIsMuted(prev => !prev);


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


            const [quizData, attemptData] = await Promise.all([
                quizService.getById(quizId),
                quizService.getResult(attemptId)
            ]);

            setQuiz(quizData);


            const initialAnswers: Record<number, number | { text: string; choiceId: number }> = {};
            const submitted = new Set<number>();
            let score = 0;
            let correct = 0;

            attemptData.answers.forEach((ans) => {
                submitted.add(ans.questionId);
                if (ans.isCorrect) {
                    score += ans.pointsAwarded || 10;
                    correct++;
                }

                const question = quizData.questions.find((q) => q.id === ans.questionId);
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

            const firstUnansweredIndex = quizData.questions.findIndex((q) => !submitted.has(q.id));
            if (firstUnansweredIndex !== -1) {
                setCurrentQuestionIndex(firstUnansweredIndex);
            } else if (submitted.size === quizData.questions.length && submitted.size > 0) {
                setCurrentQuestionIndex(quizData.questions.length - 1);
            }

        } catch (err) {
            console.error(err);

        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        if (quiz && !loading && !isMuted && hasInteracted) {
            readCurrentQuestion();
        } else {
            cancel();
        }
    }, [currentQuestionIndex, quiz, loading, isMuted, hasInteracted]);


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

            const hasAnswer = answers[currentQ.id] !== undefined;

            if (hasAnswer) {
                submitCurrentAnswer();
            } else {
                handleSkip();
            }
        }
    }, [timeLeft, quiz, submittedQuestions, currentQuestionIndex, answers]);


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
            question.choices?.forEach((choice, index: number) => {
                textToRead += `Option ${String.fromCharCode(65 + index)}. ${choice.text}. `;
            });
        }

        speak(textToRead);
    };

    const handleAnswer = (questionId: number, value: number | { text: string; choiceId: number }) => {
        if (submittedQuestions.has(questionId)) return;
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
        cancel();
    };


    const submitCurrentAnswer = async (answerOverride?: number | { text: string; choiceId: number }) => {
        if (!quiz || submittingRef.current) return;
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

        const choiceId = typeof answer === 'object' ? answer.choiceId : (answer as number);
        if (choiceId === undefined || choiceId === null) {
            alert('Invalid answer. Please try again.');
            return;
        }

        setSubmitting(true);
        submittingRef.current = true;
        try {
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

                const newCorrectCount = res.isCorrect ? correctCount + 1 : correctCount;
                onScoreUpdate(res.currentScore, newCorrectCount);
            }

            setSubmittedQuestions(prev => new Set(prev).add(question.id));

            if (currentQuestionIndex < quiz.questions.length - 1) {
                setCurrentQuestionIndex((prev) => prev + 1);
            } else {
                await finishQuiz();
            }
        } catch (err: any) {

            console.error("Submission failed", err);

            alert(err.response?.data?.message || 'Failed to submit answer');
        } finally {
            setSubmitting(false);
            submittingRef.current = false;
        }
    };

    const handleNextQuestion = () => {
        if (!quiz) return;
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            finishQuiz();
        }
    };

    const handleSkip = () => {
        handleNextQuestion();
    };

    const finishQuiz = async () => {
        setSubmitting(true);
        try {
            await quizService.finishAttempt(attemptId, attemptToken);



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
                if (onMultiplayerFinish) {
                    onMultiplayerFinish();
                }
                setShowResults(true);
            } else {
                router.push(`/attempts/${attemptId}/result`);
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center p-8">
                <CyberLoader text="PULLING MISSION DATA..." />
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 border border-danger-red/20 flex items-center justify-center mb-6">
                    <span className="text-danger-red font-black">!</span>
                </div>
                <h2 className="text-white font-orbitron uppercase tracking-widest mb-2">Quiz Not Found</h2>
                <p className="text-white/40 text-xs font-mono max-w-xs">// ERROR_SOURCE: NULL_REFERENCE_EXCEPTION</p>
                <button
                    onClick={() => router.push('/home')}
                    className="mt-8 px-6 py-2 border border-white/20 text-white text-[10px] font-bold uppercase hover:bg-white/5 transition-colors"
                >
                    Return to Home
                </button>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
    const currentAnswer = answers[currentQuestion.id];

    return (
        <div className="min-h-screen bg-black text-white flex flex-col font-mono relative overflow-hidden">
            {/* Cyber background effects */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 cyber-grid opacity-10" />
                <div className="scan-line" />
            </div>

            {/* Header */}
            <div className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-white/10 bg-black/50 backdrop-blur-md">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-white/40 tracking-[0.2em]">Atmosphere</span>
                        <div className="flex items-center gap-2 mt-1">
                            <button
                                onClick={toggleMute}
                                className="p-2 bg-white/5 hover:bg-white/10 cyber-border transition-colors group"
                            >
                                {isMuted ? <VolumeX size={14} className="group-hover:text-white" /> : <Volume2 size={14} className="group-hover:text-white" />}
                            </button>
                            {isSTTSupported && (
                                <button
                                    onClick={isListening ? stopListening : startListening}
                                    className={`p-2 cyber-border transition-all ${isListening ? 'bg-white text-black animate-pulse shadow-[0_0_15px_white]' : 'bg-white/5 hover:bg-white/10'}`}
                                >
                                    {isListening ? <Mic size={14} /> : <MicOff size={14} />}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="hidden sm:flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-white/40 tracking-[0.2em]">Progression</span>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-32 h-1.5 bg-white/10 cyber-border overflow-hidden">
                                <motion.div
                                    className="h-full bg-white shadow-[0_0_10px_white]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="text-[10px] font-mono text-white/60">{currentQuestionIndex + 1}/{quiz.questions.length}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase font-bold text-white/40 tracking-[0.2em]">Efficiency</span>
                        <span className="text-xl font-black mt-1 tracking-tighter shadow-white drop-shadow-sm">{myScore}</span>
                    </div>

                    <div className={`flex flex-col items-center justify-center w-14 h-14 cyber-border ${timeLeft <= 10 ? 'bg-white text-black animate-pulse' : 'bg-white/5'}`}>
                        <span className="text-xs font-black">{timeLeft}</span>
                        <span className="text-[8px] uppercase font-bold">Sec</span>
                    </div>
                </div>
            </div>

            {/* Main Content or Results */}
            {!showResults ? (
                <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-4xl mx-auto w-full relative z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                            transition={{ duration: 0.3 }}
                            className="w-full flex flex-col"
                        >
                            <div className="mb-12">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4 block">Question_Node_{currentQuestionIndex + 1}</span>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight uppercase italic font-orbitron">
                                    {currentQuestion.text}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                {currentQuestion.choices?.map((choice, index: number) => {
                                    const isSelected = currentAnswer === choice.id;
                                    const isChoiceSubmitted = submittedQuestions.has(currentQuestion.id);
                                    const isCorrect = choice.isCorrect;

                                    return (
                                        <motion.button
                                            key={choice.id}
                                            disabled={isChoiceSubmitted || submitting}
                                            onClick={() => handleAnswer(currentQuestion.id, choice.id)}
                                            whileHover={{ scale: isChoiceSubmitted ? 1 : 1.02, x: isChoiceSubmitted ? 0 : 4 }}
                                            whileTap={{ scale: isChoiceSubmitted ? 1 : 0.98 }}
                                            className={`
                                                relative p-6 text-left transition-all duration-300 group
                                                ${isSelected
                                                    ? 'bg-blitz-yellow/10 border-blitz-yellow'
                                                    : 'bg-carbon-grey/40 border-white/5 hover:border-white/20 hover:bg-carbon-grey/60'
                                                }
                                                border-l-4
                                                ${isChoiceSubmitted && isSelected && !isCorrect ? 'border-danger-red bg-danger-red/10 animate-shake' : ''}
                                                ${isChoiceSubmitted && isCorrect ? 'border-voltage-blue bg-voltage-blue/10' : ''}
                                            `}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`
                                                    w-8 h-8 rounded-none border flex items-center justify-center font-black text-xs transition-colors
                                                    ${isSelected ? 'bg-blitz-yellow text-black border-blitz-yellow' : 'bg-black text-white/40 border-white/10 group-hover:border-white/30'}
                                                    ${isChoiceSubmitted && isSelected && !isCorrect ? 'bg-danger-red border-danger-red text-white' : ''}
                                                    ${isChoiceSubmitted && isCorrect ? 'bg-voltage-blue border-voltage-blue text-black' : ''}
                                                `}>
                                                    {String.fromCharCode(65 + index)}
                                                </div>
                                                <span className={`font-bold tracking-tight ${isSelected ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                                                    {choice.text}
                                                </span>
                                            </div>

                                            {/* Status Indicators */}
                                            {isChoiceSubmitted && (
                                                <div className="absolute top-4 right-4 animate-in fade-in zoom-in">
                                                    {isCorrect ? (
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-voltage-blue uppercase tracking-widest">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-voltage-blue animate-pulse" />
                                                            Correct
                                                        </div>
                                                    ) : isSelected ? (
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-danger-red uppercase tracking-widest">
                                                            <div className="w-1.5 h-1.5 bg-danger-red animate-pulse" />
                                                            Failed
                                                        </div>
                                                    ) : null}
                                                </div>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Manual Submission Button */}
                            <AnimatePresence>
                                {!submittedQuestions.has(currentQuestion.id) && currentAnswer && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="mt-8 flex justify-center w-full"
                                    >
                                        <button
                                            disabled={submitting}
                                            onClick={() => submitCurrentAnswer()}
                                            className="px-12 py-4 bg-blitz-yellow text-black font-black uppercase tracking-[0.3em] text-sm hover:bg-blitz-yellow/90 transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)] cyber-border disabled:opacity-50"
                                        >
                                            {submitting ? 'UPLOADING...' : 'CONFIRM SELECTION'}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {!submitting && submittedQuestions.has(currentQuestion.id) && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-8 flex justify-center w-full"
                                >
                                    <button
                                        onClick={handleNextQuestion}
                                        className="px-12 py-4 bg-white/5 border border-white/20 text-white font-black uppercase tracking-[0.3em] text-sm hover:bg-white/10 transition-all flex items-center gap-3"
                                    >
                                        Proceed to Next Sector
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            ) : (
                <div className="fixed inset-0 z-[150] bg-black flex items-center justify-center p-4">
                    <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

                    <div className="relative w-full max-w-2xl bg-black border border-white/20 p-8 shadow-[0_0_50px_rgba(255,255,255,0.05)] cyber-border overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 font-mono text-xs uppercase">Terminal_Summary_V4.0</div>

                        <motion.h2
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-4xl font-black text-center mb-12 uppercase italic tracking-tighter"
                        >
                            Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20 animate-glow">Complete</span>
                        </motion.h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div className="border border-white/10 bg-white/5 p-6 flex flex-col items-center">
                                <div className="relative mb-4 group">
                                    <div className="w-20 h-20 bg-white/10 cyber-border flex items-center justify-center p-1">
                                        <div className="w-full h-full bg-white/5 overflow-hidden">
                                            <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=You`} alt="You" className="grayscale contrast-125" />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 -left-2 bg-white text-black text-[10px] font-black px-2 py-0.5 uppercase tracking-tighter">You</div>
                                </div>
                                <span className="text-4xl font-black mb-2 animate-glitch">{myScore}</span>
                                <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                                    {correctCount}/{quiz.questions.length} Questions Resolved
                                </div>
                            </div>

                            <div className={`border border-white/10 bg-white/5 p-6 flex flex-col items-center ${!isOpponentFinished ? 'animate-pulse opacity-50' : ''}`}>
                                <div className="relative mb-4 group">
                                    <div className="w-20 h-20 bg-white/10 border border-white/10 flex items-center justify-center p-1">
                                        <div className="w-full h-full bg-black overflow-hidden flex items-center justify-center">
                                            {isMultiplayer ? (
                                                <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=Opponent`} alt="Opponent" className="grayscale opacity-50" />
                                            ) : <Users className="text-white/20" size={32} />}
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-white/20 text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-tighter">
                                        {isMultiplayer ? 'Opponent' : 'Global Avg'}
                                    </div>
                                </div>
                                {isOpponentFinished || !isMultiplayer ? (
                                    <>
                                        <span className="text-4xl font-black mb-2 text-white/40">{opponentScore || Math.floor(myScore * 0.8)}</span>
                                        <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest text-center">
                                            Operational Data Logged
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-xs font-mono text-white/40 uppercase animate-pulse">Data Synchronizing...</div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => onLeave ? onLeave() : router.push('/home')}
                            className="w-full py-4 bg-white text-black text-xs font-black uppercase tracking-[0.3em] hover:bg-white/90 transition-all shadow-[0_0_20px_white]"
                        >
                            Exit_Simulation
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom Controls */}
            {!showResults && (
                <div className="relative z-10 w-full p-6 border-t border-white/10 bg-black/50 backdrop-blur-md">
                    <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                        <div className="hidden sm:flex items-center gap-4 text-white/40">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-white opacity-20" />
                                <span className="text-[10px] uppercase font-bold tracking-widest">Neural Link Active</span>
                            </div>
                            <div className="w-px h-4 bg-white/10" />
                            <span className="text-[10px] font-mono">Attempt_ID: {attemptId}</span>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                                onClick={handleSkip}
                                disabled={submitting || submittedQuestions.has(currentQuestion.id)}
                                className="px-8 py-3 bg-transparent border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all text-xs font-bold uppercase tracking-widest disabled:opacity-30"
                            >
                                Skip
                            </button>
                            <button
                                onClick={() => submitCurrentAnswer()}
                                disabled={submitting || submittedQuestions.has(currentQuestion.id) || !currentAnswer}
                                className="flex-1 sm:flex-none px-12 py-3 bg-white text-black hover:bg-white/90 transition-all text-xs font-black uppercase tracking-[0.2em] disabled:opacity-30 disabled:grayscale shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_white]"
                            >
                                {submitting ? 'Authenticating...' : 'Submit_Data'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Establishment Link Overlay */}
            {!hasInteracted && !loading && quiz && !showResults && (
                <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center p-4">
                    <div className="absolute inset-0 cyber-grid opacity-20" />
                    <div className="scan-line" />

                    <div className="relative bg-black border border-white/20 p-8 max-w-sm w-full text-center cyber-border overflow-hidden">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 blur-3xl rounded-full" />
                        <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-[0.2em] font-orbitron">Initialize Simulation</h2>
                        <p className="text-white/40 text-[10px] font-mono mb-8 uppercase tracking-widest leading-relaxed">
                            Neural link required. Click to establish connection and enable audio processing.
                        </p>
                        <button
                            onClick={() => setHasInteracted(true)}
                            className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white/90 transition-all shadow-[0_0_15px_white]"
                        >
                            Establish Link
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}