import { EServiceCategory } from "./service";

export enum EBookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
}


export enum ECancelledBy {
    CUSTOMER = 'CUSTOMER',
    PROVIDER = 'PROVIDER',
    SYSTEM = 'SYSTEM',
}

export interface IBooking {
    id: string
    booking_date: Date;
    start_time: string;
    end_time: string;
    status: EBookingStatus;
    total_price: number;
    cancellation_reason: string | null;
    cancelled_by: ECancelledBy | null;
    created_at: Date;
    updated_at: Date;
    cancelled_at: Date | null;
}

export interface IBookingWithDetails extends IBooking {
    service: {
        id: string;
        name: string;
        category?: EServiceCategory
    }
    provider: {
        id: string;
        name: string;
    }
    customer: {
        id: string;
        name: string;
    }
}

export interface IStats {
    totalServices: number;
    activeServices: number;
    monthlyBookings: number;
    pendingBookings: number;
    monthlyRevenue: number;
    totalRevenue: number;
}
