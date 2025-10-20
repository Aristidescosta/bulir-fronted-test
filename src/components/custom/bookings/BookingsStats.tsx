import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BookingsStatsProps {
    stats: {
        total: number;
        pendente: number;
        confirmada: number;
        cancelada: number;
        concluida: number;
    };
}

export function BookingsStats({ stats }: BookingsStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-5">
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>Total</CardDescription>
                    <CardTitle className="text-2xl">{stats.total}</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>Pendentes</CardDescription>
                    <CardTitle className="text-2xl text-yellow-600">{stats.pendente}</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>Confirmadas</CardDescription>
                    <CardTitle className="text-2xl text-green-600">{stats.confirmada}</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>Canceladas</CardDescription>
                    <CardTitle className="text-2xl text-red-600">{stats.cancelada}</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>Concluídas</CardDescription>
                    <CardTitle className="text-2xl text-blue-600">{stats.concluida}</CardTitle>
                </CardHeader>
            </Card>
        </div>
    );
}