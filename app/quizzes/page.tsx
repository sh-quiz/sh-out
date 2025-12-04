'use client';

import { useEffect } from 'react';
import JourneyPath from '@/components/Journey/JourneyPath';
import { ReactLenis } from 'lenis/react';
import { Play, Map } from 'lucide-react';
import ParticleBackground from '@/components/ui/ParticleBackground';
export default function QuizzesPage() {

    // Scroll to current level on load
    useEffect(() => {
        // Simple timeout to allow render, then scroll
        const timer = setTimeout(() => {
            // Calculate approximate position of level 13
            // In our mock data, levels are reversed. 50 levels total.
            // Level 13 is the 38th item (50 - 13 + 1 = 38).
            // Each item is ~180px apart + 100px offset.
            // y = 37 * 180 + 100 = 6760px approx.
            // Let's just scroll to the element with "Current Level" text or similar if we could, 
            // but for now hardcode a reasonable scroll position or let user scroll.
            // Actually, let's try to scroll to center it.
            window.scrollTo({ top: 6500, behavior: 'smooth' });
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <ReactLenis root>
            <div className="bg-black min-h-screen text-white overflow-hidden">
                <ParticleBackground />

                <JourneyPath />

                {/* Fixed Bottom Bar */}
                <div className="fixed bottom-0 left-0 right-0 z-50 p-6 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none">
                    <div className="max-w-md mx-auto flex items-center justify-between pointer-events-auto">

                        {/* Left Pill */}
                        <div className="flex items-center gap-3 bg-[#161B22] border border-white/10 px-4 py-3 rounded-full backdrop-blur-md shadow-lg">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">
                                13
                            </div>
                            <span className="text-sm font-medium text-white/90">Current Level</span>
                        </div>

                        {/* Right CTA */}
                        <button className="group relative flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_30px_rgba(37,99,235,0.7)] transition-all active:scale-95">
                            <span className="relative z-10">Start Level 13</span>
                            <Play className="w-4 h-4 fill-white relative z-10" />

                            {/* Electric Pulse Border */}
                            <div className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
                        </button>

                    </div>
                </div>

            </div>
        </ReactLenis>
    );
}
