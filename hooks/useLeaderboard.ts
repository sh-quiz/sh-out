import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { leaderboardService, LeaderboardEntry, UserRank } from '../api/leaderboard';

export const leaderboardKeys = {
    all: ['leaderboard'] as const,
    global: (limit: number) => ['leaderboard', 'global', limit] as const,
    me: ['leaderboard', 'me'] as const,
};

export function useGlobalLeaderboard(
    limit: number = 50,
    options?: Omit<UseQueryOptions<LeaderboardEntry[]>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: leaderboardKeys.global(limit),
        queryFn: () => leaderboardService.getGlobalLeaderboard(limit),
        ...options,
    });
}

export function useUserRank(
    options?: Omit<UseQueryOptions<UserRank>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: leaderboardKeys.me,
        queryFn: () => leaderboardService.getUserRank(),
        ...options,
    });
}
