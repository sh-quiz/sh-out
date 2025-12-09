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
}

export default function JourneyPath({ quizzes }: JourneyPathProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const levels = useMemo(() => {
        const totalLevels = quizzes.length;

        // Find the index of the first non-completed quiz (Current Level)
        let currentFound = false;

        // Create nodes
        const nodes = quizzes.map((quiz, index) => {
            // 1-based level index for display
            const levelNum = index + 1;

            // Zigzag logic
            const x = 50 + 30 * Math.sin(levelNum * 0.5);

            // Y position: Start from bottom.
            const y = (totalLevels - 1 - index) * 180 + 100;

            // Determine status
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


    // Generate SVG Path
    const pathData = useMemo(() => {
        if (levels.length === 0) return "";

        // Sort by y to draw path from top to bottom?
        // SVG coordinates: y=0 is top.
        // Our levels have y calculated. Level N is at y=100 (top), Level 1 is at y=Max (bottom).
        // We should draw from top (Level N) down to Level 1? Or Level 1 up?
        // The previous code drew from levels[0] to end.
        // If levels are sorted by ID 1..N:
        // Level 1: y = (N-1)*180 + 100 (Bottom)
        // Level N: y = 0*180 + 100 (Top)
        // Drawing from 1 to N means drawing from Bottom to Top.
        // Let's sort levels by Y ascending (Top to Bottom) for the path.

        const sortedLevels = [...levels].sort((a, b) => a.position.y - b.position.y);

        let d = `M ${sortedLevels[0].position.x}% ${sortedLevels[0].position.y}`;

        for (let i = 0; i < sortedLevels.length - 1; i++) {
            const current = sortedLevels[i];
            const next = sortedLevels[i + 1];

            // Control points for smooth curve
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
            {/* Background Grid/Stars Effect */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]" /> */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                {/* Tiny stars */}
                {/* Simplified stars for performance/cleanliness in this edit */}
                <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full opacity-20" />
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white rounded-full opacity-20 animate-pulse"
                        style={{
                            width: Math.random() * 2 + 1 + 'px',
                            height: Math.random() * 2 + 1 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            animationDuration: Math.random() * 3 + 2 + 's'
                        }}
                    />
                ))}
            </div>

            {/* SVG Path Layer */}
            <svg className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none overflow-visible">
                {/* Glow Filter */}
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

                {/* The Path */}
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

            {/* Nodes and Cards Layer */}
            <div className="relative z-20 w-full h-full max-w-md mx-auto">
                {levels.map((level) => (
                    <div key={level.id}>
                        <LevelNode
                            title={level.title}
                            level={level.level}
                            status={level.status}
                            position={level.position}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
