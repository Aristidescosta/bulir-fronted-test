import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '@/components/custom/dashboard/EmptyState';
import { formatCurrency } from '@/utils/formatters';
import { IService, EServiceStatus } from '@/types/service';

interface Props {
    services: IService[];
}

export function ServicesSection({ services }: Props) {
    return (
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
                                    <h4 className="font-semibold">{service.name}</h4>
                                    <Badge
                                        variant={service.status === EServiceStatus.ACTIVE ? 'default' : 'secondary'}
                                    >
                                        {service.status}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{service.category}</p>
                                <p className="font-semibold">{formatCurrency(service.price)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
