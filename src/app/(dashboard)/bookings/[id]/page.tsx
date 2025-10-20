'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { bookingService } from '@/services/bookingService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Calendar,
    Clock,
    User,
    DollarSign,
    Package,
    ArrowLeft,
    Phone,
    Mail,
    MapPin,
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate, formatTime, formatDateTime } from '@/utils/formatters';
import { toast } from 'sonner';
import { EBookingStatus, ECancelledBy, IBookingWithDetails } from '@/types/booking';
import CancelBookingDialog from '@/components/custom/bookings/CancelBookingDialog';

interface TimelineItemProps {
    label: string;
    date: string;
    active: boolean;
    color?: 'blue' | 'green' | 'red' | 'gray';
}

export default function BookingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isProvider } = useAuth();
    const [booking, setBooking] = useState<IBookingWithDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [cancelDialog, setCancelDialog] = useState<boolean>(false);

    useEffect(() => {
        loadBooking();
    }, [params.id]);

    const loadBooking = async (): Promise<void> => {
        try {
            setLoading(true);
            const data = await bookingService.getBookingById(params.id as string);
            setBooking(data);
        } catch (error) {
            console.error('Erro ao carregar reserva:', error);
            toast.error('Erro ao carregar reserva');
            router.push('/bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (): Promise<void> => {
        try {
            await bookingService.confirmBooking(params.id as string);
            toast.success('Reserva confirmada com sucesso!');
            loadBooking();
        } catch (error) {
            console.error('Erro ao confirmar reserva:', error);
            toast.error('Erro ao confirmar reserva');
        }
    };

    const handleCancelSuccess = (): void => {
        setCancelDialog(false);
        loadBooking();
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!booking) {
        return null;
    }

    const getInitials = (name?: string): string => {
        return name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || '';
    };

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

    const isPast = new Date(booking.booking_date) < new Date();
    const canCancel = !isPast && (booking.status === EBookingStatus.PENDING || booking.status === EBookingStatus.CONFIRMED);
    const canConfirm = isProvider() && booking.status === EBookingStatus.PENDING;

    const contactPerson = isProvider() ? booking.customer : booking.provider;

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
                    <Badge className={getStatusColor(booking.status)} variant="outline">
                        {getStatusLabel(booking.status)}
                    </Badge>
                </div>

                <div className="flex gap-2">
                    {canConfirm && (
                        <Button onClick={handleConfirm}>
                            Confirmar Reserva
                        </Button>
                    )}
                    {canCancel && (
                        <Button variant="destructive" onClick={() => setCancelDialog(true)}>
                            Cancelar Reserva
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Service Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações do Serviço</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">{booking.service?.name}</h3>
                                {/* <p className="text-muted-foreground">{booking.service?.description}</p> */}
                            </div>

                            <Separator />

                            <div className="grid gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Package className="h-4 w-4" />
                                        <span>Categoria</span>
                                    </div>
                                    <span className="font-medium">{booking.service?.category}</span>
                                </div>

                                {/* <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>Duração</span>
                                    </div>
                                    <span className="font-medium">{booking.service?.duration} minutos</span>
                                </div> */}

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Data e Hora</span>
                                    </div>
                                    <span className="font-medium">
                                        {formatDate(booking.booking_date)} às {formatTime(booking.start_time)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <DollarSign className="h-4 w-4" />
                                        <span>Valor</span>
                                    </div>
                                    <span className="text-xl font-bold text-blue-600">
                                        {formatCurrency(booking.total_price)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {isProvider() ? 'Informações do Cliente' : 'Informações do Provedor'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="text-lg">
                                        {getInitials(contactPerson?.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-3">
                                    <div>
                                        <h3 className="font-semibold text-lg">{contactPerson?.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {isProvider() ? 'Cliente' : 'Prestador de Serviço'}
                                        </p>
                                    </div>

                                    {/* <div className="space-y-2 text-sm">
                                        {contactPerson?. && (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Mail className="h-4 w-4" />
                                                <a
                                                    href={`mailto:${contactPerson.email}`}
                                                    className="hover:text-primary hover:underline"
                                                >
                                                    {contactPerson.email}
                                                </a>
                                            </div>
                                        )}

                                        {contactPerson?.telefone && (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Phone className="h-4 w-4" />
                                                <a
                                                    href={`tel:${contactPerson.telefone}`}
                                                    className="hover:text-primary hover:underline"
                                                >
                                                    {contactPerson.telefone}
                                                </a>
                                            </div>
                                        )}
                                    </div> */}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cancellation Info */}
                    {booking.status === EBookingStatus.CANCELLED && (
                        <Card className="border-red-200">
                            <CardHeader>
                                <CardTitle className="text-red-600">Informações do Cancelamento</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Cancelado por:</span>
                                    <span className="font-medium">
                                        {booking.cancelled_by === ECancelledBy.CUSTOMER ? 'Cliente' : 'Provedor'}
                                    </span>
                                </div>
                                {booking.cancelled_at && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Data do cancelamento:</span>
                                        <span className="font-medium">{formatDateTime(booking.cancelled_at)}</span>
                                    </div>
                                )}
                                {booking.cancellation_reason && (
                                    <div>
                                        <span className="text-muted-foreground">Motivo:</span>
                                        <p className="mt-1 p-3 bg-red-50 rounded text-sm">{booking.cancellation_reason}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Linha do Tempo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <TimelineItem
                                    label="Criada"
                                    date={formatDateTime(booking.booking_date)}
                                    active
                                />
                                {booking.status === EBookingStatus.CONFIRMED && booking.updated_at && (
                                    <TimelineItem
                                        label="Confirmada"
                                        date={formatDateTime(booking.updated_at)}
                                        active
                                    />
                                )}
                                {booking.status === EBookingStatus.CANCELLED && booking.cancelled_at && (
                                    <TimelineItem
                                        label="Cancelada"
                                        date={formatDateTime(booking.cancelled_at)}
                                        active
                                        color="red"
                                    />
                                )}
                                {booking.status === EBookingStatus.COMPLETED && booking.updated_at && (
                                    <TimelineItem
                                        label="Concluída"
                                        date={formatDateTime(booking.updated_at)}
                                        active
                                        color="blue"
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full" asChild>
                                <Link href={`/services/${booking.service?.id}`}>
                                    Ver Serviço
                                </Link>
                            </Button>
                            {!isProvider() && (
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/services">
                                        Buscar Outros Serviços
                                    </Link>
                                </Button>
                            )}
                            {isProvider() && (
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/my-services">
                                        Meus Serviços
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {cancelDialog && (
                <CancelBookingDialog
                    bookingId={params.id as string}
                    isOpen={cancelDialog}
                    onClose={() => setCancelDialog(false)}
                    onSuccess={handleCancelSuccess}
                />
            )}
        </div>
    );
}

// Timeline Item Component
function TimelineItem({ label, date, active, color = 'blue' }: TimelineItemProps) {
    const colorClasses: Record<string, string> = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        red: 'bg-red-500',
        gray: 'bg-gray-300',
    };

    return (
        <div className="flex gap-3">
            <div className="flex flex-col items-center">
                <div
                    className={`h-3 w-3 rounded-full ${active ? colorClasses[color] : colorClasses.gray
                        }`}
                />
                <div className="w-0.5 h-full bg-gray-200 mt-1" />
            </div>
            <div className="pb-4">
                <p className="font-medium text-sm">{label}</p>
                <p className="text-xs text-muted-foreground">{date}</p>
            </div>
        </div>
    );
}