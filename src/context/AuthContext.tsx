'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { IAuthResponse, ILoginData, IRegisterData, IUser } from '@/types/UserType';
import { authService } from '@/services/authService';

interface AuthContextType {
    user: IUser | null;
    loading: boolean;
    login: (credentials: ILoginData) => Promise<IAuthResponse>;
    register: (userData: IRegisterData) => Promise<IUser>;
    logout: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const loadUser = () => {
            const storedUser = authService.getUser();
            setUser(storedUser);
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (credentials: ILoginData): Promise<IAuthResponse> => {
        try {
            const data = await authService.login(credentials);
            setUser(data.user);

            document.cookie = `token=${data.token}; path=/; max-age=86400`;

            router.push('/dashboard');
            return data;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData: IRegisterData): Promise<IUser> => {
        try {
            const data = await authService.register(userData);
            router.push('/login');
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = (): void => {
        authService.logout();
        document.cookie = 'token=; path=/; max-age=0';
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
