/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, FormEvent, useEffect } from 'react';
import { bookingService } from '@/services/bookingService';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Calendar, Clock, Loader2, Wallet } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useAuth } from '@/context/AuthContext';
import { IService } from '@/types/service';
import { walletService } from '@/services/walletService';
import Link from 'next/link';
import { toast } from 'sonner';

// Tipos auxiliares
interface IProvider {
    id: string;
    nome: string;
    email: string;
    telefone?: string;
}


interface IBookingModalProps {
    service: IService;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface IFormData {
    data_reserva: string;
    hora_inicio: string;
}

export default function BookingModal({
    service,
    isOpen,
    onClose,
    onSuccess,
}: IBookingModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [checkingBalance, setCheckingBalance] = useState(true);
    const [balance, setBalance] = useState(0);
    const [hasSufficientBalance, setHasSufficientBalance] = useState(false);
    const { user } = useAuth();
    const [formData, setFormData] = useState<IFormData>({
        data_reserva: '',
        hora_inicio: '',
    });

    useEffect(() => {
        if (isOpen) {
            checkBalance();
        }
    }, [isOpen, service]);

    const checkBalance = async () => {
        try {
            setCheckingBalance(true);
            const data = await walletService.getBalance();
            setBalance(data.data.balance);
            setHasSufficientBalance(data.data.balance >= service.price);
        } catch (err) {
            console.error('Erro ao verificar saldo:', err);
            setError('Erro ao verificar saldo');
        } finally {
            setCheckingBalance(false);
        }
    };

    const generateTimeSlots = (): string[] => {
        const slots: string[] = [];
        for (let hour = 8; hour <= 18; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
            if (hour < 18) {
                slots.push(`${hour.toString().padStart(2, '0')}:30`);
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    const getMinDate = (): string => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!formData.data_reserva || !formData.hora_inicio) {
            setError('Por favor, preencha data e horário');
            return;
        }

        try {
            setLoading(true);

            await bookingService.createBooking({
                service_id: service.id,
                booking_date: new Date(formData.data_reserva),
                start_time: formData.hora_inicio,
                customer_id: user?.id || ""
            });

            onSuccess();
        } catch (err: any) {
            console.error('Erro ao criar reserva:', err);
            setError(err.response?.data?.message || 'Erro ao criar reserva');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Reservar Serviço</DialogTitle>
                    <DialogDescription>
                        {service.name} - {formatCurrency(service.price)}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className={`rounded-lg p-4 ${hasSufficientBalance
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Wallet className={`h-4 w-4 ${hasSufficientBalance ? 'text-green-600' : 'text-red-600'
                                    }`} />
                                <span className={`text-sm font-medium ${hasSufficientBalance ? 'text-green-900' : 'text-red-900'
                                    }`}>
                                    Seu Saldo
                                </span>
                            </div>
                            <span className={`font-bold ${hasSufficientBalance ? 'text-green-900' : 'text-red-900'
                                }`}>
                                {formatCurrency(balance)}
                            </span>
                        </div>

                        {!hasSufficientBalance && (
                            <div className="flex items-start gap-2 mt-3 pt-3 border-t border-red-300">
                                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-red-800">
                                    <p className="font-medium mb-1">Saldo insuficiente</p>
                                    <p>
                                        Você precisa de {formatCurrency(service.price - balance)} a mais.
                                    </p>
                                    <Button
                                        asChild
                                        variant="link"
                                        className="h-auto p-0 text-red-700 font-medium"
                                    >
                                        <Link href="/wallet/recharge" onClick={onClose}>
                                            Adicionar crédito →
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="data_reserva">
                            <Calendar className="inline h-4 w-4 mr-2" />
                            Data
                        </Label>
                        <Input
                            id="data_reserva"
                            type="date"
                            min={getMinDate()}
                            value={formData.data_reserva}
                            onChange={(e) =>
                                setFormData({ ...formData, data_reserva: e.target.value })
                            }
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* Horário */}
                    <div className="space-y-2">
                        <Label htmlFor="hora_inicio">
                            <Clock className="inline h-4 w-4 mr-2" />
                            Horário
                        </Label>
                        <select
                            id="hora_inicio"
                            value={formData.hora_inicio}
                            onChange={(e) =>
                                setFormData({ ...formData, hora_inicio: e.target.value })
                            }
                            disabled={loading}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="">Selecione um horário</option>
                            {timeSlots.map((slot) => (
                                <option key={slot} value={slot}>
                                    {slot}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="font-semibold text-sm">Resumo da Reserva</h4>
                        <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Serviço:</span>
                                <span>{service.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Duração:</span>
                                <span>{service.duration} minutos</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Provedor:</span>
                                <span>{service.provider?.name}</span>
                            </div>
                            <div className="flex justify-between font-semibold pt-2 border-t">
                                <span>Total:</span>
                                <span className="text-blue-600">{formatCurrency(service.price)}</span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading || !hasSufficientBalance}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Confirmando...
                                </>
                            ) : (
                                'Confirmar Reserva'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
