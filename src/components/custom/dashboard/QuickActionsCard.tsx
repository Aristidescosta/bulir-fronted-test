import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Package, Search } from 'lucide-react';
import { QuickAction } from './QuickAction';

export function QuickActionsCard() {
    return (
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
    );
}