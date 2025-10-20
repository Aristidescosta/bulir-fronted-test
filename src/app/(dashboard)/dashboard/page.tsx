'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Calendar,
    Clock,
    DollarSign,
    Package,
    Search,
} from 'lucide-react';
import Link from 'next/link';
import ProviderDashboard from './ProviderDashboard';
import { formatCurrency, formatDate, formatTime } from '@/utils/formatters';
import { bookingService } from '@/services/bookingService';
import { EBookingStatus, IBookingWithDetails } from '@/types/booking';
import { DashboardSkeleton } from '@/components/custom/dashboard/DashboardSkeleton';
import { StatCard } from '@/components/custom/dashboard/StatusCard';
import { StatusBadge } from '@/components/custom/dashboard/StatusBadge';
import { QuickAction } from '@/components/custom/dashboard/QuickAction';

interface IStats {
    activeBookings: number;
    completedBookings: number;
    pendingBookings: number;
    totalSpent: number;
}

export default function DashboardPage() {
    const { user, isProvider } = useAuth();
    const [stats, setStats] = useState<IStats | null>(null);
    const [recentBookings, setRecentBookings] = useState<IBookingWithDetails[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
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

    if (isProvider()) {
        return <ProviderDashboard />;
    }

    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Olá, {user?.name?.split(' ')[0]}! 👋</h1>
                <p className="text-muted-foreground">Bem-vindo ao seu dashboard</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Reservas Ativas"
                    icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                    value={stats?.activeBookings || 0}
                    description="Confirmadas e pendentes"
                />
                <StatCard
                    title="Concluídas"
                    icon={<Package className="h-4 w-4 text-muted-foreground" />}
                    value={stats?.completedBookings || 0}
                    description="Total de serviços utilizados"
                />
                <StatCard
                    title="Pendentes"
                    icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                    value={stats?.pendingBookings || 0}
                    description="Aguardando confirmação"
                />
                <StatCard
                    title="Total Gasto"
                    icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                    value={formatCurrency(stats?.totalSpent || 0)}
                    description="Em serviços concluídos"
                />
            </div>

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
                        <div className="text-center py-8 text-muted-foreground">
                            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Você ainda não tem reservas</p>
                            <Button asChild className="mt-4">
                                <Link href="/services">Explorar Serviços</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
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
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                    <QuickAction href="/services" icon={<Search className="h-6 w-6" />} label="Buscar Serviços" />
                    <QuickAction href="/bookings" icon={<Calendar className="h-6 w-6" />} label="Minhas Reservas" outline />
                    <QuickAction href="/profile" icon={<Package className="h-6 w-6" />} label="Meu Perfil" outline />
                </CardContent>
            </Card>
        </div>
    );
}