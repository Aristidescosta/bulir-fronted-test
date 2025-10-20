import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import Link from 'next/link';

interface BookingsHeaderProps {
    isProvider: boolean;
}

export function BookingsHeader({ isProvider }: BookingsHeaderProps) {
    return (
        <div>
            <h1 className="text-3xl font-bold">
                {isProvider ? 'Agenda de Reservas' : 'Minhas Reservas'}
            </h1>
            <p className="text-muted-foreground">
                {isProvider
                    ? 'Gerencie as reservas dos seus serviços'
                    : 'Acompanhe suas reservas e agendamentos'}
            </p>
        </div>
    );
}

export function BookingsActions({ isProvider }: { isProvider: boolean }) {
    if (isProvider) return null;

    return (
        <Button asChild size="sm">
            <Link href="/services">
                <Search className="mr-2 h-4 w-4" />
                Buscar Serviços
            </Link>
        </Button>
    );
}