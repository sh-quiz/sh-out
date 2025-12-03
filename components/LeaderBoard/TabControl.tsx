'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const tabs = ['Today', 'This Month', 'Top Schools'];

export default function TabControl() {
    const [activeTab, setActiveTab] = useState('Today');

    return (
        <div className="px-6 pt-24 pb-8">
            <div className="relative flex items-center justify-between p-1 rounded-full bg-[#161B22]/60 backdrop-blur-[30px] border border-white/5">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="relative flex-1 py-2.5 text-sm font-medium transition-colors duration-300 z-10"
                            style={{ color: isActive ? '#FFFFFF' : '#878D96' }}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-[#007AFF] rounded-full shadow-[0_0_20px_rgba(0,122,255,0.3)]"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{tab}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
