'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, AlertCircle, Lightbulb } from 'lucide-react';
import { AnswerDetail } from '@/lib/quiz';

interface Props {
    answers: AnswerDetail[];
}

export default function QuestionReview({ answers }: Props) {
    return (
        <div className="w-full max-w-4xl mx-auto mt-12 mb-24 space-y-8">
            <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
                <h3 className="text-2xl font-bold text-white">Question Review</h3>
                <div className="flex gap-4 text-sm text-zinc-400">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>{answers.filter(a => a.isCorrect).length} Correct</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span>{answers.filter(a => !a.isCorrect).length} Incorrect</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {answers.map((answer, index) => (
                    <ReviewItem key={answer.questionId} answer={answer} index={index} />
                ))}
            </div>
        </div>
    );
}

function ReviewItem({ answer, index }: { answer: AnswerDetail; index: number }) {
    const [isOpen, setIsOpen] = useState(!answer.isCorrect); // Auto-open wrong answers

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
                rounded-2xl border overflow-hidden transition-colors duration-200
                ${answer.isCorrect
                    ? 'bg-zinc-900/30 border-zinc-800 hover:border-zinc-700'
                    : 'bg-red-950/10 border-red-900/30 hover:border-red-900/50'}
            `}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left p-6 flex items-start gap-4 hover:bg-white/5 transition-colors"
            >
                <div className={`
                    mt-1 shrink-0 w-8 h-8 rounded-full flex items-center justify-center border
                    ${answer.isCorrect
                        ? 'bg-green-500/10 border-green-500/50 text-green-500'
                        : 'bg-red-500/10 border-red-500/50 text-red-500'}
                `}>
                    {answer.isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="text-sm font-medium text-zinc-400">Question {index + 1}</span>
                        {answer.isCorrect && (
                            <span className="text-sm font-medium text-green-500">+{answer.pointsAwarded} pts</span>
                        )}
                    </div>
                    <h4 className="text-lg font-medium text-zinc-100 leading-snug">{answer.questionText}</h4>
                </div>

                <div className="mt-1 text-zinc-500">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 pt-0 border-t border-zinc-800/50 space-y-6">

                            {/* Choices Section */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                {/* User Choice */}
                                <div className={`
                                    p-4 rounded-xl border
                                    ${answer.isCorrect
                                        ? 'bg-green-500/10 border-green-500/30'
                                        : 'bg-red-500/10 border-red-500/30'}
                                `}>
                                    <div className="text-xs uppercase tracking-wider font-semibold opacity-70 mb-1">
                                        Your Answer
                                    </div>
                                    <div className={`font-medium ${answer.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                        {answer.yourAnswer.choiceText}
                                    </div>
                                </div>

                                {/* Correct Choice (if wrong) */}
                                {!answer.isCorrect && answer.correctAnswer && (
                                    <div className="p-4 rounded-xl border bg-green-500/10 border-green-500/30">
                                        <div className="text-xs uppercase tracking-wider font-semibold opacity-70 mb-1 text-green-400">
                                            Correct Answer
                                        </div>
                                        <div className="font-medium text-green-400">
                                            {answer.correctAnswer.text}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Explanation and Solution */}
                            <div className="space-y-4">
                                {answer.explanation && (
                                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
                                        <div className="flex items-center gap-2 text-zinc-300 font-medium mb-2">
                                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                                            Explanation
                                        </div>
                                        <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">
                                            {answer.explanation}
                                        </p>
                                    </div>
                                )}

                                {answer.solution && (
                                    <div className="bg-blue-950/20 rounded-xl p-4 border border-blue-900/30">
                                        <div className="flex items-center gap-2 text-blue-300 font-medium mb-2">
                                            <AlertCircle className="w-4 h-4 text-blue-400" />
                                            Step-by-Step Solution
                                        </div>
                                        <p className="text-blue-100/80 text-sm leading-relaxed whitespace-pre-line font-mono">
                                            {answer.solution}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
