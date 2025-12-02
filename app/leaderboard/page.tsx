'use client';

import React, { useEffect, useState } from 'react';
import LeaderboardTable from '../../components/LeaderBoard/LeaderboardTable';
import UserRankCard from '../../components/LeaderBoard/UserRankCard';
import { fetchGlobalLeaderboard, fetchUserRank, LeaderboardEntry, UserRank } from '../../lib/leaderboard';

export default function LeaderboardPage() {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [userRank, setUserRank] = useState<UserRank | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const [globalData, rankData] = await Promise.all([
                    fetchGlobalLeaderboard(20), // Fetch top 20
                    fetchUserRank().catch(() => null), // Handle case where user might not be logged in or rank fails
                ]);

                setLeaderboardData(globalData);
                setUserRank(rankData);
            } catch (error) {
                console.error('Failed to load leaderboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    See who's topping the charts this month!
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column: User Rank Card (Sticky on Desktop) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8">
                        <UserRankCard rankData={userRank} isLoading={isLoading} />

                        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">How it works</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Scores are calculated based on your quiz performance. The leaderboard resets every month, giving everyone a fresh chance to reach the top!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Global Leaderboard Table */}
                <div className="lg:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Global Rankings</h2>
                        <span className="text-sm text-gray-500">Top 20</span>
                    </div>

                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-16 w-full animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"></div>
                            ))}
                        </div>
                    ) : (
                        <LeaderboardTable data={leaderboardData} />
                    )}
                </div>
            </div>
        </div>
    );
}
