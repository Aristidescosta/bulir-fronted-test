import { useState, useEffect, useCallback } from 'react';
import { bookingService } from '@/services/bookingService';
import { IBookingWithDetails } from '@/types/booking';
import { toast } from 'sonner';

export function useBookings() {
    const [bookings, setBookings] = useState<IBookingWithDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const loadBookings = useCallback(async (): Promise<void> => {
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
    }, []);

    useEffect(() => {
        loadBookings();
    }, [loadBookings]);

    return {
        bookings,
        loading,
        loadBookings
    };
}