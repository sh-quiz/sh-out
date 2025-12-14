import { api } from '../app/api/client';

export interface UserProfile {
    name: string;
    email: string;
    school: string | null;
    profilePicture: string | null;
}

export interface UserStats {
    xp: number;
    gems: number;
    currentLevel: number;
    diamonds: number;
    dayStreak: number;
    energy: number;
    maxEnergy: number;
}

export const userService = {
    async getProfile(): Promise<UserProfile> {
        const response = await api.get('/users/me');
        return response.data;
    },

    async getStats(): Promise<UserStats> {
        const response = await api.get('/users/me/stats');
        return response.data;
    },
};
