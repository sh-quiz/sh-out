import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { userService, UserProfile } from '../lib/user';

export const queryKeys = {
    user: {
        profile: ['user', 'profile'] as const,
        stats: ['user', 'stats'] as const,
    },
};

export function useUserProfile(
    options?: Omit<UseQueryOptions<UserProfile>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.user.profile,
        queryFn: () => userService.getProfile(),
        ...options,
    });
}

export function useUserStats(
    options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.user.stats,
        queryFn: () => userService.getStats(),
        ...options,
    });
}
