"use client";

import { motion } from "framer-motion";
import {
    Crown,
    Zap,
    Clock,
    ChevronRight,
    LogOut,
    Bell,
    Moon,
    Shield,
    BookOpen,
    Timer
} from "lucide-react";
import ProfileHero from "./components/ProfileHero";
import StatNumber from "./components/StatNumber";
import GlassCard from "./components/GlassCard";
import EditProfileModal from "./components/EditProfileModal";
import { userService, UpdateProfileData } from "@/lib/user";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth";
import { useUserProfile } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { statsService, UserStats } from "@/lib/stats";
import CyberLoader from "@/components/ui/CyberLoader";
import { api } from "@/app/api/client";

const SETTINGS_LINKS = [
    { label: "Edit Profile", icon: null },
    { label: "Notification Preferences", icon: Bell },
    { label: "Appearance", value: "Dark", icon: Moon },
    { label: "Privacy & Data", icon: Shield },
];

export default function AccountPage() {
    const router = useRouter();
    const { data: userProfile, isLoading: isProfileLoading, refetch: refetchProfile } = useUserProfile();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    useEffect(() => {
        statsService.getStats().then(setStats).catch(console.error);
    }, []);

    const handleLogout = async () => {
        await authService.logout();
        router.push('/');
    };

    const handleUpdateProfile = async (data: UpdateProfileData, file: File | null) => {
        await userService.updateProfile(data, file);
        await refetchProfile();
    };

    if (isProfileLoading || !stats) {
        return (
            <div className="h-screen w-screen bg-black flex items-center justify-center fixed inset-0 z-50">
                <CyberLoader text="ACCESSING NEURAL PROFILE..." />
            </div>
        );
    }

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };


    const displayData = {
        name: userProfile?.name || "User",
        username: userProfile?.email || "user",
        school: userProfile?.school || "No School",
        avatarUrl: userProfile?.profilePicture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop",
        isPremium: true,
        streak: stats.dayStreak,
        stats: {
            solved: stats.top3Finishes, // Assuming mapping, check logic if needed
            rank: stats.xp,
            top500: true
        },
        records: [
            { label: "Current Streak", value: `${stats.dayStreak} days`, icon: Zap },
            { label: "XP", value: `${stats.xp}`, icon: BookOpen },
            { label: "Gems", value: `${stats.gems}`, icon: Crown, accent: true },
            // { label: "Total study time", value: "127h 34m", icon: Clock } 
        ]
    };

    return (
        <main className="min-h-screen w-full bg-deep-void text-static-white pb-32 overflow-x-hidden selection:bg-voltage-blue/30 relative">
            {/* Cyber background effects */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 cyber-grid opacity-5" />
                <div className="scan-line" />
            </div>


            <section className="pt-24 pb-12 px-6">
                <ProfileHero
                    name={displayData.name}
                    username={displayData.username}
                    school={displayData.school}
                    avatarUrl={displayData.avatarUrl}
                    isPremium={displayData.isPremium}
                    streak={displayData.streak}
                />
            </section>


            <section className="px-6 mb-16 relative z-10">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center md:text-left">
                    <div className="flex justify-center md:justify-start">
                        <StatNumber
                            label="Total XP"
                            value={stats.xp.toLocaleString()}
                            delay={0.2}
                        />
                    </div>
                    <div className="flex justify-center md:justify-start">
                        <StatNumber
                            label="Current Streak"
                            value={stats.dayStreak}
                            subValue="days"
                            accentColor="amber"
                            delay={0.4}
                            isBreathing
                        />
                    </div>
                    <div className="flex justify-center md:justify-start">
                        <StatNumber
                            label="Gems"
                            value={`${stats.diamonds}`}
                            accentColor="sapphire"
                            delay={0.6}
                        />
                    </div>
                </div>
            </section>


            <section className="px-6 mb-20 relative z-10">
                <div className="max-w-md mx-auto">
                    <GlassCard className="p-8 border-l-4 border-l-voltage-blue" hoverEffect>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-voltage-blue/10">
                                    <Crown className="w-6 h-6 text-voltage-blue" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-michroma font-bold text-static-white">Premium Plan</h3>
                                    <p className="text-xs font-mono text-static-white/40 uppercase tracking-widest">Lifetime Access</p>
                                </div>
                            </div>

                            <div className="px-3 py-1 rounded-full border border-voltage-blue/30 bg-voltage-blue/10 text-[10px] font-black tracking-tighter text-voltage-blue">
                                ACTIVE_PROTOCOL
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="h-1 w-full bg-carbon-grey rounded-full overflow-hidden">
                                <div className="h-full bg-voltage-blue w-full" />
                            </div>
                            <p className="text-[10px] font-mono text-static-white/30 text-center uppercase tracking-widest">
                                Next billing date: Never (Lifetime)
                            </p>
                        </div>
                    </GlassCard>
                </div>
            </section>


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
                        {displayData.records.map((record, index) => (
                            <motion.div
                                key={record.label}
                                className="flex items-center justify-between group"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-1 h-8 rounded-full transition-colors duration-300 ${record.accent ? "bg-blitz-yellow" : "bg-carbon-grey group-hover:bg-voltage-blue"}`} />
                                    <div>
                                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-static-white/40 mb-1">{record.label}</p>
                                        <p className="text-xl font-michroma font-bold text-static-white">{record.value}</p>
                                    </div>
                                </div>
                                {record.accent && (
                                    <Zap className="w-5 h-5 text-blitz-yellow" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            <section className="px-6 pb-20">
                <div className="max-w-2xl mx-auto">
                    <div className="space-y-1">
                        {SETTINGS_LINKS.map((link, index) => (
                            <motion.button
                                key={link.label}
                                onClick={() => link.label === "Edit Profile" && setIsEditProfileOpen(true)}
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

                        <motion.button
                            onClick={handleLogout}
                            className="w-full h-16 flex items-center justify-between border-b border-white/5 group hover:bg-white/[0.02] transition-colors px-4 -mx-4 rounded-md mt-8"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-[#878D96] group-hover:text-[#FF453A] transition-colors">Sign Out</span>
                            <LogOut className="w-4 h-4 text-[#878D96] group-hover:text-[#FF453A] transition-colors" />
                        </motion.button>


                        <div className="pt-12 flex justify-center">
                            <button className="text-xs text-[#161B22] hover:text-[#FF453A] transition-colors duration-500">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <EditProfileModal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
                onSave={handleUpdateProfile}
                initialData={{
                    name: displayData.name,
                    school: userProfile?.school || null,
                    profilePicture: userProfile?.profilePicture || null
                }}
            />
        </main>
    );
}
