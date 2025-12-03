"use client";

import { motion } from "framer-motion";
import {
    Crown,
    Zap,
    Clock,
    ChevronRight,
    LogOut,
    Trash2,
    Bell,
    Moon,
    Shield,
    Trophy,
    Timer,
    BookOpen
} from "lucide-react";
import ProfileHero from "./components/ProfileHero";
import StatNumber from "./components/StatNumber";
import GlassCard from "./components/GlassCard";

// Mock Data
const USER_DATA = {
    name: "Alex Chen",
    username: "alx_chen",
    school: "MIT '26",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop", // Placeholder
    isPremium: true,
    streak: 47,
    stats: {
        solved: 12847,
        rank: 127,
        top500: true
    },
    records: [
        { label: "Longest streak", value: "83 days", icon: Zap },
        { label: "Best subject", value: "Mathematics (98.3%)", icon: BookOpen },
        { label: "Fastest solve", value: "4.2s", icon: Timer, accent: true },
        { label: "Total study time", value: "127h 34m", icon: Clock }
    ]
};

const SETTINGS_LINKS = [
    { label: "Edit Profile", icon: null },
    { label: "Notification Preferences", icon: Bell },
    { label: "Appearance", value: "Dark", icon: Moon },
    { label: "Privacy & Data", icon: Shield },
];

export default function AccountPage() {
    return (
        <main className="min-h-screen w-full bg-[#000000] text-[#F0F2F5] pb-32 overflow-x-hidden selection:bg-[#007AFF]/30">

            {/* 1. HERO PROFILE CARD */}
            <section className="pt-24 pb-12 px-6">
                <ProfileHero
                    name={USER_DATA.name}
                    username={USER_DATA.username}
                    school={USER_DATA.school}
                    avatarUrl={USER_DATA.avatarUrl}
                    isPremium={USER_DATA.isPremium}
                    streak={USER_DATA.streak}
                />
            </section>

            {/* 2. LIFETIME ACHIEVEMENTS PODIUM */}
            <section className="px-6 mb-16">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center md:text-left">
                    <div className="flex justify-center md:justify-start">
                        <StatNumber
                            label="Total Solved"
                            value={USER_DATA.stats.solved.toLocaleString()}
                            delay={0.2}
                        />
                    </div>
                    <div className="flex justify-center md:justify-start">
                        <StatNumber
                            label="Current Streak"
                            value={USER_DATA.streak}
                            subValue="days"
                            accentColor="amber"
                            delay={0.4}
                            isBreathing
                        />
                    </div>
                    <div className="flex justify-center md:justify-start">
                        <StatNumber
                            label="Global Rank"
                            value={`#${USER_DATA.stats.rank}`}
                            accentColor={USER_DATA.stats.top500 ? "sapphire" : "white"}
                            delay={0.6}
                        />
                    </div>
                </div>
            </section>

            {/* 3. MEMBERSHIP CARD */}
            <section className="px-6 mb-20">
                <div className="max-w-md mx-auto">
                    <GlassCard className="p-8" hoverEffect>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-[#007AFF]/10">
                                    <Crown className="w-6 h-6 text-[#007AFF]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium">Premium Plan</h3>
                                    <p className="text-sm text-[#878D96]">Lifetime Access</p>
                                </div>
                            </div>
                            {/* Status Pill */}
                            <div className="px-3 py-1 rounded-full border border-[#007AFF]/30 bg-[#007AFF]/10 text-xs font-medium text-[#007AFF]">
                                ACTIVE
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="h-1 w-full bg-[#161B22] rounded-full overflow-hidden">
                                <div className="h-full bg-[#007AFF] w-full" />
                            </div>
                            <p className="text-xs text-[#878D96] text-center">
                                Next billing date: Never (Lifetime)
                            </p>
                        </div>
                    </GlassCard>
                </div>
            </section>

            {/* 4. PERSONAL RECORDS SECTION */}
            <section className="px-6 mb-24">
                <div className="max-w-2xl mx-auto space-y-8">
                    <motion.h2
                        className="text-sm font-medium uppercase tracking-widest text-[#878D96] mb-8 border-b border-white/5 pb-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        Personal Records
                    </motion.h2>

                    <div className="space-y-6">
                        {USER_DATA.records.map((record, index) => (
                            <motion.div
                                key={record.label}
                                className="flex items-center justify-between group"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-1 h-8 rounded-full transition-colors duration-300 ${record.accent ? "bg-[#007AFF]" : "bg-[#161B22] group-hover:bg-[#007AFF]"}`} />
                                    <div>
                                        <p className="text-sm text-[#878D96] mb-1">{record.label}</p>
                                        <p className="text-xl font-light">{record.value}</p>
                                    </div>
                                </div>
                                {record.accent && (
                                    <Zap className="w-5 h-5 text-[#007AFF]" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. SETTINGS & ACTIONS */}
            <section className="px-6 pb-20">
                <div className="max-w-2xl mx-auto">
                    <div className="space-y-1">
                        {SETTINGS_LINKS.map((link, index) => (
                            <motion.button
                                key={link.label}
                                className="w-full h-16 flex items-center justify-between border-b border-white/5 group hover:bg-white/[0.02] transition-colors px-4 -mx-4 rounded-md"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <span className="text-[#F0F2F5] font-light">{link.label}</span>
                                <div className="flex items-center gap-3 text-[#878D96]">
                                    {link.value && <span className="text-sm">{link.value}</span>}
                                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300" />
                                </div>
                            </motion.button>
                        ))}

                        {/* Sign Out */}
                        <motion.button
                            className="w-full h-16 flex items-center justify-between border-b border-white/5 group hover:bg-white/[0.02] transition-colors px-4 -mx-4 rounded-md mt-8"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-[#878D96] group-hover:text-[#FF453A] transition-colors">Sign Out</span>
                            <LogOut className="w-4 h-4 text-[#878D96] group-hover:text-[#FF453A] transition-colors" />
                        </motion.button>

                        {/* Delete Account (Hidden/Subtle) */}
                        <div className="pt-12 flex justify-center">
                            <button className="text-xs text-[#161B22] hover:text-[#FF453A] transition-colors duration-500">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}
