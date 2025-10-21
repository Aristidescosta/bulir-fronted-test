import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ActivityStats {
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalServices: number;
}

interface ActivityTabProps {
    userId: string;
    isProvider: boolean;
}

export function ActivityTab({ userId, isProvider }: ActivityTabProps) {
    const [stats, setStats] = useState<ActivityStats>({
        totalBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalServices: 0,
    });

    useEffect(() => {
        loadActivityStats();
    }, []);

    const loadActivityStats = async (): Promise<void> => {
        // Implementar lógica para buscar estatísticas
        setStats({
            totalBookings: 15,
            completedBookings: 12,
            cancelledBookings: 2,
            totalServices: isProvider ? 5 : 0,
        });
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Estatísticas de Atividade</CardTitle>
                    <CardDescription>Resumo da sua atividade na plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatItem label="Total de Reservas" value={stats.totalBookings} />
                        <StatItem label="Concluídas" value={stats.completedBookings} color="green" />
                        <StatItem label="Canceladas" value={stats.cancelledBookings} color="red" />
                        {isProvider && (
                            <StatItem label="Serviços Ativos" value={stats.totalServices} color="blue" />
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Atividades Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <ActivityItem
                            action="Reserva confirmada"
                            description="Limpeza Residencial Completa"
                            time="2 horas atrás"
                        />
                        <Separator />
                        <ActivityItem
                            action="Perfil atualizado"
                            description="Telefone alterado"
                            time="1 dia atrás"
                        />
                        <Separator />
                        <ActivityItem
                            action="Nova reserva criada"
                            description="Manutenção de Computadores"
                            time="3 dias atrás"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function StatItem({ label, value, color = 'default' }: {
    label: string;
    value: number;
    color?: 'default' | 'green' | 'red' | 'blue';
}) {
    const colorClasses = {
        default: 'text-foreground',
        green: 'text-green-600',
        red: 'text-red-600',
        blue: 'text-blue-600',
    };

    return (
        <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</p>
        </div>
    );
}

function ActivityItem({ action, description, time }: {
    action: string;
    description: string;
    time: string;
}) {
    return (
        <div className="flex items-start gap-4">
            <div className="h-2 w-2 mt-2 rounded-full bg-blue-600" />
            <div className="flex-1">
                <p className="font-medium">{action}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <span className="text-xs text-muted-foreground">{time}</span>
        </div>
    );
}