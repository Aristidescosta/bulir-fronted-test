import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '@/components/custom/dashboard/EmptyState';
import { StatusBadge } from '@/components/custom/dashboard/StatusBadge';
import { formatCurrency, formatDate, formatTime } from '@/utils/formatters';
import { EBookingStatus, IBookingWithDetails } from '@/types/booking';

interface Props {
    bookings: IBookingWithDetails[];
}

export function BookingsSection({ bookings }: Props) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Reservas Recentes</CardTitle>
                        <CardDescription>Últimas reservas dos seus serviços</CardDescription>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/bookings">Ver todas</Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {bookings.length === 0 ? (
                    <EmptyState
                        icon={<Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />}
                        message="Nenhuma reserva ainda"
                    />
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold">{booking.service?.name}</h4>
                                        <StatusBadge status={booking.status} />
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Cliente: {booking.customer?.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(booking.booking_date)} às {formatTime(booking.start_time)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{formatCurrency(booking.total_price)}</p>
                                    {booking.status === EBookingStatus.PENDING && (
                                        <Button size="sm" className="mt-2">
                                            Confirmar
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
