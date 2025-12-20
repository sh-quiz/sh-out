'use client';

import { motion } from 'framer-motion';

export default function TopBar() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-xl border-b border-white/5"
        >

            <div className="flex items-center justify-center w-10 h-10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#FFB340" />
                </svg>
            </div>


            <div className="absolute left-1/2 transform -translate-x-1/2">
                <span className="text-sm font-medium text-white/90 tracking-wide">Good evening, Benedict</span>
            </div>


            <button className="px-4 py-1.5 rounded-full bg-[#007AFF]/10 border border-[#007AFF]/20 text-[#007AFF] text-xs font-medium tracking-wide hover:bg-[#007AFF]/20 transition-colors duration-300 shadow-[0_0_15px_rgba(0,122,255,0.15)]">
                Upgrade
            </button>
        </motion.div>
    );
}
