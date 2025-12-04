"use client";

import { motion } from "framer-motion";
import { ShopCard } from "@/components/Shop/ShopCard";
import { EnergyPackCard } from "@/components/Shop/EnergyPackCard";

export default function ShopPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#000000] text-white selection:bg-amber-500/30 relative">
            {/* Floating Particles Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: Math.random() * 100 + "vw",
                            y: Math.random() * 100 + "vh",
                            opacity: Math.random() * 0.3 + 0.1,
                        }}
                        animate={{
                            y: [null, Math.random() * -100 + "vh"],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute h-1 w-1 rounded-full bg-white/20"
                    />
                ))}
            </div>

            {/* Top Bar */}
            <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/5 bg-black/50 px-6 py-4 backdrop-blur-xl w-full">

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5">
                        <span className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">💎</span>
                        <span className="font-bold text-amber-400">12,450 Gems</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5">
                        <span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">⚡</span>
                        <span className="font-bold text-emerald-400">87/100 Energy</span>
                    </div>
                </div>
            </nav>

            <main className="flex-1 relative z-10 pt-6 pb-8 px-6 max-w-7xl mx-auto w-full">
                {/* Hero Section */}
                <div className="mb-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-2 text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_0_30px_rgba(245,158,11,0.3)]"
                    >
                        Vault of Power
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-400 font-medium"
                    >
                        Unlock your true potential
                    </motion.p>
                </div>

                {/* Treasure Packs Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-12">
                    <ShopCard
                        title="Starter Vault"
                        price="₦2,000"
                        gems={500}
                        badge="Most Popular"
                        delay={0.1}
                    />
                    <ShopCard
                        title="Scholar's Trove"
                        price="₦4,500"
                        gems={1200}
                        energy={20}
                        delay={0.2}
                    />
                    <ShopCard
                        title="Master's Reliquary"
                        price="₦10,000"
                        gems={3000}
                        energy={50}
                        streakProtector={3}
                        badge="Limited Time"
                        buttonColor="orange"
                        delay={0.3}
                    />
                    <ShopCard
                        title="Eternal Vault (VIP)"
                        price="₦30,000"
                        gems={10000}
                        energy={200}
                        isVIP={true}
                        badge="One-time offer"
                        delay={0.4}
                    />
                </div>

                {/* Energy Packs Section */}
                <div className="mb-8">
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-8 text-2xl font-bold text-gray-200"
                    >
                        Energy-Only Packs
                    </motion.h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <EnergyPackCard
                            energy={10}
                            price="₦500"
                            image="/assets/blue_vortex.png"
                            delay={0.6}
                        />
                        <EnergyPackCard
                            energy={30}
                            price="₦1,200"
                            image="/assets/blue_vortex.png" // Reusing for now as per plan, or use spiked if preferred for variety
                            isPopular={true}
                            delay={0.7}
                        />
                        <EnergyPackCard
                            energy={100}
                            price="₦3,500"
                            image="/assets/spiked_sphere.png"
                            delay={0.8}
                        />
                    </div>
                </div>
                    </button>

                    <div className="text-xs font-medium text-gray-600">
                        Powered by <span className="font-bold text-gray-400">Paystack</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
