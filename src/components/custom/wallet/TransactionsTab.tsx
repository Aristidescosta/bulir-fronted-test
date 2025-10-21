import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from 'lucide-react';
import { ETransactionType, ITransaction } from '@/types/wallet';
import { TransactionsLoading } from './TransactionsLoading';
import { EmptyTransactions } from './EmptyTransactions';
import React from 'react';
import { ItemTransaction } from './ItemTransaction';

interface TransactionsTabProps {
    transactions: ITransaction[];
    filteredTransactions: ITransaction[];
    loading: boolean;
    activeTab: 'all' | 'credito' | 'debito';
    onTabChange: (tab: 'all' | 'credito' | 'debito') => void;
    getTransactionIcon: (type: ETransactionType) => React.ReactNode;
    getTransactionColor: (type: ETransactionType) => string;
    getTipoLabel: (type: ETransactionType) => string;
}

export function TransactionsTab({
    transactions,
    filteredTransactions,
    loading,
    activeTab,
    onTabChange,
    getTransactionIcon,
    getTransactionColor,
    getTipoLabel,
}: TransactionsTabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Extrato
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={(e) => onTabChange(e as 'all' | 'credito' | 'debito')}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all">Todas</TabsTrigger>
                        <TabsTrigger value="credito">Entradas</TabsTrigger>
                        <TabsTrigger value="debito">Saídas</TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="mt-6">
                        {loading ? (
                            <TransactionsLoading />
                        ) : filteredTransactions.length === 0 ? (
                            <EmptyTransactions />
                        ) : (
                            <TransactionsList
                                transactions={filteredTransactions}
                                getTransactionIcon={getTransactionIcon}
                                getTransactionColor={getTransactionColor}
                                getTipoLabel={getTipoLabel}
                            />
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

function TransactionsList({
    transactions,
    getTransactionIcon,
    getTransactionColor,
    getTipoLabel
}: {
    transactions: ITransaction[];
    getTransactionIcon: (type: ETransactionType) => React.ReactNode;
    getTransactionColor: (type: ETransactionType) => string;
    getTipoLabel: (type: ETransactionType) => string;
}) {
    return (
        <div className="space-y-3">
            {transactions.map((transaction) => (
                <ItemTransaction
                    key={transaction.id}
                    transaction={transaction}
                    getIcon={getTransactionIcon}
                    getColor={getTransactionColor}
                    getTipoLabel={getTipoLabel}
                />
            ))}
        </div>
    );
}