/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { walletService } from '@/services/walletService';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { showApiErrors } from '@/utils/helpers';

interface UseRechargeReturn {
    amount: string;
    description: string;
    loading: boolean;
    setAmount: (amount: string) => void;
    setDescription: (description: string) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    quickAmounts: number[];
}

export function useRecharge(): UseRechargeReturn {
    const router = useRouter();
    const [amount, setAmount] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const quickAmounts = [5000, 10000, 20000, 50000, 100000];

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        const value = parseFloat(amount.replaceAll(',', '.'));
        if (!value || value <= 0) {
            toast.error('Informe um valor válido');
            return;
        }

        if (value < 1000) {
            toast.error('O valor mínimo de recarga é AOA 1.000,00');
            return;
        }

        try {
            setLoading(true);
            await walletService.recharge(value, description);
            toast.success('Recarga realizada com sucesso!');
            router.push('/wallet');
        } catch (error: unknown) {
            const err = error as AxiosError<any>;
            const errors = err.response?.data?.errors;

            if (errors && (typeof errors === 'object')) {
                showApiErrors(errors);
            } else if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Erro ao processar recarga");
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        amount,
        description,
        loading,
        setAmount,
        setDescription,
        handleSubmit,
        quickAmounts,
    };
}