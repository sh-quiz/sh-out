'use client';

import LeaderboardTopBar from '@/components/LeaderBoard/LeaderboardTopBar';
import TabControl from '@/components/LeaderBoard/TabControl';
import Podium from '@/components/LeaderBoard/Podium';
import LeaderboardList from '@/components/LeaderBoard/LeaderboardList';
import { useGlobalLeaderboard } from '@/hooks/useLeaderboard';

export default function LeaderboardPage() {
    const { data: leaderboard, isLoading } = useGlobalLeaderboard(50);

    // Initial loading state could be a skeleton, for now simple null check or spinner
    if (isLoading) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
    }

    const fullList = leaderboard || [];
    const topThree = fullList.filter(u => u.rank <= 3);
    const rest = fullList.filter(u => u.rank > 3);

    return (
        <div className="min-h-screen bg-black text-[#F0F2F5] selection:bg-[#007AFF] selection:text-white">
            {/* Fixed Top Bar */}
            <LeaderboardTopBar />

            {/* Main Content */}
            <main className="relative z-0">
                {/* 2. Tab Control */}
                <TabControl />

                {/* 3. Hero Ranking Podium */}
                <Podium users={topThree} />

                {/* 4. Full Leaderboard List */}
                <LeaderboardList users={rest} />
            </main>
        </div>
    );
}

