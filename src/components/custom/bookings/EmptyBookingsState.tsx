import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import Link from 'next/link';
import { EBookingStatus } from '@/types/booking';

interface EmptyBookingsStateProps {
    activeTab: string;
    isProvider: boolean;
    getStatusLabel: (status: EBookingStatus) => string;
}

export function EmptyBookingsState({
    activeTab,
    isProvider,
    getStatusLabel
}: EmptyBookingsStateProps) {
    return (
        <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma reserva encontrada</h3>
            <p className="text-muted-foreground mb-4">
                {activeTab === 'all'
                    ? 'Você ainda não tem reservas'
                    : `Não há reservas ${getStatusLabel(activeTab.toUpperCase() as EBookingStatus)}`}
            </p>
            {!isProvider && activeTab === 'all' && (
                <Button asChild>
                    <Link href="/services">Explorar Serviços</Link>
                </Button>
            )}
        </div>
    );
}