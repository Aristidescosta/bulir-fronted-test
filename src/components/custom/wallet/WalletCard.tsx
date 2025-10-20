'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Wallet, Plus, ArrowUpRight, Eye, EyeOff } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { walletService } from '@/services/walletService';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface WalletCardProps {
    compact?: boolean;
}

interface IBalanceResponse {
    saldo: number;
}

export default function WalletCard({ compact = false }: WalletCardProps) {
    const { isProvider } = useAuth();
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [showBalance, setShowBalance] = useState(true);

    useEffect(() => {
        loadBalance();
    }, []);

    const loadBalance = async () => {
        try {
            setLoading(true);
            const data = await walletService.getBalance();
            setBalance(data.data.balance);
        } catch (error) {
            console.error('Erro ao carregar saldo:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-9 w-full" />
                </CardContent>
            </Card>
        );
    }

    if (compact) {
        return (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                        <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm opacity-90">Saldo Disponível</p>
                        <p className="text-2xl font-bold">
                            {showBalance ? formatCurrency(balance || 0) : '••••••'}
                        </p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-white hover:bg-white/20"
                >
                    {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
            </div>
        );
    }

    return (
        <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        <CardTitle className="text-white">Minha Carteira</CardTitle>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowBalance(!showBalance)}
                        className="text-white hover:bg-white/20"
                    >
                        {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </div>
                <CardDescription className="text-blue-100">
                    {isProvider()
                        ? 'Receba pagamentos dos seus serviços'
                        : 'Saldo disponível para contratações'}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="text-sm text-blue-100 mb-1">Saldo Disponível</p>
                    <p className="text-4xl font-bold">
                        {showBalance ? formatCurrency(balance || 0) : '••••••'}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button asChild variant="secondary" className="flex-1">
                        <Link href="/wallet/recharge">
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar Crédito
                        </Link>
                    </Button>
                    {isProvider() && (
                        <Button asChild variant="secondary" className="flex-1">
                            <Link href="/wallet/withdraw">
                                <ArrowUpRight className="mr-2 h-4 w-4" />
                                Sacar
                            </Link>
                        </Button>
                    )}
                </div>

                <Button asChild variant="ghost" className="w-full text-white hover:bg-white/20">
                    <Link href="/wallet">Ver Extrato</Link>
                </Button>
            </CardContent>
        </Card>
    );
}
