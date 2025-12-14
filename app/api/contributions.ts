import { api } from './client';

export interface Contribution {
    date: string;
    count: number;
}

export const getContributions = async (): Promise<Contribution[]> => {
    const { data } = await api.get('/contributions');
    return data;
};
