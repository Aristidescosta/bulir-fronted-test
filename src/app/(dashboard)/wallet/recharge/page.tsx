/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { walletService } from '@/services/walletService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CreditCard, Smartphone, DollarSign, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { AxiosError } from 'axios';
import { showApiErrors } from '@/utils/helpers';

type PaymentMethod = 'credit_card' | 'mobile_money' | 'bank_transfer';

export default function RechargePage() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [amount, setAmount] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    
    const quickAmounts = [5000, 10000, 20000, 50000, 100000];

    const handleSubmit = async (e: FormEvent) => {
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
                if (errors) showApiErrors(errors);
            }
            else if (err.response?.data?.message) {
                toast.error(err.response?.data?.message)
            }
            else {
                toast.error("Erro ao processar recarga")
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <Button variant="ghost" asChild>
                <Link href="/wallet">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Carteira
                </Link>
            </Button>

            <div>
                <h1 className="text-3xl font-bold">Adicionar Crédito</h1>
                <p className="text-muted-foreground">Recarregue sua carteira para contratar serviços ou receber pagamentos.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detalhes da Recarga</CardTitle>
                    <CardDescription>Escolha o valor e método de pagamento</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {quickAmounts.map((val) => (
                                <Button
                                    type="button"
                                    key={val}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setAmount(val.toString())}
                                >
                                    {formatCurrency(val)}
                                </Button>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Valor da Recarga</Label>
                            <Input
                                id="amount"
                                type="text"
                                placeholder="Digite o valor"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>

                        <Separator />
                        <Textarea onChange={(e) => setDescription(e.target.value)} value={description} />

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processando...
                                </>
                            ) : (
                                'Recarregar'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
