/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { toast } from 'sonner';
import { IUser } from '@/types/UserType';

interface FormData {
    nome: string;
    email: string;
    telefone: string;
}

interface UseProfileReturn {
    profileData: IUser | null;
    formData: FormData;
    editMode: boolean;
    loading: boolean;
    error: string;
    setEditMode: (editMode: boolean) => void;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    handleCancel: () => void;
    loadProfile: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
    const [profileData, setProfileData] = useState<IUser | null>(null);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({
        nome: '',
        email: '',
        telefone: '',
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const loadProfile = async (): Promise<void> => {
        try {
            const data = await authService.getCurrentUser();
            setProfileData(data.data);
            setFormData({
                nome: data.data.name || '',
                email: data.data.email || '',
                telefone: data.data.phone || '',
            });
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            toast.error('Erro ao carregar perfil');
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // await userService.updateProfile(formData);
            toast.success('Perfil atualizado com sucesso!');
            setEditMode(false);
            loadProfile();
        } catch (err: any) {
            console.error('Erro ao atualizar perfil:', err);
            setError(err.response?.data?.message || 'Erro ao atualizar perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = (): void => {
        setFormData({
            nome: profileData?.name || '',
            email: profileData?.email || '',
            telefone: profileData?.phone || '',
        });
        setEditMode(false);
        setError('');
    };

    return {
        profileData,
        formData,
        editMode,
        loading,
        error,
        setEditMode,
        setFormData,
        handleSubmit,
        handleCancel,
        loadProfile,
    };
}