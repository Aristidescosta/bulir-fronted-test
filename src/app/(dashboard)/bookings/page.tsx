'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { bookingService } from '@/services/bookingService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';
import CancelBookingDialog from '@/components/custom/bookings/CancelBookingDialog';

import { BookingsStats } from '@/components/custom/bookings/BookingsStats';
import { BookingsHeader, BookingsActions } from '@/components/custom/bookings/BookingsHeader';
import { EmptyBookingsState } from '@/components/custom/bookings/EmptyBookingsState';
import { ConfirmBookingDialog } from '@/components/custom/bookings/ConfirmBookingDialog';
import { BookingCard } from '@/components/custom/bookings/BookingCard';
import { BookingsPageSkeleton } from '@/components/custom/bookings/BookingsPageSkeleton';

import { useBookings } from '@/hooks/useBookings';
import { useBookingsFilter } from '@/hooks/useBookingsFilter';

import { getStatusColor, getStatusLabel } from '@/utils/bookingUtils';

type TabValue = 'all' | 'pendente' | 'confirmada' | 'cancelada' | 'concluida';

interface DialogState {
    open: boolean;
    bookingId: string | null;
}

export default function BookingsPage() {
    const { isProvider } = useAuth();
    const { bookings, loading, loadBookings } = useBookings();
    const { activeTab, setActiveTab, filteredBookings, stats } = useBookingsFilter(bookings);

    const [cancelDialog, setCancelDialog] = useState<DialogState>({ open: false, bookingId: null });
    const [confirmDialog, setConfirmDialog] = useState<DialogState>({ open: false, bookingId: null });

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

    if (loading) {
        return <BookingsPageSkeleton />;
    }

    return (
        <div className="space-y-6">
            <BookingsHeader isProvider={isProvider()} />

            <BookingsStats stats={stats} />

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Reservas
                        </span>
                        <BookingsActions isProvider={isProvider()} />
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
                                <EmptyBookingsState
                                    activeTab={activeTab}
                                    isProvider={isProvider()}
                                    getStatusLabel={getStatusLabel}
                                />
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

            <ConfirmBookingDialog
                open={confirmDialog.open}
                onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
                onConfirm={() => confirmDialog.bookingId && handleConfirm(confirmDialog.bookingId)}
            />

            {cancelDialog.open && cancelDialog.bookingId && (
                <CancelBookingDialog
                    bookingId={cancelDialog.bookingId}
                    isOpen={cancelDialog.open}
                    onClose={() => setCancelDialog({ open: false, bookingId: null })}
                    onSuccess={handleCancelSuccess}
                />
            )}
        </div>
    );
}