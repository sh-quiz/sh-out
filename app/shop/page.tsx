"use client";

import { useUserStats } from "@/hooks/useUser";
import { ShopCard } from "@/components/Shop/ShopCard";
import { Zap, Gem, Key } from "lucide-react";

export default function ShopPage() {
    const { data: stats } = useUserStats();

    return (
        <div className="min-h-screen bg-[#0a0a16] text-white p-8">
            {/* Top Bar with Currency */}
            <div className="mx-auto flex max-w-6xl justify-end gap-4 mb-20">
                {/* Energy */}
                <div className="flex items-center gap-2 rounded-full bg-[#1e1e2d] px-4 py-2 shadow-lg border border-white/5">
                    <Zap className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-sm">
                        {stats ? `${stats.energy}/${stats.maxEnergy}` : "..."}
                    </span>
                </div>

                {/* Gems */}
                <div className="flex items-center gap-2 rounded-full bg-[#1e1e2d] px-4 py-2 shadow-lg border border-white/5">
                    <Gem className="h-4 w-4 fill-blue-400 text-blue-400" />
                    <span className="font-bold text-sm">
                        {stats ? stats.gems.toLocaleString() : "..."}
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <h1 className="mb-16 text-center text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    Vault of Power – Unlock Your True Potential
                </h1>

                {/* Cards Grid */}
                <div className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-12">
                    {/* Card 1: Energy Boost */}
                    <ShopCard
                        title="Energy Boost"
                        price="N3,500"
                        description="Recharge your power instantly with pure energy packs."
                        icon={<Zap className="h-10 w-10 fill-yellow-400 text-yellow-400" />}
                        features={[
                            "100 Energy Bars",
                        ]}
                        buttonText="Purchase"
                        delay={0.1}
                    />

                    {/* Card 2: Gem Vault */}
                    <ShopCard
                        title="Gem Vault"
                        price="N10,000"
                        description="Stock up on precious gems to unlock rare items and boosts."
                        icon={<Gem className="h-10 w-10 fill-blue-400 text-blue-400" />}
                        features={[
                            "3,000 Gems",
                        ]}
                        buttonText="Purchase"
                        delay={0.2}
                    />

                    {/* Card 3: Premium Access */}
                    <ShopCard
                        title="Premium Access"
                        price="N30,000"
                        priceSuffix="per year"
                        description="Unlock everything – full access for a year of ultimate power."
                        icon={<Key className="h-10 w-10 fill-yellow-400 text-yellow-400" />}
                        features={[
                            "Unlimited energy refills",
                            "All gems bundles",
                            "Exclusive avatars",
                            "Streak protectors",
                            "VIP perks",
                        ]}
                        isBestValue={true}
                        buttonText="Purchase"
                        delay={0.3}
                    />
                </div>

                {/* Footer Note */}
                <div className="mt-16 text-center text-sm text-gray-500">
                    Powered by Paystack
                </div>
            </div>
        </div>
    );
}
