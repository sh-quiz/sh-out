import React from 'react';
import { UserRank } from '../../lib/leaderboard';

interface UserRankCardProps {
  rankData: UserRank | null;
  isLoading: boolean;
}

const UserRankCard: React.FC<UserRankCardProps> = ({ rankData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="mb-2 h-8 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    );
  }

  if (!rankData) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-lg dark:border-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold opacity-90">Your Ranking</h3>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
          {rankData.month} {rankData.year}
        </span>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-4xl font-bold">#{rankData.rank}</span>
        <span className="mb-1 text-sm opacity-80">Global Rank</span>
      </div>

      <div className="mt-4 border-t border-white/20 pt-4">
        <div className="flex justify-between">
          <span className="text-sm opacity-90">Total Score</span>
          <span className="font-bold">{rankData.score.toLocaleString()} pts</span>
        </div>
      </div>
    </div>
  );
};

export default UserRankCard;
