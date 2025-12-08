'use client';

import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryOptions,
    UseMutationOptions,
} from '@tanstack/react-query';
import {
    economyService,
    EnergyStatus,
    ConsumeEnergyRequest,
    ConsumeEnergyResponse,
    RefillEnergyRequest,
    RefillEnergyResponse,
    EnergyPricing,
    DiamondBalance,
    PurchaseDiamondsRequest,
    PurchaseDiamondsResponse,
    SpendDiamondsRequest,
    SpendDiamondsResponse,
    CurrencyTransaction,
    TransactionHistoryParams,
} from '../lib/economy';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const queryKeys = {
    energy: {
        status: ['energy', 'status'] as const,
        pricing: ['energy', 'pricing'] as const,
        transactions: (params: TransactionHistoryParams) =>
            ['energy', 'transactions', params] as const,
    },
    diamonds: {
        balance: ['diamonds', 'balance'] as const,
        transactions: (params: TransactionHistoryParams) =>
            ['diamonds', 'transactions', params] as const,
    },
} as const;

// ============================================================================
// ENERGY HOOKS
// ============================================================================

/**
 * Get current energy status with auto-refetch every 30 seconds
 * to catch energy regeneration
 */
export function useEnergy(
    options?: Omit<UseQueryOptions<EnergyStatus>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.energy.status,
        queryFn: () => economyService.getEnergy(),
        refetchInterval: 30 * 1000, // Refetch every 30 seconds for auto-regeneration
        ...options,
    });
}

/**
 * Consume energy (e.g., when starting a quiz)
 * Includes optimistic update for instant UI feedback
 */
export function useConsumeEnergy(
    options?: UseMutationOptions<
        ConsumeEnergyResponse,
        Error,
        ConsumeEnergyRequest
    >
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ConsumeEnergyRequest) =>
            economyService.consumeEnergy(data),
        onMutate: async (variables): Promise<{ previousEnergy: EnergyStatus | undefined }> => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: queryKeys.energy.status });

            // Snapshot previous value
            const previousEnergy = queryClient.getQueryData<EnergyStatus>(
                queryKeys.energy.status
            );

            // Optimistically update
            if (previousEnergy) {
                queryClient.setQueryData<EnergyStatus>(queryKeys.energy.status, {
                    ...previousEnergy,
                    energy: previousEnergy.energy - variables.amount,
                });
            }

            return { previousEnergy };
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousEnergy) {
                queryClient.setQueryData(
                    queryKeys.energy.status,
                    context.previousEnergy
                );
            }
        },
        onSettled: () => {
            // Refetch to ensure consistency
            queryClient.invalidateQueries({ queryKey: queryKeys.energy.status });
            queryClient.invalidateQueries({
                queryKey: queryKeys.energy.transactions({}),
            });
        },
        ...options,
    });
}

/**
 * Refill energy using diamonds
 * Updates both energy and diamond balances
 */
export function useRefillEnergy(
    options?: UseMutationOptions<RefillEnergyResponse, Error, RefillEnergyRequest>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RefillEnergyRequest) =>
            economyService.refillEnergy(data),
        onMutate: async (variables): Promise<{ previousEnergy: EnergyStatus | undefined; previousDiamonds: DiamondBalance | undefined }> => {
            await queryClient.cancelQueries({ queryKey: queryKeys.energy.status });
            await queryClient.cancelQueries({ queryKey: queryKeys.diamonds.balance });

            const previousEnergy = queryClient.getQueryData<EnergyStatus>(
                queryKeys.energy.status
            );
            const previousDiamonds = queryClient.getQueryData<DiamondBalance>(
                queryKeys.diamonds.balance
            );

            // Optimistically update energy
            if (previousEnergy) {
                queryClient.setQueryData<EnergyStatus>(queryKeys.energy.status, {
                    ...previousEnergy,
                    energy: Math.min(
                        previousEnergy.maxEnergy,
                        previousEnergy.energy + variables.amount
                    ),
                });
            }

            return { previousEnergy, previousDiamonds };
        },
        onSuccess: (data) => {
            // Update diamond balance with actual cost
            const currentDiamonds = queryClient.getQueryData<DiamondBalance>(
                queryKeys.diamonds.balance
            );
            if (currentDiamonds) {
                queryClient.setQueryData<DiamondBalance>(queryKeys.diamonds.balance, {
                    diamonds: currentDiamonds.diamonds - data.diamondsSpent,
                });
            }
        },
        onError: (err, variables, context) => {
            if (context?.previousEnergy) {
                queryClient.setQueryData(
                    queryKeys.energy.status,
                    context.previousEnergy
                );
            }
            if (context?.previousDiamonds) {
                queryClient.setQueryData(
                    queryKeys.diamonds.balance,
                    context.previousDiamonds
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.energy.status });
            queryClient.invalidateQueries({ queryKey: queryKeys.diamonds.balance });
            queryClient.invalidateQueries({
                queryKey: queryKeys.energy.transactions({}),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.diamonds.transactions({}),
            });
        },
        ...options,
    });
}

/**
 * Get energy pricing information (static data)
 */
export function useEnergyPricing(
    options?: Omit<UseQueryOptions<EnergyPricing>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.energy.pricing,
        queryFn: () => economyService.getEnergyPricing(),
        staleTime: Infinity, // Pricing rarely changes
        ...options,
    });
}

/**
 * Get energy transaction history with pagination
 */
export function useEnergyTransactions(
    params: TransactionHistoryParams = {},
    options?: Omit<
        UseQueryOptions<CurrencyTransaction[]>,
        'queryKey' | 'queryFn'
    >
) {
    return useQuery({
        queryKey: queryKeys.energy.transactions(params),
        queryFn: () => economyService.getEnergyTransactions(params),
        ...options,
    });
}

// ============================================================================
// DIAMOND HOOKS
// ============================================================================

/**
 * Get current diamond balance
 */
export function useDiamondBalance(
    options?: Omit<UseQueryOptions<DiamondBalance>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.diamonds.balance,
        queryFn: () => economyService.getDiamondBalance(),
        ...options,
    });
}

/**
 * Purchase diamonds (after payment verification)
 */
export function usePurchaseDiamonds(
    options?: UseMutationOptions<
        PurchaseDiamondsResponse,
        Error,
        PurchaseDiamondsRequest
    >
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: PurchaseDiamondsRequest) =>
            economyService.purchaseDiamonds(data),
        onSuccess: (data) => {
            // Update balance optimistically
            queryClient.setQueryData<DiamondBalance>(queryKeys.diamonds.balance, {
                diamonds: data.diamonds,
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.diamonds.balance });
            queryClient.invalidateQueries({
                queryKey: queryKeys.diamonds.transactions({}),
            });
        },
        ...options,
    });
}

/**
 * Spend diamonds on in-app purchases
 */
export function useSpendDiamonds(
    options?: UseMutationOptions<
        SpendDiamondsResponse,
        Error,
        SpendDiamondsRequest
    >
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SpendDiamondsRequest) =>
            economyService.spendDiamonds(data),
        onMutate: async (variables): Promise<{ previousDiamonds: DiamondBalance | undefined }> => {
            await queryClient.cancelQueries({ queryKey: queryKeys.diamonds.balance });

            const previousDiamonds = queryClient.getQueryData<DiamondBalance>(
                queryKeys.diamonds.balance
            );

            // Optimistically update
            if (previousDiamonds) {
                queryClient.setQueryData<DiamondBalance>(queryKeys.diamonds.balance, {
                    diamonds: previousDiamonds.diamonds - variables.amount,
                });
            }

            return { previousDiamonds };
        },
        onError: (err, variables, context) => {
            if (context?.previousDiamonds) {
                queryClient.setQueryData(
                    queryKeys.diamonds.balance,
                    context.previousDiamonds
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.diamonds.balance });
            queryClient.invalidateQueries({
                queryKey: queryKeys.diamonds.transactions({}),
            });
        },
        ...options,
    });
}

/**
 * Get diamond transaction history with pagination
 */
export function useDiamondTransactions(
    params: TransactionHistoryParams = {},
    options?: Omit<
        UseQueryOptions<CurrencyTransaction[]>,
        'queryKey' | 'queryFn'
    >
) {
    return useQuery({
        queryKey: queryKeys.diamonds.transactions(params),
        queryFn: () => economyService.getDiamondTransactions(params),
        ...options,
    });
}
