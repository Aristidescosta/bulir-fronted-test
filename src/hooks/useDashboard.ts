
import { useState, useEffect } from 'react';
import { bookingService } from '@/services/bookingService';
import { EBookingStatus, IBookingWithDetails } from '@/types/booking';

interface IStats {
    activeBookings: number;
    completedBookings: number;
    pendingBookings: number;
    totalSpent: number;
}

interface UseDashboardReturn {
    stats: IStats | null;
    recentBookings: IBookingWithDetails[];
    loading: boolean;
    loadDashboardData: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
    const [stats, setStats] = useState<IStats | null>(null);
    const [recentBookings, setRecentBookings] = useState<IBookingWithDetails[]>([]);
    const [loading, setLoading] = useState(false);

    const loadDashboardData = async (): Promise<void> => {
        try {
            setLoading(true);
            const bookingsData = await bookingService.getMyBookings({ limit: 5 });

            setRecentBookings(bookingsData.data);

            const activeBookings = bookingsData.data?.filter(
                (b: IBookingWithDetails) => b.status === EBookingStatus.CONFIRMED || b.status === EBookingStatus.PENDING
            );

            const completedBookings = bookingsData.data.filter(
                (b: IBookingWithDetails) => b.status === EBookingStatus.COMPLETED
            );

            const totalSpent = completedBookings.reduce(
                (sum: number, b: IBookingWithDetails) => sum + (b.total_price || 0),
                0
            );

            setStats({
                activeBookings: activeBookings.length,
                completedBookings: completedBookings.length,
                pendingBookings: bookingsData.data.filter((b) => b.status === EBookingStatus.PENDING).length,
                totalSpent,
            });
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    return {
        stats,
        recentBookings,
        loading,
        loadDashboardData
    };
}