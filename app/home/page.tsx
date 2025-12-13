'use client';

import StreakHero from '@/components/Home/StreakHero';
import EnergyGemsRow from '@/components/Home/EnergyGemsRow';
import PerformanceGrid from '@/components/Home/PerformanceGrid';
import ActivitySection from '@/components/Home/ActivitySection';
import CalendarTeaser from '@/components/Home/CalendarTeaser';

export default function HomePage() {
    return (
        <div className="pb-24 lg:pb-12">
            {/* 1. Streak Hero Card */}
            <section className="mb-4">
                <StreakHero />
            </section>


            {/* 3. Energy & Gems Row */}
            <section>
                <EnergyGemsRow />
            </section>

                        {/* 2. Performance Grid (Stats Row) */}
            <section>
                <PerformanceGrid />
            </section>

            {/* 5. Calendar Teaser */}
            <section>
                <CalendarTeaser />
            </section>
        </div>
    );
}