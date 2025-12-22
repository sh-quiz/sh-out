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
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth";
import { useUserProfile } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { statsService, UserStats } from "@/lib/stats";

export default function AccountPage() {
    const router = useRouter();
    const { data: displayData, refetch } = useUserProfile();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const settingsLinks = [
        {
            label: "Edit Profile",
            icon: null,
            action: () => setIsEditModalOpen(true)
        },
        { label: "Notification Preferences", icon: Bell },
        { label: "Appearance", value: "Dark", icon: Moon },
        { label: "Privacy & Data", icon: Shield },
    ];

    useEffect(() => {
        statsService.getStats().then(setStats).catch(console.error);
    }, []);

    const handleLogout = async () => {
        await authService.logout();
        router.push('/login');
    };

    if (!displayData) {
        return <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>;
    }

    return (
        <main className="min-h-screen bg-[#0D1117] text-white pb-20">
            <ProfileHero
                name={displayData.name}
                username={displayData.email.split('@')[0]} // Fallback for username
                school={displayData.school}
                avatarUrl={displayData.avatarUrl}
                level={Math.floor(stats?.xp ? stats.xp / 100 : 1)}
            />

            <section className="px-6 -mt-8 relative z-10">
                <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4">
                    <StatNumber
                        label="Day Streak"
                        value={stats?.dayStreak || 0}
                        icon={Zap}
                        delay={0.1}
                    />
                    <StatNumber
                        label="Top 3 Finishes"
                        value={stats?.top3Finishes || 0}
                        icon={Crown}
                        delay={0.2}
                    />
                </div>
            </section>

            <section className="px-6 mt-6">
                <div className="max-w-2xl mx-auto space-y-4">
                    <GlassCard className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <Timer className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <div className="text-sm text-[#878D96]">Study Time</div>
                                <div className="font-semibold">{Math.floor((stats?.xp || 0) / 10)}h</div>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </section>

            <section className="px-6 pb-20 mt-8">
                <div className="max-w-2xl mx-auto">
                    <div className="space-y-1">
                        {settingsLinks.map((link, index) => (
                            <motion.button
                                key={link.label}
                                onClick={() => link.action?.()}
                                className="w-full h-16 flex items-center justify-between border-b border-white/5 group hover:bg-white/[0.02] transition-colors px-4 -mx-4 rounded-md"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div className="flex items-center gap-4">
                                    {link.icon && <link.icon className="w-4 h-4 text-[#878D96] group-hover:text-white transition-colors" />}
                                    <span className="text-[#F0F2F5] font-light">{link.label}</span>
                                </div>
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
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                currentName={displayData.name}
                currentSchool={displayData.school}
                currentAvatarUrl={displayData.avatarUrl}
                onUpdateSuccess={refetch}
            />
        </main >
    );
}
