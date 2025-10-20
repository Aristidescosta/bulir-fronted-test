/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { JSX, useEffect, useState } from 'react';
import { walletService } from '@/services/walletService';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import WalletCard from '@/components/custom/wallet/WalletCard';
import { ETransactionType, ITransaction } from '@/types/wallet';
import { AxiosError } from 'axios';
import { showApiErrors } from '@/utils/helpers';
import { toast } from 'sonner';

interface TransactionItemProps {
    transaction: ITransaction;
    getIcon: (tipo: ETransactionType) => JSX.Element;
    getColor: (tipo: ETransactionType) => string;
    getTipoLabel: (tipo: ETransactionType) => string;
}

export default function WalletPage() {
    const { isProvider } = useAuth();
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<ITransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'credito' | 'debito'>('all');

    useEffect(() => {
        loadTransactions();
    }, []);

    useEffect(() => {
        filterTransactions();
    }, [transactions, activeTab]);

    const loadTransactions = async () => {
        try {
            setLoading(true);
            const data = await walletService.getTransactions();
            setTransactions(data.data);
        } catch (error) {
            const err = error as AxiosError<any>;

            const errors = err.response?.data?.errors;
            if (errors && (typeof errors === 'object')) {
                if (errors) showApiErrors(errors);
            }
            else if (err.response?.data?.message) {
                toast.error(err.response?.data?.message)
            }
            else {
                toast.error("Houve um erro interno, tente novamente mais tarde!")
            }
        } finally {
            setLoading(false);
        }
    };

    const filterTransactions = () => {
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
                // all - sem filtro
                break;
        }

        setFilteredTransactions(filtered);
    };


    const getTransactionIcon = (tipo: ETransactionType) => {
        switch (tipo) {
            case ETransactionType.DEPOSIT:
            case ETransactionType.REFUND:
            case ETransactionType.RECEIVED:
                return <ArrowDownLeft className="h-4 w-4 text-green-600" />;

            case ETransactionType.WITHDRAWAL:
            case ETransactionType.PAYMENT:
                return <ArrowUpRight className="h-4 w-4 text-red-600" />;

            default:
                return <Wallet className="h-4 w-4" />;
        }
    };

    const getTransactionColor = (tipo: ETransactionType) => {
        switch (tipo) {
            case ETransactionType.DEPOSIT:
            case ETransactionType.RECEIVED:
            case ETransactionType.REFUND:
                return 'text-green-600';

            case ETransactionType.WITHDRAWAL:
            case ETransactionType.PAYMENT:
                return 'text-red-600';

            default:
                return 'text-gray-600';
        }
    };

    const getTipoLabel = (tipo: ETransactionType) => {
        const labels: Record<ETransactionType, string> = {
            [ETransactionType.DEPOSIT]: 'Crédito',
            [ETransactionType.WITHDRAWAL]: 'Saque',
            [ETransactionType.PAYMENT]: 'Pagamento',
            [ETransactionType.RECEIVED]: 'Recebimento',
            [ETransactionType.REFUND]: 'Estorno',
        };
        return labels[tipo] || tipo;
    };


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Carteira</h1>
                <p className="text-muted-foreground">Gerencie seu saldo e transações</p>
            </div>

            <WalletCard />

            <div className="grid gap-4 md:grid-cols-2">
                <Link href="/wallet/recharge" className="cursor-pointer hover:shadow-md transition-shadow">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Plus className="h-5 w-5 text-green-600" />
                                </div>
                                <CardTitle>Adicionar Crédito</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Recarregue sua carteira para contratar serviços</CardDescription>
                        </CardContent>
                    </Card>
                </Link>

                {isProvider() && (
                    <Link href="/wallet/withdraw" className="cursor-pointer hover:shadow-md transition-shadow">
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <ArrowUpRight className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <CardTitle>Solicitar Saque</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>Transfira seu saldo para sua conta bancária</CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Extrato
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={(e) => setActiveTab(e as 'all' | 'credito' | 'debito')}>
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="all">Todas</TabsTrigger>
                            <TabsTrigger value="credito">Entradas</TabsTrigger>
                            <TabsTrigger value="debito">Saídas</TabsTrigger>
                        </TabsList>

                        <TabsContent value={activeTab} className="mt-6">
                            {loading ? (
                                <div>Carregando...</div>
                            ) : filteredTransactions.length === 0 ? (
                                <div className="text-center py-12">
                                    <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                                    <h3 className="text-lg font-semibold mb-2">Nenhuma transação encontrada</h3>
                                    <p className="text-muted-foreground">Suas transações aparecerão aqui</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredTransactions.map((transaction) => (
                                        <TransactionItem
                                            key={transaction.id}
                                            transaction={transaction}
                                            getIcon={getTransactionIcon}
                                            getColor={getTransactionColor}
                                            getTipoLabel={getTipoLabel}
                                        />
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}

interface TransactionItemProps {
    transaction: ITransaction;
    getIcon: (type: ETransactionType) => JSX.Element;
    getColor: (type: ETransactionType) => string;
    getTipoLabel: (type: ETransactionType) => string;
}

function TransactionItem({
    transaction,
    getIcon,
    getColor,
    getTipoLabel,
}: TransactionItemProps) {
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

