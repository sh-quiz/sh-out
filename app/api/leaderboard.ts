import { api } from './client';

export interface LeaderboardUser {
    id: number;
    firstName: string;
    lastName: string;
    school?: string;
    profilePicture?: string;
}

export interface LeaderboardEntry {
    rank: number;
    score: number;
    user: LeaderboardUser;
}

export interface UserRank {
    userId: number;
    rank: number;
    score: number;
    month: string;
    year: number;
}

export const leaderboardService = {
    getGlobalLeaderboard: async (limit: number = 50): Promise<LeaderboardEntry[]> => {
        const { data } = await api.get('/leaderboards/global', {
            params: { limit },
        });
        return data;
    },

    getUserRank: async (): Promise<UserRank> => {
        const { data } = await api.get('/leaderboards/me');
        return data;
    },
};
