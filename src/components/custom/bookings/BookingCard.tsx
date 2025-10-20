import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EBookingStatus, ECancelledBy, IBookingWithDetails } from '@/types/booking';
import { formatCurrency, formatDate, formatTime } from '@/utils/formatters';
import { Calendar, Clock, DollarSign, Package, User } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

interface BookingCardProps {
    booking: IBookingWithDetails;
    isProvider: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    getStatusColor: (status: EBookingStatus) => string;
    getStatusLabel: (status: EBookingStatus) => string;
}

export const BookingCard = ({ booking, isProvider, onConfirm, onCancel, getStatusColor, getStatusLabel }: BookingCardProps) => {
    const isPast = new Date(booking.booking_date) < new Date();
    const canCancel = !isPast && (booking.status === EBookingStatus.PENDING || booking.status === EBookingStatus.CONFIRMED);
    const canConfirm = isProvider && booking.status === EBookingStatus.PENDING;

    return (
        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{booking.service.name}</h3>
                        <Badge className={getStatusColor(booking.status)}>
                            {getStatusLabel(booking.status)}
                        </Badge>
                    </div>

                    <div className="grid gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(booking.booking_date)}</span>
                            <Clock className="h-4 w-4 ml-2" />
                            <span>{formatTime(booking.start_time)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>
                                {isProvider
                                    ? `Cliente: ${booking.customer?.name}`
                                    : `Provedor: ${booking.provider.name}`}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            <span>{booking.service.category}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-semibold text-blue-600">
                                {formatCurrency(booking.total_price)}
                            </span>
                        </div>

                        {booking.status === EBookingStatus.CANCELLED && booking.cancellation_reason && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700">
                                <p className="text-xs font-semibold mb-1">Motivo do cancelamento:</p>
                                <p className="text-xs">{booking.cancellation_reason}</p>
                                <p className="text-xs mt-1">
                                    Cancelado por: {booking.cancelled_by === ECancelledBy.CUSTOMER ? 'Cliente' : 'Provedor'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/bookings/${booking.id}`}>Ver Detalhes</Link>
                    </Button>

                    {canConfirm && (
                        <Button onClick={onConfirm} size="sm">
                            Confirmar
                        </Button>
                    )}

                    {canCancel && (
                        <Button onClick={onCancel} variant="destructive" size="sm">
                            Cancelar
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
