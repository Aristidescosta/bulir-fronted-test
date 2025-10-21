import { useAuth } from '@/context/AuthContext';

interface IUser {
    nome: string;
    tipo: 'PROVEDOR' | 'CLIENTE';
}

interface UseNavbarReturn {
    user: IUser | null;
    logout: () => void;
    getInitials: (name?: string) => string;
}

export function useNavbar(): UseNavbarReturn {
    const { user, logout } = useAuth() as {
        user: IUser | null;
        logout: () => void;
    };

    const getInitials = (name?: string): string => {
        if (!name) return '';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return {
        user,
        logout,
        getInitials,
    };
}