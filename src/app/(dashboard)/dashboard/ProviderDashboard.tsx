'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Package, TrendingUp, Plus } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate, formatTime } from '@/utils/formatters';
import { bookingService } from '@/services/bookingService';
import { serviceService } from '@/services/serviceService';
import { EBookingStatus, IBookingWithDetails } from '@/types/booking';
import { EServiceStatus, IService } from '@/types/service';
import { StatCard } from '@/components/custom/dashboard/StatusCard';
import { StatusBadge } from '@/components/custom/dashboard/StatusBadge';
import { EmptyState } from '@/components/custom/dashboard/EmptyState';

interface IStats {
    totalServices: number;
    activeServices: number;
    monthlyBookings: number;
    pendingBookings: number;
    monthlyRevenue: number;
    totalRevenue: number;
}

export default function ProviderDashboard() {
    const { user } = useAuth();
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

            // Buscar reservas e serviços
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

            const completedBookings = bookingsData.data.filter((b: IBookingWithDetails) => b.status === EBookingStatus.CONFIRMED);
            const monthlyRevenue = monthlyBookings
                .filter((b: IBookingWithDetails) => b.status === EBookingStatus.COMPLETED)
                .reduce((sum, b) => sum + (b.total_price || 0), 0);

            setStats({
                totalServices: servicesData.data.length,
                activeServices: servicesData.data.filter((s: IService) => s.status === EServiceStatus.ACTIVE).length,
                monthlyBookings: monthlyBookings.length,
                pendingBookings: bookingsData.data.filter((b: IBookingWithDetails) => b.status === EBookingStatus.PENDING).length,
                monthlyRevenue,
                totalRevenue: completedBookings.reduce(
                    (sum, b) => sum + (b.total_price || 0),
                    0
                ),
            });
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard do Provedor</h1>
                    <p className="text-muted-foreground">Gerencie seus serviços e reservas</p>
                </div>
                <Button asChild>
                    <Link href="/my-services/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Serviço
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Meus Serviços"
                    icon={<Package className="h-4 w-4 text-muted-foreground" />}
                    value={stats?.totalServices || 0}
                    description={`${stats?.activeServices || 0} ativos`}
                />
                <StatCard
                    title="Reservas do Mês"
                    icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                    value={stats?.monthlyBookings || 0}
                    description={`${stats?.pendingBookings || 0} pendentes`}
                />
                <StatCard
                    title="Receita do Mês"
                    icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
                    value={formatCurrency(stats?.monthlyRevenue || 0)}
                    description="Serviços concluídos"
                />
                <StatCard
                    title="Receita Total"
                    icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                    value={formatCurrency(stats?.totalRevenue || 0)}
                    description="Todos os tempos"
                />
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Reservas Recentes</CardTitle>
                            <CardDescription>Últimas reservas dos seus serviços</CardDescription>
                        </div>
                        <Button asChild variant="outline">
                            <Link href="/bookings">Ver todas</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {recentBookings.length === 0 ? (
                        <EmptyState
                            icon={<Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />}
                            message="Nenhuma reserva ainda"
                        />
                    ) : (
                        <div className="space-y-4">
                            {recentBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold">{booking.service?.name}</h4>
                                            <StatusBadge status={booking.status} />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Cliente: {booking.customer?.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(booking.booking_date)} às {formatTime(booking.start_time)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{formatCurrency(booking.total_price)}</p>
                                        {booking.status === EBookingStatus.PENDING && (
                                            <Button size="sm" className="mt-2">
                                                Confirmar
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Meus Serviços</CardTitle>
                            <CardDescription>Serviços cadastrados na plataforma</CardDescription>
                        </div>
                        <Button asChild variant="outline">
                            <Link href="/my-services">Gerenciar</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {services.length === 0 ? (
                        <EmptyState
                            icon={<Package className="h-12 w-12 mx-auto mb-4 opacity-50" />}
                            message="Nenhum serviço cadastrado"
                            action={
                                <Button asChild className="mt-4">
                                    <Link href="/my-services/new">Criar Primeiro Serviço</Link>
                                </Button>
                            }
                        />
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {services.slice(0, 3).map((service) => (
                                <div key={service.id} className="p-4 border rounded-lg">
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-semibold">{service.name}</h4>
                                        <Badge variant={service.status === EServiceStatus.ACTIVE ? 'default' : 'secondary'}>
                                            {service.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">{service.category}</p>
                                    <p className="font-semibold">{formatCurrency(service.price)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}