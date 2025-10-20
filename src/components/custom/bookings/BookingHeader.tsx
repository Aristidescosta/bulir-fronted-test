import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EBookingStatus } from '@/types/booking';

interface BookingHeaderProps {
    status: EBookingStatus;
    canConfirm: boolean;
    canCancel: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function BookingHeader({
    status,
    canConfirm,
    canCancel,
    onConfirm,
    onCancel
}: BookingHeaderProps) {
    const getStatusColor = (status: EBookingStatus): string => {
        const colors: Record<EBookingStatus, string> = {
            PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            CONFIRMED: 'bg-green-100 text-green-800 border-green-300',
            CANCELLED: 'bg-red-100 text-red-800 border-red-300',
            COMPLETED: 'bg-blue-100 text-blue-800 border-blue-300',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const getStatusLabel = (status: EBookingStatus): string => {
        const labels: Record<EBookingStatus, string> = {
            PENDING: 'Pendente',
            CONFIRMED: 'Confirmada',
            CANCELLED: 'Cancelada',
            COMPLETED: 'Concluída',
        };
        return labels[status] || status;
    };

    return (
        <div className="space-y-6">
            <Button variant="ghost" asChild>
                <Link href="/bookings">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Reservas
                </Link>
            </Button>

            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Detalhes da Reserva</h1>
                    <Badge className={getStatusColor(status)} variant="outline">
                        {getStatusLabel(status)}
                    </Badge>
                </div>

                <div className="flex gap-2">
                    {canConfirm && (
                        <Button onClick={onConfirm}>
                            Confirmar Reserva
                        </Button>
                    )}
                    {canCancel && (
                        <Button variant="destructive" onClick={onCancel}>
                            Cancelar Reserva
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}