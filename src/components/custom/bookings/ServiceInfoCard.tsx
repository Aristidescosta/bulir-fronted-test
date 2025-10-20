import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, DollarSign, Package } from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '@/utils/formatters';
import { EServiceCategory } from '@/types/service';

interface IServiceInfoProps {
    id: string;
    name: string;
    category?: EServiceCategory | undefined;
}


interface ServiceInfoCardProps {
    service: IServiceInfoProps;
    bookingDate: Date;
    startTime: string;
    totalPrice: number;
}

export function ServiceInfoCard({
    service,
    bookingDate,
    startTime,
    totalPrice
}: ServiceInfoCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Informações do Serviço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="text-xl font-semibold mb-2">{service?.name}</h3>
                </div>

                <Separator />

                <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Package className="h-4 w-4" />
                            <span>Categoria</span>
                        </div>
                        <span className="font-medium">{service?.category}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Data e Hora</span>
                        </div>
                        <span className="font-medium">
                            {formatDate(bookingDate)} às {formatTime(startTime)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span>Valor</span>
                        </div>
                        <span className="text-xl font-bold text-blue-600">
                            {formatCurrency(totalPrice)}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}