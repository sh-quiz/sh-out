import React from 'react';
import { LeaderboardEntry } from '../../lib/leaderboard';

interface LeaderboardTableProps {
    data: LeaderboardEntry[];
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ data }) => {
    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <span className="text-2xl">🥇</span>;
            case 2:
                return <span className="text-2xl">🥈</span>;
            case 3:
                return <span className="text-2xl">🥉</span>;
            default:
                return <span className="font-bold text-gray-500">#{rank}</span>;
        }
    };

    return (
        <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-4">Rank</th>
                            <th scope="col" className="px-6 py-4">User</th>
                            <th scope="col" className="px-6 py-4 text-right">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((entry) => (
                            <tr
                                key={entry.userId}
                                className="border-b bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
                            >
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                    {getRankIcon(entry.rank)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                            {entry.user?.avatar ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={entry.user.avatar}
                                                    alt={`${entry.user.firstName} ${entry.user.lastName}`}
                                                    className="h-full w-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="font-semibold">
                                                    {entry.user?.firstName?.[0]}
                                                    {entry.user?.lastName?.[0]}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                {entry.user?.firstName} {entry.user?.lastName}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Global Rank #{entry.rank}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-indigo-600 dark:text-indigo-400">
                                    {entry.score.toLocaleString()} pts
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                    No leaderboard data available yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaderboardTable;
