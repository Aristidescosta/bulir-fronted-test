import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate, formatTime } from '@/utils/formatters';
import { IBookingWithDetails } from '@/types/booking';
import { StatusBadge } from './StatusBadge';

interface RecentBookingsCardProps {
    recentBookings: IBookingWithDetails[];
}

export function RecentBookingsCard({ recentBookings }: RecentBookingsCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Próximas Reservas</CardTitle>
                        <CardDescription>Suas próximas reservas agendadas</CardDescription>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/bookings">Ver todas</Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {recentBookings.length === 0 ? (
                    <EmptyBookingsState />
                ) : (
                    <div className="space-y-4">
                        {recentBookings.map((booking) => (
                            <BookingItem key={booking.id} booking={booking} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function BookingItem({ booking }: { booking: IBookingWithDetails }) {
    return (
        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">Reserva para {booking.service.name}</h4>
                    <StatusBadge status={booking.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                    Data: {formatDate(booking.booking_date)} às {formatTime(booking.start_time)}
                </p>
                <p className="text-sm text-muted-foreground">
                    Provedor: {booking.provider.name}
                </p>
            </div>
            <div className="text-right">
                <p className="font-semibold">{formatCurrency(booking.total_price)}</p>
                <Button asChild variant="outline" size="sm" className="mt-2">
                    <Link href={`/bookings/${booking.id}`}>Detalhes</Link>
                </Button>
            </div>
        </div>
    );
}

function EmptyBookingsState() {
    return (
        <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Você ainda não tem reservas</p>
            <Button asChild className="mt-4">
                <Link href="/services">Explorar Serviços</Link>
            </Button>
        </div>
    );
}