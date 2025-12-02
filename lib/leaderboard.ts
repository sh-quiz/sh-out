import { api } from './api';

export interface LeaderboardEntry {
    rank: number;
    userId: number;
    score: number;
    user: {
        firstName: string;
        lastName: string;
        avatar?: string;
    } | null;
}

export interface UserRank {
    userId: number;
    rank: number;
    score: number;
    month: string;
    year: number;
}

export const fetchGlobalLeaderboard = async (limit: number = 10): Promise<LeaderboardEntry[]> => {
    const response = await api.get(`/leaderboards/global?limit=${limit}`);
    return response.data;
};

export const fetchUserRank = async (): Promise<UserRank> => {
    const response = await api.get('/leaderboards/me');
    return response.data;
};
