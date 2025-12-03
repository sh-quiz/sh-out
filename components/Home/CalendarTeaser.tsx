'use client';

import { motion } from 'framer-motion';

export default function CalendarTeaser() {
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    const today = new Date().getDate();

    return (
        <div className="px-6 pb-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="w-full"
            >
                <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-medium text-[#878D96] uppercase tracking-wider">December 2025</span>
                </div>

                <div className="grid grid-cols-7 gap-y-6 gap-x-2 text-center">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => (
                        <span key={day} className="text-xs text-[#878D96]/50 font-medium">{day}</span>
                    ))}

                    {days.map((day) => {
                        const isToday = day === today;
                        const hasActivity = [2, 5, 12, 15, 20].includes(day);

                        return (
                            <div key={day} className="flex flex-col items-center gap-1">
                                <div className={`
                                    w-8 h-8 flex items-center justify-center rounded-full text-sm
                                    ${isToday ? 'bg-[#007AFF] text-white shadow-[0_0_15px_rgba(0,122,255,0.4)]' : 'text-[#878D96]'}
                                `}>
                                    {day}
                                </div>
                                {hasActivity && !isToday && (
                                    <div className="w-1 h-1 rounded-full bg-[#34D399]" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}
