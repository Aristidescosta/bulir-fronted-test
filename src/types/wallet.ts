
export interface IGetTransactionsQuery {
    type?: ETransactionType;
    page?: number;
    limit?: number;
}

export enum ETransactionType {
    DEPOSIT = 'DEPOSIT',         // Depósito/recarga
    WITHDRAWAL = 'WITHDRAWAL',   // Saque
    PAYMENT = 'PAYMENT',         // Pagamento (cliente paga)
    RECEIVED = 'RECEIVED',       // Recebimento (provedor recebe)
    REFUND = 'REFUND',          // Reembolso (cancelamento)
}

export interface IBalance {
    balance: number;
    user_id: string
}

export interface ITransaction {
    id: string;
    user_id: string;
    booking_id: string | null;
    type: ETransactionType;
    amount: number;
    balance_before: number;
    balance_after: number;
    description: string;
    created_at: Date;
}