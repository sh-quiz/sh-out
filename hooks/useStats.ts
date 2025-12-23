import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { statsService, UserStats } from '../lib/stats';

export const statsKeys = {
    all: ['stats'] as const,
    detail: () => [...statsKeys.all, 'detail'] as const,
};

export function useStats(
    options?: Omit<UseQueryOptions<UserStats>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: statsKeys.detail(),
        queryFn: () => statsService.getStats(),
        ...options,
    });
}
