"use client";

import { useUserStats } from "@/hooks/useUser";
import { ShopCard } from "@/components/Shop/ShopCard";
import { Zap, Gem, Key } from "lucide-react";

export default function ShopPage() {
    const { data: stats } = useUserStats();

    return (
        <div className="min-h-screen bg-[#0a0a16] text-white p-4 sm:p-6 md:p-8">

            <div className="mx-auto flex max-w-6xl justify-end gap-3 sm:gap-4 mb-8 sm:mb-12 md:mb-20">

                <div className="flex items-center gap-2 rounded-full bg-[#1e1e2d] px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg border border-white/5">
                    <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-xs sm:text-sm">
                        {stats ? `${stats.energy}/30` : "..."}
                    </span>
                </div>


                <div className="flex items-center gap-2 rounded-full bg-[#1e1e2d] px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg border border-white/5">
                    <Gem className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-blue-400 text-blue-400" />
                    <span className="font-bold text-xs sm:text-sm">
                        {stats ? stats.diamonds.toLocaleString() : "..."}
                    </span>
                </div>
            </div>


            <div className="mx-auto max-w-6xl">

                <h1 className="mb-8 sm:mb-12 md:mb-16 text-center text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] px-4">
                    Vault of Power – Unlock Your True Potential
                </h1>


                <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 md:gap-6 lg:gap-8">

                    <ShopCard
                        title="Energy Boost"
                        price="GH₵ 1"
                        description="Recharge your power instantly with pure energy packs."
                        icon={<Zap className="h-8 w-8 sm:h-10 sm:w-10 fill-yellow-400 text-yellow-400" />}
                        features={[
                            "Full Energy Bars",
                        ]}
                        buttonText="Purchase"
                        delay={0.1}
                    />


                    <ShopCard
                        title="Gem Vault"
                        price="GH₵ 5"
                        description="Stock up on precious gems to unlock rare items and boosts."
                        icon={<Gem className="h-8 w-8 sm:h-10 sm:w-10 fill-blue-400 text-blue-400" />}
                        features={[
                            "5 Gems",
                        ]}
                        buttonText="Purchase"
                        delay={0.2}
                    />


                    <ShopCard
                        title="Premium Access"
                        price="GH₵ 20"
                        priceSuffix="per year"
                        description="Unlock everything – full access for a year of ultimate power."
                        icon={<Key className="h-8 w-8 sm:h-10 sm:w-10 fill-yellow-400 text-yellow-400" />}
                        features={[
                            "Unlimited energy refills",
                            "All gems bundles",
                            "All these and for a whole year",
                            "Streak protectors",
                        ]}
                        isBestValue={true}
                        buttonText="Purchase"
                        delay={0.3}
                    />
                </div>


                <div className="mt-12 sm:mt-16 text-center text-xs sm:text-sm text-gray-500 pb-8">
                    Powered by Paystack
                </div>
            </div>
        </div>
    );
}
