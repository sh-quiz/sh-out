'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';

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

const createHexPath = (cx: number, cy: number, size: number) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = cx + size * Math.cos(angle);
        const y = cy + size * Math.sin(angle);
        points.push(`${x},${y}`);
    }
    return `M ${points.join(' L ')} Z`;
};

const HexNode = ({ node, isHovered, onHover, onStart, selected }: {
    node: any,
    isHovered: boolean,
    onHover: (node: any | null) => void,
    onStart?: (id: number) => void,
    selected: boolean
}) => {
    const { type, level, x, y, quiz } = node;
    const scale = isHovered ? 1.1 : 1;
    const isBoss = type === 'boss';
    const size = isBoss ? 100 : 80;

    // Color schemes
    const colors: any = {
        locked: { base: '#2a3544', top: '#3a4554', glow: 'none' },
        completed: { base: '#1e3a52', top: '#00ffcc', glow: '#00ffcc' },
        active: { base: '#4a3f1e', top: '#ffd700', glow: '#ffd700' },
        boss: { base: '#4a3f1e', top: '#ffd700', glow: '#ffd700' }
    };

    const color = colors[type];
    const hasGlow = type !== 'locked';

    return (
        <g
            transform={`translate(${x}, ${y}) scale(${scale})`}
            style={{ cursor: type !== 'locked' ? 'pointer' : 'default', transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            onMouseEnter={() => onHover(node)}
            onMouseLeave={() => onHover(null)}
            onClick={() => type !== 'locked' && onStart?.(quiz.id)}
        >
            {/* Glow effect */}
            {hasGlow && (
                <>
                    <circle cx="0" cy="0" r={size * 0.7} fill={color.glow} opacity="0.3" filter="url(#glow)" />
                    <circle cx="0" cy="0" r={size * 0.5} fill={color.glow} opacity="0.2" filter="url(#glow)" />
                </>
            )}

            {/* Base shadow */}
            <ellipse cx="2" cy="12" rx={size * 0.5} ry={size * 0.15} fill="rgba(0,0,0,0.5)" />

            {/* Base hexagon layers (pseudo-3D stack) */}
            <path
                d={createHexPath(0, 0, size * 0.55)}
                fill={color.base}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="2"
            />
            <path
                d={createHexPath(0, -4, size * 0.52)}
                fill={color.base}
                stroke="rgba(0,0,0,0.2)"
                strokeWidth="1.5"
            />
            <path
                d={createHexPath(0, -8, size * 0.49)}
                fill={color.base}
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="1"
            />

            {/* Top hexagon (colored) */}
            <path
                d={createHexPath(0, isBoss ? -16 : -13, size * 0.45)}
                fill={color.top}
                stroke={hasGlow ? color.glow : '#2a3544'}
                strokeWidth={hasGlow ? '2' : '1'}
                filter={hasGlow ? 'url(#innerGlow)' : 'none'}
            />

            {/* Inner ring detail */}
            <path
                d={createHexPath(0, isBoss ? -16 : -13, size * 0.35)}
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
            />

            {/* Icon */}
            {type === 'completed' && (
                <g transform="translate(-14, -22)">
                    <path d="M 2,12 L 10,20 L 26,4" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </g>
            )}

            {type === 'active' && (
                <text x="0" y="-12" textAnchor="middle" fontSize="30" dominantBaseline="middle">⚡</text>
            )}

            {type === 'boss' && (
                <text x="0" y="-12" textAnchor="middle" fontSize="35" dominantBaseline="middle">👑</text>
            )}

            {type === 'locked' && (
                <g transform="translate(-10, -24)">
                    <rect x="4" y="10" width="12" height="10" rx="1" fill="#555" />
                    <path d="M 7,10 L 7,6 A 3,3 0 0,1 13,6 L 13,10" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" />
                </g>
            )}

            {/* Floating particles for active/boss */}
            {(type === 'active' || type === 'boss') && (
                <g className="pointer-events-none">
                    <circle cx="-30" cy="-25" r="2.5" fill={color.glow}>
                        <animate attributeName="cy" values="-25;-35;-25" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="30" cy="-20" r="2.5" fill={color.glow}>
                        <animate attributeName="cy" values="-20;-30;-20" dur="2.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="0" cy="-45" r="3" fill={color.glow}>
                        <animate attributeName="cy" values="-45;-55;-45" dur="4s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.7;0.2;0.7" dur="4s" repeatCount="indefinite" />
                    </circle>
                </g>
            )}

            {/* Level number badge */}
            <g transform="translate(35, -35)">
                <circle r="14" fill="#0a0e1a" stroke={color.top} strokeWidth="2" />
                <text textAnchor="middle" dy=".3em" fill="white" fontSize="12" fontWeight="bold" fontFamily="monospace">
                    {level.toString().padStart(2, '0')}
                </text>
            </g>

            {/* Title Overlay on Hover */}
            {isHovered && (
                <g transform={`translate(0, ${isBoss ? 100 : 80})`}>
                    <rect x="-80" y="-20" width="160" height="40" rx="20" fill="rgba(0,0,0,0.8)" />
                    <text textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" className="uppercase tracking-widest">
                        {quiz.title}
                    </text>
                </g>
            )}
        </g>
    );
};

export default function JourneyPath({ quizzes, onStartQuiz }: JourneyPathProps) {
    const [hoveredNode, setHoveredNode] = useState<any>(null);
    const [scrollY, setScrollY] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const levels = useMemo(() => {
        let currentFound = false;
        return quizzes.map((quiz, index) => {
            let type: 'completed' | 'active' | 'locked' | 'boss' = 'locked';
            if (quiz.isCompleted) {
                type = 'completed';
            } else if (!currentFound) {
                type = 'active';
                currentFound = true;
            }

            // Custom "boss" check (e.g., every 5th or last)
            if (index === quizzes.length - 1 && index > 3) {
                type = quiz.isCompleted ? 'completed' : (type === 'active' ? 'boss' : 'locked');
            }

            // Duolingo-style winding path calculation
            const spacing = 220;
            const xOffset = 400; // Center of 800px view
            const amplitude = 180;
            const frequency = 0.8;

            const x = xOffset + Math.sin(index * frequency) * amplitude;
            const y = 150 + index * spacing;

            return { type, level: index + 1, x, y, quiz };
        });
    }, [quizzes]);

    const drawPath = (from: any, to: any, isCompleted: boolean) => {
        const midY = (from.y + to.y) / 2;
        // Winding curve
        return (
            <path
                d={`M ${from.x},${from.y} C ${from.x},${midY} ${to.x},${midY} ${to.x},${to.y}`}
                fill="none"
                stroke={isCompleted ? '#00ffcc' : '#2a3544'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={isCompleted ? 'none' : '15,10'}
                opacity={isCompleted ? '0.6' : '0.4'}
                className="transition-all duration-500"
            />
        );
    };

    const totalSVGHeight = levels.length > 0 ? levels[levels.length - 1].y + 200 : 1000;

    return (
        <div className="relative w-full overflow-visible" style={{ height: totalSVGHeight }}>
            {/* Background Layers */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity grayscale"
                    style={{ backgroundImage: "url('/quiz-bg.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-transparent to-[#0a0e1a] opacity-90" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />
            </div>

            {/* Main Interactive Map */}
            <svg
                width="100%"
                height={totalSVGHeight}
                viewBox={`0 0 800 ${totalSVGHeight}`}
                className="relative z-10 w-full"
                preserveAspectRatio="xMidYMin meet"
            >
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="15" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="innerGlow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Connecting Paths */}
                {levels.map((level, index) => {
                    if (index === 0) return null;
                    const prevLevel = levels[index - 1];
                    const isPathCompleted = prevLevel.type === 'completed';
                    return (
                        <g key={`path-${index}`}>
                            {drawPath(prevLevel, level, isPathCompleted)}
                        </g>
                    );
                })}

                {/* Nodes */}
                {levels.map((level) => (
                    <HexNode
                        key={level.level}
                        node={level}
                        isHovered={hoveredNode?.level === level.level}
                        onHover={setHoveredNode}
                        onStart={onStartQuiz}
                        selected={false}
                    />
                ))}
            </svg>

            {/* Branding Overlay (Fixed) */}
            <div className="fixed top-24 left-6 z-20 pointer-events-none">
                <div className="bg-black/80 backdrop-blur-xl border border-[#ffd700]/20 p-5 rounded-2xl shadow-[0_0_50px_rgba(255,215,0,0.1)]">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-3xl">⚡</span>
                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">BLITZ<span className="text-[#ffd700]">Q</span>_MAP</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ffd700] animate-pulse" />
                        <p className="text-[10px] text-white/40 font-mono italic uppercase tracking-widest">ENCRYPTED_LINK_ACTIVE</p>
                    </div>
                </div>
            </div>

            {/* Sidebar Stats (Fixed) */}
            <div className="fixed top-24 right-6 z-20 flex flex-col gap-3 pointer-events-none">
                <div className="bg-black/60 backdrop-blur-lg border border-white/5 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center text-xl">🔥</div>
                    <div>
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-tighter">Current_Streak</div>
                        <div className="text-xl font-black text-yellow-500">15_DAYS</div>
                    </div>
                </div>
                <div className="bg-black/60 backdrop-blur-lg border border-white/5 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-xl">💎</div>
                    <div>
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-tighter">Gems_Balance</div>
                        <div className="text-xl font-black text-blue-400">4200</div>
                    </div>
                </div>
            </div>

            {/* Bottom Legend (Fixed) */}
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                <div className="flex gap-6 bg-black/80 backdrop-blur-xl px-10 py-4 rounded-full border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-[#ffd700] shadow-[0_0_15px_#ffd700]" />
                        <span className="text-[10px] text-white/70 uppercase font-black tracking-widest">ACTIVE_NODE</span>
                    </div>
                    <div className="w-[1px] h-4 bg-white/10 self-center" />
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-[#00ffcc] shadow-[0_0_15px_#00ffcc]" />
                        <span className="text-[10px] text-white/70 uppercase font-black tracking-widest">COMPLETED</span>
                    </div>
                </div>
            </div>

            {/* Scroll Hint */}
            <div className="fixed bottom-8 right-8 z-20 animate-bounce pointer-events-none">
                <div className="text-white/20 text-[10px] font-mono flex flex-col items-center">
                    <span>▼</span>
                    <span>SCROLL_TO_EXPLORE</span>
                </div>
            </div>
        </div>
    );
}
