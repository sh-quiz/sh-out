'use client';

import StreakHero from '@/components/Home/StreakHero';
import EnergyGemsRow from '@/components/Home/EnergyGemsRow';
import PerformanceGrid from '@/components/Home/PerformanceGrid';
import ActivitySection from '@/components/Home/ActivitySection';
import CalendarTeaser from '@/components/Home/CalendarTeaser';

export default function HomePage() {
    return (
        <div className="pb-24 lg:pb-12">

            <section className="mb-4">
                <StreakHero />
            </section>



            <section>
                <EnergyGemsRow />
            </section>


            <section>
                <PerformanceGrid />
            </section>


            <section>
                <CalendarTeaser />
            </section>
        </div>
    );
}