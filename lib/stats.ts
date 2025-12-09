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

export interface HeatmapItem {
    date: string;
    count: number;
    details: {
        studySeconds: number;
        quizzesSolved: number;
    };
}

export const statsService = {
    async getEnergy(userId: number): Promise<UserEnergy> {
        const response = await api.get(`/users/${userId}/energy`);
        return response.data;
    },

    async getStats(): Promise<UserStats> {
        const response = await api.get('/users/me/stats');
        return response.data;
    },

    async getHeatmap(year?: number): Promise<HeatmapItem[]> {
        const response = await api.get('/users/me/heatmap', { params: { year } });
        return response.data;
    },
};
