/* eslint-disable @typescript-eslint/no-explicit-any */
import { authService } from '@/services/authService';
import axios, {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token && config.headers) {
                (config.headers as any).Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                authService.logout();
                return Promise.reject(error);
            }

            try {
                const response = await api.post('/auth/refresh', { refreshToken });
                const newToken = response.data.token;

                localStorage.setItem('token', newToken);

                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                authService.logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


export default api;
