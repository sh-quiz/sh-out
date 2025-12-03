'use client';

import StreakHero from '@/components/Home/StreakHero';
import EnergyGemsRow from '@/components/Home/EnergyGemsRow';
import PerformanceGrid from '@/components/Home/PerformanceGrid';
import GetStartedCard from '@/components/Home/GetStartedCard';
import CalendarTeaser from '@/components/Home/CalendarTeaser';

export default function HomePage() {
    return (
        <div className="pb-24 lg:pb-12">
            {/* 2. Streak Hero Card */}
            <section className="mb-4">
                <StreakHero />
            </section>

            {/* 3. Energy & Gems Row */}
            <section className="mb-8">
                <EnergyGemsRow />
            </section>

            {/* 4. Performance Grid */}
            <section className="mb-8">
                <PerformanceGrid />
            </section>

            {/* 5. Get Started Full-Bleed Card */}
            <section className="mb-12">
                <GetStartedCard />
            </section>

            {/* 7. Calendar Teaser */}
            <section>
                <CalendarTeaser />
            </section>
        </div>
    );
}