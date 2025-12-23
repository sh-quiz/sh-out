'use client';

import TabControl from '@/components/LeaderBoard/TabControl';
import Podium from '@/components/LeaderBoard/Podium';
import LeaderboardList from '@/components/LeaderBoard/LeaderboardList';
import { useGlobalLeaderboard } from '@/hooks/useLeaderboard';
import CyberLoader from '@/components/ui/CyberLoader';

export default function LeaderboardPage() {
    const { data: leaderboard, isLoading } = useGlobalLeaderboard(50);


    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <CyberLoader text="ACCESSING HALL OF FAME..." />
            </div>
        );
    }

    const fullList = leaderboard || [];
    const topThree = fullList.filter(u => u.rank <= 3);
    const rest = fullList.filter(u => u.rank > 3);

    return (
        <div className="min-h-screen bg-black text-[#F0F2F5] selection:bg-[#007AFF] selection:text-white">


            <main className="relative z-0">

                <TabControl />


                <Podium users={topThree} />


                <LeaderboardList users={rest} />
            </main>
        </div>
    );
}

