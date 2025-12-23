'use client';

import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import LevelNode from './LevelNode';
import TopicCard from './TopicCard';
import { Calculator, Atom, Zap, Brain, Dna, Globe } from 'lucide-react';

export interface Quiz {
    id: number;
    title: string;
    description: string;
    isCompleted?: boolean;
}

interface JourneyPathProps {
    quizzes: Quiz[];
    onStartQuiz?: (id: number) => void;
}

export default function JourneyPath({ quizzes, onStartQuiz }: JourneyPathProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const levels = useMemo(() => {
        const totalLevels = quizzes.length;


        let currentFound = false;


        const nodes = quizzes.map((quiz, index) => {

            const levelNum = index + 1;


            const x = 50 + 30 * Math.sin(levelNum * 0.5);


            const y = (totalLevels - 1 - index) * 180 + 100;


            let status: 'completed' | 'current' | 'locked' = 'locked';

            if (quiz.isCompleted) {
                status = 'completed';
            } else if (!currentFound) {
                status = 'current';
                currentFound = true;
            } else {
                status = 'locked';
            }

            return {
                id: quiz.id,
                title: quiz.title,
                level: levelNum,
                status,
                position: { x, y }
            };
        });

        return nodes;
    }, [quizzes]);



    const pathData = useMemo(() => {
        if (levels.length === 0) return "";












        const sortedLevels = [...levels].sort((a, b) => a.position.y - b.position.y);

        let d = `M ${sortedLevels[0].position.x}% ${sortedLevels[0].position.y}`;

        for (let i = 0; i < sortedLevels.length - 1; i++) {
            const current = sortedLevels[i];
            const next = sortedLevels[i + 1];


            const cp1x = current.position.x;
            const cp1y = current.position.y + 90;
            const cp2x = next.position.x;
            const cp2y = next.position.y - 90;

            d += ` C ${cp1x}% ${cp1y}, ${cp2x}% ${cp2y}, ${next.position.x}% ${next.position.y}`;
        }

        return d;
    }, [levels]);

    return (
        <div ref={containerRef} className="relative w-full min-h-screen pb-40">

            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            </div>


            <svg className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none overflow-visible">

                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#007AFF" stopOpacity="0" />
                        <stop offset="50%" stopColor="#007AFF" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#007AFF" stopOpacity="0" />
                    </linearGradient>
                </defs>


                <path
                    d={pathData}
                    fill="none"
                    stroke="url(#pathGradient)"
                    strokeWidth="2"
                    strokeDasharray="4 6"
                    className="animate-pulse-slow"
                    style={{ filter: 'url(#glow)' }}
                />
            </svg>


            <div className="relative z-20 w-full h-full max-w-md mx-auto">
                {levels.map((level) => (
                    <div key={level.id}>
                        <LevelNode
                            title={level.title}
                            level={level.level}
                            status={level.status}
                            position={level.position}
                            onStart={() => onStartQuiz?.(level.id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
