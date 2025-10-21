/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, JSX } from 'react';
import { walletService } from '@/services/walletService';
import { ETransactionType, ITransaction } from '@/types/wallet';
import { AxiosError } from 'axios';
import { showApiErrors } from '@/utils/helpers';
import { toast } from 'sonner';

type TabValue = 'all' | 'credito' | 'debito';

interface UseWalletReturn {
    transactions: ITransaction[];
    filteredTransactions: ITransaction[];
    loading: boolean;
    activeTab: TabValue;
    setActiveTab: (tab: TabValue) => void;
    loadTransactions: () => Promise<void>;
    getTransactionIcon: (type: ETransactionType) => React.ReactNode;
    getTransactionColor: (type: ETransactionType) => string;
    getTipoLabel: (type: ETransactionType) => string;
}

export function useWallet(): UseWalletReturn {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<ITransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabValue>('all');

    const loadTransactions = async (): Promise<void> => {
        try {
            setLoading(true);
            const data = await walletService.getTransactions();
            setTransactions(data.data);
        } catch (error) {
            const err = error as AxiosError<any>;
            const errors = err.response?.data?.errors;

            if (errors && (typeof errors === 'object')) {
                showApiErrors(errors);
            } else if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Houve um erro interno, tente novamente mais tarde!");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    useEffect(() => {
        filterTransactions();
    }, [transactions, activeTab]);

    const filterTransactions = (): void => {
        let filtered = [...transactions];

        switch (activeTab) {
            case 'credito':
                filtered = filtered.filter((t) =>
                    [ETransactionType.DEPOSIT, ETransactionType.RECEIVED, ETransactionType.REFUND].includes(t.type)
                );
                break;
            case 'debito':
                filtered = filtered.filter((t) =>
                    [ETransactionType.WITHDRAWAL, ETransactionType.PAYMENT].includes(t.type)
                );
                break;
            default:
                break;
        }

        setFilteredTransactions(filtered);
    };

    const getTransactionIcon = (type: ETransactionType): JSX.Element => {
        const icons = {
            [ETransactionType.DEPOSIT]: '⬇️',
            [ETransactionType.REFUND]: '↩️',
            [ETransactionType.RECEIVED]: '💰',
            [ETransactionType.WITHDRAWAL]: '⬆️',
            [ETransactionType.PAYMENT]: '💸',
        };

        return <span className="text-lg" > { icons[type] || '💳' } </span>;
    };


    const getTransactionColor = (type: ETransactionType): string => {
        const isCredit = [ETransactionType.DEPOSIT, ETransactionType.RECEIVED, ETransactionType.REFUND].includes(type);
        return isCredit ? 'text-green-600' : 'text-red-600';
    };

    const getTipoLabel = (type: ETransactionType): string => {
        const labels: Record<ETransactionType, string> = {
            [ETransactionType.DEPOSIT]: 'Crédito',
            [ETransactionType.WITHDRAWAL]: 'Saque',
            [ETransactionType.PAYMENT]: 'Pagamento',
            [ETransactionType.RECEIVED]: 'Recebimento',
            [ETransactionType.REFUND]: 'Estorno',
        };
        return labels[type] || type;
    };

    return {
        transactions,
        filteredTransactions,
        loading,
        activeTab,
        setActiveTab,
        loadTransactions,
        getTransactionIcon,
        getTransactionColor,
        getTipoLabel,
    };
}