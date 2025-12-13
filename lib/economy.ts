import { api } from '../api/client';

export interface EnergyStatus {
    energy: number;
    maxEnergy: number;
    nextRefillAt: string | null;
}

export interface DiamondStatus {
    diamonds: number;
}

export const economyService = {
    async getEnergy(): Promise<EnergyStatus> {
        const { data } = await api.get('/energy');
        return data;
    },

    async getDiamonds(): Promise<DiamondStatus> {
        const { data } = await api.get('/diamonds');
        return data;
    },

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
