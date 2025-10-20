import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ECancelledBy } from '@/types/booking';
import { formatDateTime } from '@/utils/formatters';

interface CancellationInfoCardProps {
    cancelledBy: ECancelledBy | null;
    cancelledAt?: Date | null;
    cancellationReason?: string | null;
}

export function CancellationInfoCard({ 
    cancelledBy, 
    cancelledAt, 
    cancellationReason 
}: CancellationInfoCardProps) {
    return (
        <Card className="border-red-200">
            <CardHeader>
                <CardTitle className="text-red-600">Informações do Cancelamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Cancelado por:</span>
                    <span className="font-medium">
                        {cancelledBy === ECancelledBy.CUSTOMER ? 'Cliente' : 'Provedor'}
                    </span>
                </div>
                {cancelledAt && (
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Data do cancelamento:</span>
                        <span className="font-medium">{formatDateTime(cancelledAt)}</span>
                    </div>
                )}
                {cancellationReason && (
                    <div>
                        <span className="text-muted-foreground">Motivo:</span>
                        <p className="mt-1 p-3 bg-red-50 rounded text-sm">{cancellationReason}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}