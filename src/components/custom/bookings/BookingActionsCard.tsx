import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface BookingActionsCardProps {
    serviceId?: string;
    isProvider: boolean;
}

export function BookingActionsCard({ serviceId, isProvider }: BookingActionsCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <Button variant="outline" className="w-full" asChild>
                    <Link href={`/services/${serviceId}`}>
                        Ver Serviço
                    </Link>
                </Button>
                {!isProvider && (
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/services">
                            Buscar Outros Serviços
                        </Link>
                    </Button>
                )}
                {isProvider && (
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/my-services">
                            Meus Serviços
                        </Link>
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}