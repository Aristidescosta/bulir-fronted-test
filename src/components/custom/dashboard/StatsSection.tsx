import { StatCard } from '@/components/custom/dashboard/StatusCard';
import { Calendar, DollarSign, Package, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { IStats } from '@/types/booking';

interface Props {
    stats: IStats | null;
}

export function StatsSection({ stats }: Props) {
    return (
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
    );
}
