'use client';

import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    size: number;
    speedY: number;
    opacity: number;
    color: string;
}

export default function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', resize);
        resize();


        const particleCount = 150;
        const colors = ['#007AFF', '#0055BB', '#4499FF'];

        const createParticle = (isInitial = false): Particle => ({
            x: Math.random() * width,
            y: isInitial ? Math.random() * height : height + 10,
            size: Math.random() * 2 + 0.5,
            speedY: Math.random() * 1 + 0.2,
            opacity: Math.random() * 0.5 + 0.1,
            color: colors[Math.floor(Math.random() * colors.length)],
        });


        for (let i = 0; i < particleCount; i++) {
            particles.push(createParticle(true));
        }


        let speedMultiplier = 3;
        const startTime = Date.now();
        const intensifyDuration = 3000;

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;


            if (elapsed < intensifyDuration) {
                const progress = elapsed / intensifyDuration;
                speedMultiplier = 3 - (progress * 2);
            } else {
                speedMultiplier = 1;
            }

            ctx.clearRect(0, 0, width, height);

            particles.forEach((p, index) => {
                p.y -= p.speedY * speedMultiplier;


                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.fill();


                if (p.y < -10) {
                    particles[index] = createParticle();
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
            style={{ background: 'black' }}
        />
    );
}
