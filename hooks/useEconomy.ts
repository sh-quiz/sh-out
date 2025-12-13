import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { economyService, EnergyStatus, DiamondStatus } from '../lib/economy';

export const economyKeys = {
    all: ['economy'] as const,
    energy: ['economy', 'energy'] as const,
    diamonds: ['economy', 'diamonds'] as const,
};

export function useEnergy(
    options?: Omit<UseQueryOptions<EnergyStatus>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: economyKeys.energy,
        queryFn: () => economyService.getEnergy(),
        ...options,
    });
}

export function useDiamonds(
    options?: Omit<UseQueryOptions<DiamondStatus>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: economyKeys.diamonds,
        queryFn: () => economyService.getDiamonds(),
        ...options,
    });
}

export function useConvertDiamonds() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (diamonds: number) => economyService.convertDiamondsToEnergy(diamonds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: economyKeys.all });
            // Also invalidate user stats if they serve as a fallback
            queryClient.invalidateQueries({ queryKey: ['user', 'stats'] });
        },
    });
}
