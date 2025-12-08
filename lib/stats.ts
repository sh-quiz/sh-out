import { api } from '../api/client';

export interface UserEnergy {
    energy: number;
    maxEnergy: number;
    nextRefillAt: string | null;
}

export interface UserStats {
    id: number;
    userId: number;
    xp: number;
    gems: number;
    dayStreak: number;
    top3Finishes: number;
    energy: number;
    maxEnergy: number;
    lastEnergyRefillAt: string;
    createdAt: string;
    updatedAt: string;
}

export const statsService = {
    async getEnergy(userId: number): Promise<UserEnergy> {
        const response = await api.get(`/users/${userId}/energy`);
        return response.data;
    },

    async getStats(userId: number): Promise<UserStats> {
        const response = await api.get(`/users/${userId}/stats`);
        return response.data;
    },
};
