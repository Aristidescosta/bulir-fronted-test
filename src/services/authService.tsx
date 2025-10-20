"use client"

import api from '@/lib/api';
import { IAuthResponse, ILoginData, IRegisterData, IUser } from '@/types/UserType';

export const authService = {
    register: async (userData: IRegisterData): Promise<IUser> => {
        const response = await api.post<IUser>('/users', userData);
        return response.data;
    },

    login: async (credentials: ILoginData): Promise<IAuthResponse> => {
        const response = await api.post<IAuthResponse>('/auth/login', credentials);
        console.log("RESPONSE LOGIN", response);
        if (response.data.data) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }

        return response.data;
    },

    logout: (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: async (): Promise<IUser> => {
        const response = await api.get<IUser>('/auth/me');
        return response.data;
    },

    isAuthenticated: (): boolean => {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem('token');
    },

    getUser: (): IUser | null => {
        console.log("WINDOW: ", window)
        if (typeof window === 'undefined') return null;
        const user = localStorage.getItem('user');
        return user ? (JSON.parse(user) as IUser) : null;
    },
};
