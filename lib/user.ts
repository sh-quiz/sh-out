import { api } from '../app/api/client';

export interface UserProfile {
    name: string;
    email: string;
    school: string | null;
    profilePicture: string | null;
}

export interface UpdateProfileInput {
    firstName?: string;
    lastName?: string;
    school?: string;
    file?: File;
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

    async updateProfile(data: UpdateProfileInput): Promise<UserProfile> {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null && key !== 'file') {
                formData.append(key, value as string);
            }
        });

        if (data.file) {
            formData.append('file', data.file);
        }

        const response = await api.patch('/users/me', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
