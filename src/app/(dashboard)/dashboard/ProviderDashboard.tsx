'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Package, TrendingUp, Plus } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate, formatTime } from '@/utils/formatters';

// Tipos esperados
interface IService {
    id: string;
    nome: string;
    categoria: string;
    preco: number;
    status: 'ATIVO' | 'INATIVO';
}

interface IBooking {
    id: string;
    servico: { nome: string };
    cliente: { nome: string };
    data_reserva: string;
    hora_inicio: string;
    valor_total: number;
    status: 'PENDENTE' | 'CONFIRMADA' | 'CANCELADA' | 'CONCLUIDA';
    data_criacao: string;
}

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
    const [recentBookings, setRecentBookings] = useState<IBooking[]>([]);
    const [services, setServices] = useState<IService[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        /* try {
            setLoading(true);

            // Buscar reservas e serviços
            const [bookingsData, servicesData] = await Promise.all([
                bookingService.getMyBookings({ limit: 5 }),
                serviceService.getMyServices(),
            ]);

            setRecentBookings(bookingsData);
            setServices(servicesData);

            // Calcular estatísticas
            const thisMonth = new Date();
            thisMonth.setDate(1);

            const monthlyBookings = bookingsData.filter(
                (b: IBooking) => new Date(b.data_criacao) >= thisMonth
            );

            const completedBookings = bookingsData.filter((b: IBooking) => b.status === 'CONCLUIDA');
            const monthlyRevenue = monthlyBookings
                .filter((b: IBooking) => b.status === 'CONCLUIDA')
                .reduce((sum, b) => sum + (b.valor_total || 0), 0);

            setStats({
                totalServices: servicesData.length,
                activeServices: servicesData.filter((s: IService) => s.status === 'ATIVO').length,
                monthlyBookings: monthlyBookings.length,
                pendingBookings: bookingsData.filter((b: IBooking) => b.status === 'PENDENTE').length,
                monthlyRevenue,
                totalRevenue: completedBookings.reduce(
                    (sum, b) => sum + (b.valor_total || 0),
                    0
                ),
            });
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
        } finally {
            setLoading(false);
        } */
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

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Meus Serviços"
                    icon={<Package className="h-4 w-4 text-muted-foreground" />}
                    value={stats?.totalServices || 0}
                    subtitle={`${stats?.activeServices || 0} ativos`}
                />
                <StatCard
                    title="Reservas do Mês"
                    icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                    value={stats?.monthlyBookings || 0}
                    subtitle={`${stats?.pendingBookings || 0} pendentes`}
                />
                <StatCard
                    title="Receita do Mês"
                    icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
                    value={formatCurrency(stats?.monthlyRevenue || 0)}
                    subtitle="Serviços concluídos"
                />
                <StatCard
                    title="Receita Total"
                    icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                    value={formatCurrency(stats?.totalRevenue || 0)}
                    subtitle="Todos os tempos"
                />
            </div>

            {/* Reservas Recentes */}
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
                                            <h4 className="font-semibold">{booking.servico?.nome}</h4>
                                            <StatusBadge status={booking.status} />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Cliente: {booking.cliente?.nome}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(booking.data_reserva)} às {formatTime(booking.hora_inicio)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{formatCurrency(booking.valor_total)}</p>
                                        {booking.status === 'PENDENTE' && (
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

            {/* Meus Serviços */}
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
                                        <h4 className="font-semibold">{service.nome}</h4>
                                        <Badge variant={service.status === 'ATIVO' ? 'default' : 'secondary'}>
                                            {service.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">{service.categoria}</p>
                                    <p className="font-semibold">{formatCurrency(service.preco)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

/* ---------- Subcomponentes ---------- */

function StatCard({
    title,
    icon,
    value,
    subtitle,
}: {
    title: string;
    icon: React.ReactNode;
    value: string | number;
    subtitle: string;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{subtitle}</p>
            </CardContent>
        </Card>
    );
}

function EmptyState({
    icon,
    message,
    action,
}: {
    icon: React.ReactNode;
    message: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="text-center py-8 text-muted-foreground">
            {icon}
            <p>{message}</p>
            {action}
        </div>
    );
}

function StatusBadge({ status }: { status: IBooking['status'] }) {
    const variants: Record<
        IBooking['status'],
        { label: string; variant: 'secondary' | 'default' | 'destructive' | 'outline' }
    > = {
        PENDENTE: { label: 'Pendente', variant: 'secondary' },
        CONFIRMADA: { label: 'Confirmada', variant: 'default' },
        CANCELADA: { label: 'Cancelada', variant: 'destructive' },
        CONCLUIDA: { label: 'Concluída', variant: 'outline' },
    };

    const { label, variant } = variants[status];

    return <Badge variant={variant}>{label}</Badge>;
}
