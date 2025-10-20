'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { bookingService } from '@/services/bookingService';
import { toast } from 'sonner';
import { EBookingStatus, IBookingWithDetails } from '@/types/booking';
import CancelBookingDialog from '@/components/custom/bookings/CancelBookingDialog';

import { BookingHeader } from '@/components/custom/bookings/BookingHeader';
import { ServiceInfoCard } from '@/components/custom/bookings/ServiceInfoCard';
import { ContactInfoCard } from '@/components/custom/bookings/ContactInfoCard';
import { CancellationInfoCard } from '@/components/custom/bookings/CancellationInfoCard';
import { BookingTimelineCard } from '@/components/custom/bookings/BookingTimelineCard';
import { BookingActionsCard } from '@/components/custom/bookings/BookingActionsCard';

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

    const isPast = new Date(booking.booking_date) < new Date();
    const canCancel = !isPast && (booking.status === EBookingStatus.PENDING || booking.status === EBookingStatus.CONFIRMED);
    const canConfirm = isProvider() && booking.status === EBookingStatus.PENDING;
    const contactPerson = isProvider() ? booking.customer : booking.provider;

    return (
        <div className="space-y-6">
            <BookingHeader
                status={booking.status}
                canConfirm={canConfirm}
                canCancel={canCancel}
                onConfirm={handleConfirm}
                onCancel={() => setCancelDialog(true)}
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <ServiceInfoCard
                        service={booking.service!}
                        bookingDate={booking.booking_date}
                        startTime={booking.start_time}
                        totalPrice={booking.total_price}
                    />

                    <ContactInfoCard
                        contactPerson={contactPerson}
                        isProvider={isProvider()}
                    />

                    {booking.status === EBookingStatus.CANCELLED && (
                        <CancellationInfoCard
                            cancelledBy={booking.cancelled_by}
                            cancelledAt={booking.cancelled_at}
                            cancellationReason={booking.cancellation_reason}
                        />
                    )}
                </div>

                <div className="space-y-6">
                    <BookingTimelineCard
                        status={booking.status}
                        bookingDate={booking.booking_date}
                        updatedAt={booking.updated_at}
                        cancelledAt={booking.cancelled_at}
                    />

                    <BookingActionsCard
                        serviceId={booking.service?.id}
                        isProvider={isProvider()}
                    />
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