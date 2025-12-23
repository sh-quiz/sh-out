'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });

            const target = e.target as HTMLElement;
            if (target) {
                const style = window.getComputedStyle(target);
                setIsPointer(style.cursor === 'pointer');
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            id="custom-cursor"
            className={`fixed pointer-events-none z-[9999] ${isPointer ? 'is-pointer' : ''}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: `translate(-5px, -5px) scale(${isPointer ? 1.2 : 1})`,
                transition: 'transform 0.1s ease-out',
            }}
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    transform: `rotate(-90deg)`,
                }}
            >
                <path
                    d="M2 22L22 12L2 2L5 12L2 22Z"
                    fill={isPointer ? 'var(--color-blitz-yellow)' : 'var(--color-voltage-blue)'}
                    stroke="white"
                    strokeWidth="1.5"
                />
            </svg>
        </div>
    );
}
