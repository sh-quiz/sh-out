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

export interface UpdateProfileData {
    firstName?: string;
    lastName?: string;
    school?: string;
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

    async updateProfile(data: UpdateProfileData, file?: File | null): Promise<UserProfile> {
        const formData = new FormData();

        if (data.firstName) formData.append('firstName', data.firstName);
        if (data.lastName) formData.append('lastName', data.lastName);
        if (data.school) formData.append('school', data.school);
        if (file) formData.append('file', file);

        const response = await api.patch('/users/me', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};
