import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, User } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { IService } from '@/types/service';

interface ServiceCardProps {
    service: IService;
}

export function ServiceCard({ service }: ServiceCardProps) {
    return (
        <Card className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between mb-2">
                    <Badge>{service.category}</Badge>
                    <Badge variant="outline">{service.duration} min</Badge>
                </div>
                <CardTitle className="line-clamp-1">{service.name}</CardTitle>
                <CardDescription className="line-clamp-2">{service.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{service.provider_id ?? 'Provedor não disponível'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{service.duration} minutos</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-2xl font-bold text-blue-600">
                            {formatCurrency(service.price)}
                        </span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex gap-2">
                <Button asChild className="flex-1">
                    <Link href={`/services/${service.id}`}>Ver Detalhes</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}