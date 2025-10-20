import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimelineItem } from './TimelineItem';
import { EBookingStatus } from '@/types/booking';
import { formatDateTime } from '@/utils/formatters';

interface BookingTimelineCardProps {
    status: EBookingStatus;
    bookingDate: Date;
    updatedAt?: Date;
    cancelledAt?: Date | null;
}

export function BookingTimelineCard({
    status,
    bookingDate,
    updatedAt,
    cancelledAt
}: BookingTimelineCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Linha do Tempo</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <TimelineItem
                        label="Criada"
                        date={formatDateTime(bookingDate)}
                        active
                    />
                    {status === EBookingStatus.CONFIRMED && updatedAt && (
                        <TimelineItem
                            label="Confirmada"
                            date={formatDateTime(updatedAt)}
                            active
                        />
                    )}
                    {status === EBookingStatus.CANCELLED && cancelledAt && (
                        <TimelineItem
                            label="Cancelada"
                            date={formatDateTime(cancelledAt)}
                            active
                            color="red"
                        />
                    )}
                    {status === EBookingStatus.COMPLETED && updatedAt && (
                        <TimelineItem
                            label="Concluída"
                            date={formatDateTime(updatedAt)}
                            active
                            color="blue"
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
}