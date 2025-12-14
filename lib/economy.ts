import { api } from '../app/api/client';

// ============================================================================
// TYPES
// ============================================================================

export interface EnergyStatus {
    energy: number;
    maxEnergy: number;
    nextRefillAt: string | null;
}

export interface ConsumeEnergyRequest {
    amount: number;
    reason: string;
    metadata?: Record<string, any>;
    idempotencyKey?: string;
}

export interface ConsumeEnergyResponse {
    success: boolean;
    remainingEnergy: number;
}

export interface RefillEnergyRequest {
    amount: number;
    idempotencyKey?: string;
}

export interface RefillEnergyResponse {
    success: boolean;
    newEnergy: number;
    diamondsSpent: number;
}

export interface EnergyPricing {
    refillCost: number; // Diamonds per unit
    maxEnergyUpgradeCost: number;
}

export interface DiamondBalance {
    diamonds: number;
}

export interface PurchaseDiamondsRequest {
    amount: number;
    receiptId: string;
    provider: string;
    idempotencyKey?: string;
}

export interface PurchaseDiamondsResponse {
    success: boolean;
    diamonds: number;
    transactionId: string;
}

export interface SpendDiamondsRequest {
    amount: number;
    reason: string;
    metadata?: Record<string, any>;
    idempotencyKey?: string;
}

export interface SpendDiamondsResponse {
    success: boolean;
    remainingDiamonds: number;
}

export interface TransactionHistoryParams {
    page?: number;
    limit?: number;
    type?: string;
    startDate?: string;
    endDate?: string;
}

export interface CurrencyTransaction {
    id: string;
    amount: number;
    type: 'credit' | 'debit';
    reason: string;
    metadata?: Record<string, any>;
    createdAt: string;
}

// ============================================================================
// SERVICE
// ============================================================================

export const economyService = {
    // Energy
    async getEnergy(): Promise<EnergyStatus> {
        const { data } = await api.get('/energy');
        return data;
    },

    async consumeEnergy(req: ConsumeEnergyRequest): Promise<ConsumeEnergyResponse> {
        const { data } = await api.post('/energy/consume', req);
        return data;
    },

    async refillEnergy(req: RefillEnergyRequest): Promise<RefillEnergyResponse> {
        const { data } = await api.post('/energy/refill', req);
        return data;
    },

    async getEnergyPricing(): Promise<EnergyPricing> {
        // Return static or fetch from API
        return {
            refillCost: 10, // Example: 10 diamonds per refill
            maxEnergyUpgradeCost: 100
        };
        // const { data } = await api.get('/energy/pricing');
        // return data;
    },

    async getEnergyTransactions(params: TransactionHistoryParams): Promise<CurrencyTransaction[]> {
        const { data } = await api.get('/energy/transactions', { params });
        return data;
    },

    // Diamonds
    async getDiamondBalance(): Promise<DiamondBalance> {
        const { data } = await api.get('/diamonds');
        return data;
    },

    async purchaseDiamonds(req: PurchaseDiamondsRequest): Promise<PurchaseDiamondsResponse> {
        const { data } = await api.post('/diamonds/purchase', req);
        return data;
    },

    async spendDiamonds(req: SpendDiamondsRequest): Promise<SpendDiamondsResponse> {
        const { data } = await api.post('/diamonds/spend', req);
        return data;
    },

    async getDiamondTransactions(params: TransactionHistoryParams): Promise<CurrencyTransaction[]> {
        const { data } = await api.get('/diamonds/transactions', { params });
        return data;
    },

    // Conversions (Legacy/Helper)
    async convertDiamondsToEnergy(diamonds: number): Promise<{
        success: boolean;
        spentDiamonds: number;
        gainedEnergy: number;
        currentEnergy: number;
    }> {
        const { data } = await api.post('/energy/convert', { diamonds });
        return data;
    },
};

