'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function GetStartedCard() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative mx-6 my-8 p-8 rounded-[24px] bg-black border border-[#161B22] overflow-hidden text-center"
        >

            <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />

            <div className="relative z-10 flex flex-col items-center">
                <div className="flex gap-4 mb-6">
                    <motion.span
                        animate={{ rotate: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="text-2xl"
                    >
                        🏁
                    </motion.span>
                    <motion.span
                        animate={{ rotate: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="text-2xl"
                    >
                        🚩
                    </motion.span>
                </div>

                <h2 className="text-3xl font-light text-white mb-4">Get started</h2>
                <p className="text-[#878D96] max-w-xs mx-auto mb-8 leading-relaxed">
                    Welcome to E-Quiz. Tap the button below to create your first course.
                </p>

                <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255, 179, 64, 0.15)" }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-[#FFB340] text-black rounded-2xl font-semibold text-base tracking-wide flex items-center gap-2"
                >
                    Create a course
                    <Plus className="w-4 h-4" />
                </motion.button>
            </div>
        </motion.div>
    );
}
