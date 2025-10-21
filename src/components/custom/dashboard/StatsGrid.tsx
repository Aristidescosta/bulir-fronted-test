import { Calendar, Clock, DollarSign, Package } from 'lucide-react';
import { StatCard } from './StatusCard';
import { formatCurrency } from '@/utils/formatters';

interface IStats {
    activeBookings: number;
    completedBookings: number;
    pendingBookings: number;
    totalSpent: number;
}

interface StatsGridProps {
    stats: IStats | null;
}

export function StatsGrid({ stats }: StatsGridProps) {
    return (
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
    );
}