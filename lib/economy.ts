import { api } from '../api/client';

// ============================================================================
// TYPES - Energy
// ============================================================================

export interface EnergyStatus {
    energy: number;
    maxEnergy: number;
    nextRefillAt: Date | null;
    refillRate: number;
}

export interface ConsumeEnergyRequest {
    amount: number;
    reason: string;
    metadata?: Record<string, any>;
    idempotencyKey?: string;
}

export interface ConsumeEnergyResponse {
    energy: number;
    maxEnergy: number;
}

export interface RefillEnergyRequest {
    amount: number;
    idempotencyKey?: string;
}

export interface RefillEnergyResponse {
    energy: number;
    maxEnergy: number;
    diamondsSpent: number;
}

export interface EnergyPricing {
    costPerEnergy: number;
    refillRate: number;
}

// ============================================================================
// TYPES - Diamonds
// ============================================================================

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
    diamonds: number;
    transactionId: number;
}

export interface SpendDiamondsRequest {
    amount: number;
    reason: string;
    metadata?: Record<string, any>;
    idempotencyKey?: string;
}

export interface SpendDiamondsResponse {
    diamonds: number;
    transactionId: number;
}

// ============================================================================
// TYPES - Transactions
// ============================================================================

export interface CurrencyTransaction {
    id: number;
    userId: number;
    type: string;
    currency: string;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    reason: string | null;
    metadata: Record<string, any> | null;
    createdAt: string;
}

export interface TransactionHistoryParams {
    limit?: number;
    offset?: number;
}

// ============================================================================
// ECONOMY SERVICE
// ============================================================================

export const economyService = {
    // Energy endpoints
    async getEnergy(): Promise<EnergyStatus> {
        const response = await api.get('/energy');
        return response.data;
    },

    async consumeEnergy(data: ConsumeEnergyRequest): Promise<ConsumeEnergyResponse> {
        const response = await api.post('/energy/consume', data);
        return response.data;
    },

    async refillEnergy(data: RefillEnergyRequest): Promise<RefillEnergyResponse> {
        const response = await api.post('/energy/refill', data);
        return response.data;
    },

    async getEnergyPricing(): Promise<EnergyPricing> {
        const response = await api.get('/energy/pricing');
        return response.data;
    },

    async getEnergyTransactions(params: TransactionHistoryParams = {}): Promise<CurrencyTransaction[]> {
        const { limit = 50, offset = 0 } = params;
        const response = await api.get('/energy/transactions', {
            params: { limit, offset },
        });
        return response.data;
    },

    // Diamond endpoints
    async getDiamondBalance(): Promise<DiamondBalance> {
        const response = await api.get('/diamonds/balance');
        return response.data;
    },

    async purchaseDiamonds(data: PurchaseDiamondsRequest): Promise<PurchaseDiamondsResponse> {
        const response = await api.post('/diamonds/purchase', data);
        return response.data;
    },

    async spendDiamonds(data: SpendDiamondsRequest): Promise<SpendDiamondsResponse> {
        const response = await api.post('/diamonds/spend', data);
        return response.data;
    },

    async getDiamondTransactions(params: TransactionHistoryParams = {}): Promise<CurrencyTransaction[]> {
        const { limit = 50, offset = 0 } = params;
        const response = await api.get('/diamonds/transactions', {
            params: { limit, offset },
        });
        return response.data;
    },
};
