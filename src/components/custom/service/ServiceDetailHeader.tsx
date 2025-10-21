import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { IService } from '@/types/service';

interface ServiceDetailHeaderProps {
    service: IService;
}

export function ServiceDetailHeader({ service }: ServiceDetailHeaderProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between mb-2">
                    <Badge>{service.category}</Badge>
                    <Badge variant="outline">
                        <Clock className="mr-1 h-3 w-3" />
                        {service.duration} min
                    </Badge>
                </div>
                <CardTitle className="text-3xl">{service.name}</CardTitle>
                <CardDescription className="text-base">{service.description}</CardDescription>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    <Separator />

                    <ServiceDetails service={service} />

                    <Separator />

                    <ServiceProviderInfo service={service} />
                </div>
            </CardContent>
        </Card>
    );
}

function ServiceDetails({ service }: { service: IService }) {
    return (
        <div>
            <h3 className="font-semibold mb-2">Detalhes do Serviço</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Duração: {service.duration} minutos</span>
                </div>
                <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Preço: {formatCurrency(service.price)}</span>
                </div>
            </div>
        </div>
    );
}

function ServiceProviderInfo({ service }: { service: IService }) {
    const getInitials = (name?: string): string =>
        name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || '';

    return (
        <div>
            <h3 className="font-semibold mb-3">Prestador do Serviço</h3>
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium">
                        {getInitials(service.provider?.name)}
                    </span>
                </div>
                <div>
                    <p className="font-medium">{service.provider?.name}</p>
                    <p className="text-sm text-muted-foreground">{service.provider?.email}</p>
                    {service.provider?.phone && (
                        <p className="text-sm text-muted-foreground">{service.provider?.phone}</p>
                    )}
                </div>
            </div>
        </div>
    );
}