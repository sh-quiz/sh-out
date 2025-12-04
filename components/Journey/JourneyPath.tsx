'use client';

import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import LevelNode from './LevelNode';
import TopicCard from './TopicCard';
import { Calculator, Atom, Zap, Brain, Dna, Globe } from 'lucide-react';

// Mock Data Generation
const generateLevels = () => {
    const levels = [];
    const totalLevels = 50;
    const currentLevel = 13;

    for (let i = 1; i <= totalLevels; i++) {
        // Zigzag pattern logic
        // x position oscillates between 20% and 80%
        const x = 50 + 30 * Math.sin(i * 0.5);
        const y = (totalLevels - i) * 150 + 200; // Start from bottom up visually, but DOM renders top down. 
        // Actually, for a scrolling journey, usually level 1 is at the bottom or top?
        // Reference image shows 13 as current, 12 below it, 11 below that. So 1 is at the bottom.
        // We want to scroll UP to progress? Or scroll DOWN to progress?
        // "Start Level 13" suggests we are at 13.
        // Let's assume standard vertical scroll: Top = Future, Bottom = Past.
        // So Level 50 is at y=0, Level 1 is at y=MAX.

        let status: 'completed' | 'current' | 'locked' = 'locked';
        if (i < currentLevel) status = 'completed';
        if (i === currentLevel) status = 'current';

        levels.push({
            id: i,
            level: i,
            status,
            position: { x, y: 0 }, // y will be calculated relative to container
        });
    }
    // Reverse to render from top (Level 50) to bottom (Level 1)
    return levels.reverse().map((l, index) => ({
        ...l,
        position: { ...l.position, y: index * 180 + 100 } // Spacing
    }));
};

const levels = generateLevels();

// Mock Topics
const topics = [
    {
        levelId: 13,
        title: "Limits & Continuity",
        subtitle: "Master the foundational concepts of calculus.",
        icon: <Zap className="w-4 h-4" />,
        accentColor: "bg-blue-500",
        align: "right" as const
    },
    {
        levelId: 9,
        title: "Atomic Structure",
        subtitle: "Explore the building blocks of the universe.",
        icon: <Atom className="w-4 h-4" />,
        accentColor: "bg-amber-500",
        align: "left" as const
    },
    {
        levelId: 5,
        title: "Kinematics",
        subtitle: "Motion in one dimension.",
        icon: <Globe className="w-4 h-4" />,
        accentColor: "bg-emerald-500",
        align: "right" as const
    }
];

export default function JourneyPath() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Generate SVG Path
    const pathData = useMemo(() => {
        if (levels.length === 0) return "";

        // Simple curve connecting points
        let d = `M ${levels[0].position.x}% ${levels[0].position.y}`;

        for (let i = 0; i < levels.length - 1; i++) {
            const current = levels[i];
            const next = levels[i + 1];

            // Control points for smooth curve
            const cp1x = current.position.x;
            const cp1y = current.position.y + 90;
            const cp2x = next.position.x;
            const cp2y = next.position.y - 90;

            d += ` C ${cp1x}% ${cp1y}, ${cp2x}% ${cp2y}, ${next.position.x}% ${next.position.y}`;
        }

        return d;
    }, []);

    return (
        <div ref={containerRef} className="relative w-full min-h-screen pb-40">
            {/* Background Grid/Stars Effect */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                {/* Tiny stars */}
                {Array.from({ length: 50 }).map((_, i) => (
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
                            level={level.level}
                            status={level.status}
                            position={level.position}
                        />

                        {/* Check for Topic Card */}
                        {topics.find(t => t.levelId === level.level) && (
                            <TopicCard
                                {...topics.find(t => t.levelId === level.level)!}
                                position={level.position}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
