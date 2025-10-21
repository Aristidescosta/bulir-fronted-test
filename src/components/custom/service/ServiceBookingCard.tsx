import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { IService } from '@/types/service';

interface BookingCardProps {
    service: IService;
    onBook: () => void;
}

export function ServiceBookingCard({ service, onBook }: BookingCardProps) {
    return (
        <Card className="sticky top-6">
            <CardHeader>
                <CardTitle>Reservar Serviço</CardTitle>
                <CardDescription>Agende seu horário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <PriceDetails service={service} />
                
                <Separator />

                <Button
                    className="w-full"
                    size="lg"
                    onClick={onBook}
                >
                    <Calendar className="mr-2 h-4 w-4" />
                    Fazer Reserva
                </Button>

                <TermsNotice />
            </CardContent>
        </Card>
    );
}

function PriceDetails({ service }: { service: IService }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Preço</span>
                <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(service.price)}
                </span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Duração</span>
                <span>{service.duration} minutos</span>
            </div>
        </div>
    );
}

function TermsNotice() {
    return (
        <p className="text-xs text-center text-muted-foreground">
            Ao reservar, você concorda com nossos termos de uso
        </p>
    );
}