"use client";

import { motion } from "framer-motion";
import { Zap, Target, Shield, Users, Trophy, Gift } from "lucide-react";

const features = [
    {
        icon: <Zap className="w-8 h-8 text-sharks-blue" />,
        title: "Real-Time Battles",
        description: "Challenge opponents live and see who answers faster. Speed is key.",
    },
    {
        icon: <Trophy className="w-8 h-8 text-yellow-500" />,
        title: "Daily Tournaments",
        description: "Compete in daily events to win exclusive badges and huge XP rewards.",
    },
    {
        icon: <Target className="w-8 h-8 text-sharks-red" />,
        title: "Skill-Based Matchmaking",
        description: "Always play against opponents of your skill level. Fair play guaranteed.",
    },
    {
        icon: <Shield className="w-8 h-8 text-green-400" />,
        title: "Anti-Cheat System",
        description: "Our advanced AI ensures a fair playing field for everyone.",
    },
    {
        icon: <Users className="w-8 h-8 text-purple-400" />,
        title: "Clans & Communities",
        description: "Join a clan, compete in team wars, and dominate the leaderboards together.",
    },
    {
        icon: <Gift className="w-8 h-8 text-pink-400" />,
        title: "Epic Rewards",
        description: "Earn gems, skins, and avatars as you level up and complete quests.",
    },
];

export default function FeaturesSection() {
    return (
        <section className="py-24 bg-sharks-navy relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl lg:text-5xl font-bold text-sharks-white mb-4"
                    >
                        Why Play <span className="text-sharks-red">The Sharks</span>?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-sharks-rose/80 max-w-2xl mx-auto"
                    >
                        More than just a quiz. It's a competitive e-sport for your brain.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-sharks-white/5 p-8 rounded-3xl border border-sharks-white/5 hover:bg-sharks-white/10 hover:border-sharks-blue/30 transition-all group cursor-default"
                        >
                            <div className="w-16 h-16 bg-sharks-navy rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-black/20">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-sharks-white mb-3 group-hover:text-sharks-blue transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-sharks-rose/70 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
