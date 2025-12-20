import { api } from '../app/api/client';

export interface SignupData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
    };
    access_token: string;
    refresh_token: string;
}

export const authService = {
    async signup(data: SignupData): Promise<AuthResponse> {
        const response = await api.post('/auth/signup', data);
        this.saveTokens(response.data);
        return response.data;
    },

    async login(data: LoginData): Promise<AuthResponse> {
        const response = await api.post('/auth', data);
        this.saveTokens(response.data);
        return response.data;
    },

    async logout() {
        try {
            const userId = this.getUser()?.id;
            if (userId) {
                await api.post('/auth/logout', { userId });
            }
        } catch (error) {
            console.error('Logout API call failed:', error);
        } finally {
            this.clearTokens();
            console.log('Logged out successfully');
        }
    },

    saveTokens(data: AuthResponse) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));


        document.cookie = `access_token=${data.access_token}; path=/; max-age=86400; SameSite=Strict`;
    },

    clearTokens() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');


        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    },

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('access_token');
    },
};
