'use client';

import LeaderboardTopBar from '@/components/LeaderBoard/LeaderboardTopBar';
import TabControl from '@/components/LeaderBoard/TabControl';
import Podium from '@/components/LeaderBoard/Podium';
import LeaderboardList from '@/components/LeaderBoard/LeaderboardList';

export default function LeaderboardPage() {
    return (
        <div className="min-h-screen bg-black text-[#F0F2F5] selection:bg-[#007AFF] selection:text-white">
            {/* Fixed Top Bar */}
            <LeaderboardTopBar />

            {/* Main Content */}
            <main className="relative z-0">
                {/* 2. Tab Control */}
                <TabControl />

                {/* 3. Hero Ranking Podium */}
                <Podium />

                {/* 4. Full Leaderboard List */}
                <LeaderboardList />
            </main>
        </div>
    );
}
