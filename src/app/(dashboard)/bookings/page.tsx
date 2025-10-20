'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { bookingService } from '@/services/bookingService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Calendar, Clock, User, DollarSign, Package, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate, formatTime } from '@/utils/formatters';
import { toast } from 'sonner';
/* import CancelBookingDialog from '@/components/bookings/CancelBookingDialog';
import ConfirmBookingDialog from '@/components/bookings/ConfirmBookingDialog';
 */import { EBookingStatus, ECancelledBy, IBookingWithDetails } from '@/types/booking';

type TabValue = 'all' | 'pendente' | 'confirmada' | 'cancelada' | 'concluida';

interface Servico {
    nome: string;
    categoria: string;
}

interface Usuario {
    nome: string;
}


interface DialogState {
    open: boolean;
    bookingId: string | null;
}

interface BookingCardProps {
    booking: IBookingWithDetails;
    isProvider: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    getStatusColor: (status: EBookingStatus) => string;
    getStatusLabel: (status: EBookingStatus) => string;
}

export default function BookingsPage() {
    const { user, isProvider } = useAuth();
    const [bookings, setBookings] = useState<IBookingWithDetails[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<IBookingWithDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<TabValue>('all');
    const [cancelDialog, setCancelDialog] = useState<DialogState>({ open: false, bookingId: null });
    const [confirmDialog, setConfirmDialog] = useState<DialogState>({ open: false, bookingId: null });

    useEffect(() => {
        loadBookings();
    }, []);

    useEffect(() => {
        filterBookings();
    }, [bookings, activeTab]);

    const loadBookings = async (): Promise<void> => {
        try {
            setLoading(true);
            const data = await bookingService.getMyBookings();
            setBookings(data.data);
        } catch (error) {
            console.error('Erro ao carregar reservas:', error);
            toast.error('Erro ao carregar reservas');
        } finally {
            setLoading(false);
        }
    };

    const filterBookings = (): void => {
        let filtered = [...bookings];

        switch (activeTab) {
            case 'pendente':
                filtered = filtered.filter((b) => b.status === EBookingStatus.PENDING);
                break;
            case 'confirmada':
                filtered = filtered.filter((b) => b.status === EBookingStatus.CONFIRMED);
                break;
            case 'cancelada':
                filtered = filtered.filter((b) => b.status === EBookingStatus.CANCELLED);
                break;
            case 'concluida':
                filtered = filtered.filter((b) => b.status === EBookingStatus.COMPLETED);
                break;
            default:
                // all - sem filtro
                break;
        }

        filtered.sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime());

        setFilteredBookings(filtered);
    };

    const handleConfirm = async (bookingId: string): Promise<void> => {
        try {
            await bookingService.confirmBooking(bookingId);
            toast.success('Reserva confirmada com sucesso!');
            loadBookings();
            setConfirmDialog({ open: false, bookingId: null });
        } catch (error) {
            console.error('Erro ao confirmar reserva:', error);
            toast.error('Erro ao confirmar reserva');
        }
    };

    const handleCancelSuccess = (): void => {
        loadBookings();
        setCancelDialog({ open: false, bookingId: null });
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

    // Calcular estatísticas
    const stats = {
        total: bookings.length,
        pendente: bookings.filter((b) => b.status === EBookingStatus.PENDING).length,
        confirmada: bookings.filter((b) => b.status === EBookingStatus.CONFIRMED).length,
        cancelada: bookings.filter((b) => b.status === EBookingStatus.CANCELLED).length,
        concluida: bookings.filter((b) => b.status === EBookingStatus.COMPLETED).length,
    };

    if (loading) {
        return <BookingsPageSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">
                    {isProvider() ? 'Agenda de Reservas' : 'Minhas Reservas'}
                </h1>
                <p className="text-muted-foreground">
                    {isProvider()
                        ? 'Gerencie as reservas dos seus serviços'
                        : 'Acompanhe suas reservas e agendamentos'}
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-5">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total</CardDescription>
                        <CardTitle className="text-2xl">{stats.total}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Pendentes</CardDescription>
                        <CardTitle className="text-2xl text-yellow-600">{stats.pendente}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Confirmadas</CardDescription>
                        <CardTitle className="text-2xl text-green-600">{stats.confirmada}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Canceladas</CardDescription>
                        <CardTitle className="text-2xl text-red-600">{stats.cancelada}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Concluídas</CardDescription>
                        <CardTitle className="text-2xl text-blue-600">{stats.concluida}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Tabs and Bookings List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Reservas
                        </span>
                        {!isProvider() && (
                            <Button asChild size="sm">
                                <Link href="/services">
                                    <Search className="mr-2 h-4 w-4" />
                                    Buscar Serviços
                                </Link>
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="all">Todas</TabsTrigger>
                            <TabsTrigger value="pendente">Pendentes</TabsTrigger>
                            <TabsTrigger value="confirmada">Confirmadas</TabsTrigger>
                            <TabsTrigger value="concluida">Concluídas</TabsTrigger>
                            <TabsTrigger value="cancelada">Canceladas</TabsTrigger>
                        </TabsList>

                        <TabsContent value={activeTab} className="mt-6">
                            {filteredBookings.length === 0 ? (
                                <div className="text-center py-12">
                                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                                    <h3 className="text-lg font-semibold mb-2">Nenhuma reserva encontrada</h3>
                                    <p className="text-muted-foreground mb-4">
                                        {activeTab === 'all'
                                            ? 'Você ainda não tem reservas'
                                            : `Não há reservas ${getStatusLabel(activeTab.toUpperCase() as EBookingStatus)}`}
                                    </p>
                                    {!isProvider() && activeTab === 'all' && (
                                        <Button asChild>
                                            <Link href="/services">Explorar Serviços</Link>
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredBookings.map((booking) => (
                                        <BookingCard
                                            key={booking.id}
                                            booking={booking}
                                            isProvider={isProvider()}
                                            onConfirm={() => setConfirmDialog({ open: true, bookingId: booking.id })}
                                            onCancel={() => setCancelDialog({ open: true, bookingId: booking.id })}
                                            getStatusColor={getStatusColor}
                                            getStatusLabel={getStatusLabel}
                                        />
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Confirm Dialog */}
            <AlertDialog
                open={confirmDialog.open}
                onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Reserva</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja confirmar esta reserva? O cliente será notificado.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => confirmDialog.bookingId && handleConfirm(confirmDialog.bookingId)}>
                            Confirmar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* {cancelDialog.open && cancelDialog.bookingId && (
                <CancelBookingDialog
                    bookingId={cancelDialog.bookingId}
                    isOpen={cancelDialog.open}
                    onClose={() => setCancelDialog({ open: false, bookingId: null })}
                    onSuccess={handleCancelSuccess}
                />
            )} */}
        </div>
    );
}

// Booking Card Component
function BookingCard({ booking, isProvider, onConfirm, onCancel, getStatusColor, getStatusLabel }: BookingCardProps) {
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
                        {/* Data e Hora */}
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(booking.booking_date)}</span>
                            <Clock className="h-4 w-4 ml-2" />
                            <span>{formatTime(booking.start_time)}</span>
                        </div>

                        {/* Cliente ou Provedor */}
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

// Loading Skeleton
function BookingsPageSkeleton() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
            </div>
            <div className="grid gap-4 md:grid-cols-5">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <Skeleton className="h-4 w-20 mb-2" />
                            <Skeleton className="h-8 w-12" />
                        </CardHeader>
                    </Card>
                ))}
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-full mb-6" />
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-32 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}