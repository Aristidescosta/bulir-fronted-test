import { Badge } from "@/components/ui/badge";
import { IBookingWithDetails } from "@/types/booking";

interface IStatusBadgeProps {
    status: IBookingWithDetails['status'];
}

export const StatusBadge = ({ status }: IStatusBadgeProps) => {
    const variants: Record<
        IBookingWithDetails['status'],
        { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
    > = {
        PENDING: { label: 'Pendente', variant: 'secondary' },
        CONFIRMED: { label: 'Confirmada', variant: 'default' },
        COMPLETED: { label: 'Concluída', variant: 'default' },
        CANCELLED: { label: 'Cancelada', variant: 'destructive' },
    };

    const { label, variant } = variants[status] ?? variants.PENDING;

    return <Badge variant={variant}>{label}</Badge>;
};