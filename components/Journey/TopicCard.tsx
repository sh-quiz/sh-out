'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface TopicCardProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    accentColor: string;
    position: { x: number; y: number };
    align: 'left' | 'right';
}

export default function TopicCard({ title, subtitle, icon, accentColor, position, align }: TopicCardProps) {
    const isRight = align === 'right';

    return (
        <motion.div
            className={`absolute z-20 pointer-events-auto cursor-pointer group`}
            style={{
                left: isRight ? `${position.x + 8}%` : 'auto',
                right: isRight ? 'auto' : `${100 - position.x + 8}%`,
                top: `${position.y}px`
            }}
            initial={{ opacity: 0, x: isRight ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            whileHover={{ y: -5, scale: 1.02 }}
        >
            <div className="relative overflow-hidden bg-[#161B22]/90 backdrop-blur-xl border border-white/5 rounded-xl p-4 w-64 shadow-2xl transition-all duration-300 group-hover:border-white/10 group-hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]">


                <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor} shadow-[0_0_10px_currentColor] opacity-80`} />

                <div className="flex items-start gap-3 pl-2">
                    <div className={`p-1.5 rounded-lg bg-white/5 text-white/80 ${accentColor.replace('bg-', 'text-')}`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm leading-tight mb-1 group-hover:text-blue-400 transition-colors">
                            {title}
                        </h3>
                        <p className="text-zinc-500 text-xs leading-relaxed">
                            {subtitle}
                        </p>
                    </div>
                </div>


                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
            </div>
        </motion.div>
    );
}
