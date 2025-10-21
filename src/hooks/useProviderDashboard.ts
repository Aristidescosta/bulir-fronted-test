'use client';
import { useEffect, useState } from 'react';
import { bookingService } from '@/services/bookingService';
import { serviceService } from '@/services/serviceService';
import { EBookingStatus, IBookingWithDetails, IStats } from '@/types/booking';
import { EServiceStatus, IService } from '@/types/service';

export function useProviderDashboard() {
    const [stats, setStats] = useState<IStats | null>(null);
    const [recentBookings, setRecentBookings] = useState<IBookingWithDetails[]>([]);
    const [services, setServices] = useState<IService[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            const [bookingsData, servicesData] = await Promise.all([
                bookingService.getMyBookings({ limit: 5 }),
                serviceService.getMyServices(),
            ]);

            setRecentBookings(bookingsData.data);
            setServices(servicesData.data);

            const thisMonth = new Date();
            thisMonth.setDate(1);

            const monthlyBookings = bookingsData.data.filter(
                (b: IBookingWithDetails) => new Date(b.booking_date) >= thisMonth
            );

            const completedBookings = bookingsData.data.filter(
                (b: IBookingWithDetails) => b.status === EBookingStatus.CONFIRMED
            );

            const monthlyRevenue = monthlyBookings
                .filter((b) => b.status === EBookingStatus.COMPLETED)
                .reduce((sum, b) => sum + (b.total_price || 0), 0);

            setStats({
                totalServices: servicesData.data.length,
                activeServices: servicesData.data.filter((s) => s.status === EServiceStatus.ACTIVE).length,
                monthlyBookings: monthlyBookings.length,
                pendingBookings: bookingsData.data.filter(
                    (b) => b.status === EBookingStatus.PENDING
                ).length,
                monthlyRevenue,
                totalRevenue: completedBookings.reduce((sum, b) => sum + (b.total_price || 0), 0),
            });
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    return { stats, services, recentBookings, loading };
}
