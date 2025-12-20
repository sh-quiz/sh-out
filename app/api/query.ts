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
} from '../../lib/economy';





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






export function useEnergy(
    options?: Omit<UseQueryOptions<EnergyStatus>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.energy.status,
        queryFn: () => economyService.getEnergy(),
        refetchInterval: 30 * 1000,
        ...options,
    });
}


export function useConsumeEnergy(
    options?: UseMutationOptions<
        ConsumeEnergyResponse,
        Error,
        ConsumeEnergyRequest,
        { previousEnergy: EnergyStatus | undefined }
    >
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ConsumeEnergyRequest) =>
            economyService.consumeEnergy(data),
        onMutate: async (variables): Promise<{ previousEnergy: EnergyStatus | undefined }> => {

            await queryClient.cancelQueries({ queryKey: queryKeys.energy.status });


            const previousEnergy = queryClient.getQueryData<EnergyStatus>(
                queryKeys.energy.status
            );


            if (previousEnergy) {
                queryClient.setQueryData<EnergyStatus>(queryKeys.energy.status, {
                    ...previousEnergy,
                    energy: previousEnergy.energy - variables.amount,
                });
            }

            return { previousEnergy };
        },
        onError: (err, variables, context) => {

            if (context?.previousEnergy) {
                queryClient.setQueryData(
                    queryKeys.energy.status,
                    context.previousEnergy
                );
            }
        },
        onSettled: () => {

            queryClient.invalidateQueries({ queryKey: queryKeys.energy.status });
            queryClient.invalidateQueries({
                queryKey: queryKeys.energy.transactions(),
            });
        },
        ...options,
    });
}


export function useRefillEnergy(
    options?: UseMutationOptions<
        RefillEnergyResponse,
        Error,
        RefillEnergyRequest,
        { previousEnergy: EnergyStatus | undefined; previousDiamonds: DiamondBalance | undefined }
    >
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
                queryKey: queryKeys.energy.transactions(),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.diamonds.transactions(),
            });
        },
        ...options,
    });
}


export function useEnergyPricing(
    options?: Omit<UseQueryOptions<EnergyPricing>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.energy.pricing,
        queryFn: () => economyService.getEnergyPricing(),
        staleTime: Infinity,
        ...options,
    });
}


export function useEnergyTransactions(
    params: TransactionHistoryParams = ,
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






export function useDiamondBalance(
    options?: Omit<UseQueryOptions<DiamondBalance>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: queryKeys.diamonds.balance,
        queryFn: () => economyService.getDiamondBalance(),
        ...options,
    });
}


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

            queryClient.setQueryData<DiamondBalance>(queryKeys.diamonds.balance, {
                diamonds: data.diamonds,
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.diamonds.balance });
            queryClient.invalidateQueries({
                queryKey: queryKeys.diamonds.transactions(),
            });
        },
        ...options,
    });
}


export function useSpendDiamonds(
    options?: UseMutationOptions<
        SpendDiamondsResponse,
        Error,
        SpendDiamondsRequest,
        { previousDiamonds: DiamondBalance | undefined }
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
                queryKey: queryKeys.diamonds.transactions(),
            });
        },
        ...options,
    });
}


export function useDiamondTransactions(
    params: TransactionHistoryParams = ,
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
