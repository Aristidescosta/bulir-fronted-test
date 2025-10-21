import { ETransactionType, ITransaction } from '@/types/wallet';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import React from 'react'

interface TransactionItemProps {
    transaction: ITransaction;
    getIcon: (type: ETransactionType) => React.ReactNode;
    getColor: (type: ETransactionType) => string;
    getTipoLabel: (type: ETransactionType) => string;
}

export const ItemTransaction = ({
    transaction,
    getIcon,
    getColor,
    getTipoLabel,
}: TransactionItemProps) => {
    const isCredit = [ETransactionType.DEPOSIT, ETransactionType.RECEIVED, ETransactionType.REFUND].includes(transaction.type);

    return (
        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${isCredit ? 'bg-green-100' : 'bg-red-100'}`}>
                    {getIcon(transaction.type)}
                </div>
                <div>
                    <p className="font-medium">{transaction.description || getTipoLabel(transaction.type)}</p>
                    <p className="text-sm text-muted-foreground">{formatDateTime(transaction.created_at)}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={`font-bold ${getColor(transaction.type)}`}>
                    {isCredit ? '+' : '-'} {formatCurrency(Math.abs(transaction.amount))}
                </p>
                <p className="text-xs text-muted-foreground">
                    Saldo: {formatCurrency(transaction.balance_after)}
                </p>
            </div>
        </div>
    );
}
