import { useState, useEffect, useMemo, useCallback } from 'react';
import { IBookingWithDetails, EBookingStatus } from '@/types/booking';

type TabValue = 'all' | 'pendente' | 'confirmada' | 'cancelada' | 'concluida';

export function useBookingsFilter(bookings: IBookingWithDetails[]) {
    const [activeTab, setActiveTab] = useState<TabValue>('all');
    const [filteredBookings, setFilteredBookings] = useState<IBookingWithDetails[]>([]);

    const filterBookings = useCallback(() => {
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
                break;
        }

        filtered.sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime());
        setFilteredBookings(filtered);
    }, [bookings, activeTab]);

    useEffect(() => {
        filterBookings();
    }, [filterBookings]);

    const stats = useMemo(() => ({
        total: bookings.length,
        pendente: bookings.filter((b) => b.status === EBookingStatus.PENDING).length,
        confirmada: bookings.filter((b) => b.status === EBookingStatus.CONFIRMED).length,
        cancelada: bookings.filter((b) => b.status === EBookingStatus.CANCELLED).length,
        concluida: bookings.filter((b) => b.status === EBookingStatus.COMPLETED).length,
    }), [bookings]);

    return {
        activeTab,
        setActiveTab,
        filteredBookings,
        stats
    };
}