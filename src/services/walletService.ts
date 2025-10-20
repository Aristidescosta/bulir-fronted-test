import api from '@/lib/api';
import { IApiResponse } from './bookingService';
import { IBalance, IGetTransactionsQuery, ITransaction } from '@/types/wallet';

export const walletService = {
    getBalance: async (): Promise<IApiResponse<IBalance>> => {
        const response = await api.get('/wallet/balance');
        return response.data;
    },

    getTransactions: async (filters: IGetTransactionsQuery = {}): Promise<IApiResponse<ITransaction[]>> => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            if (Array.isArray(value)) {
                value.forEach(v => params.append(key, String(v)));
            } else {
                params.append(key, String(value));
            }
        });

        const response = await api.get(`/wallet/transactions?${params.toString()}`);
        return response.data;
    },


    recharge: async (amount: number, description: string): Promise<IApiResponse<ITransaction>> => {
        const response = await api.post('/wallet/deposit', {
            amount,
            description,
        });
        return response.data;
    }
};