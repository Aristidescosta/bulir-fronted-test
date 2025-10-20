import { EBookingStatus } from '@/types/booking';

export const getStatusColor = (status: EBookingStatus): string => {
    const colors: Record<EBookingStatus, string> = {
        PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        CONFIRMED: 'bg-green-100 text-green-800 border-green-300',
        CANCELLED: 'bg-red-100 text-red-800 border-red-300',
        COMPLETED: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
};

export const getStatusLabel = (status: EBookingStatus): string => {
    const labels: Record<EBookingStatus, string> = {
        PENDING: 'Pendente',
        CONFIRMED: 'Confirmada',
        CANCELLED: 'Cancelada',
        COMPLETED: 'Concluída',
    };
    return labels[status] || status;
};