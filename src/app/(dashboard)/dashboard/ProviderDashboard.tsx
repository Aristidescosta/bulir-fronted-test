'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useProviderDashboard } from '@/hooks/useProviderDashboard';
import { StatsSection } from '@/components/custom/dashboard/StatsSection';
import { BookingsSection } from '@/components/custom/dashboard/BookingsSection';
import { ServicesSection } from '@/components/custom/dashboard/ServicesSection';

export default function ProviderDashboard() {
    const { stats, services, recentBookings, loading } = useProviderDashboard();

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="space-y-6">
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

            <StatsSection stats={stats} />
            <BookingsSection bookings={recentBookings} />
            <ServicesSection services={services} />
        </div>
    );
}
