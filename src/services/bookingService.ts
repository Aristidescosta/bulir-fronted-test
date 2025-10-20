/* eslint-disable @typescript-eslint/no-explicit-any */

import api from "@/lib/api";
import { IBooking, IBookingWithDetails } from "@/types/booking";

export interface ICreateBookingDTO {
    service_id: string;
    customer_id: string;
    booking_date: Date;
    start_time: string;
}

export interface ICancelBookingDTO {
    reason?: string;
    [key: string]: any;
}

export interface IBookingFilters {
    status?: 'pending' | 'confirmed' | 'cancelled';
    date?: string;
    serviceId?: string;
    [key: string]: any;
}

export interface IAvailability {
    available: boolean;
    availableTimes?: string[];
    [key: string]: any;
}

export interface IApiResponse<T> {
    success: boolean;
    data: T;
    pagination?: {
        limit: number;
        page: number;
        total: number;
        totalPages: number;
    };
}


export const bookingService = {
    getMyBookings: async (filters: IBookingFilters = {}): Promise<IApiResponse<IBookingWithDetails[]>> => {
        const params = new URLSearchParams(filters as Record<string, string>);
        const response = await api.get(`/bookings?${params.toString()}`);
        return response.data;
    },

    // GET /bookings/:id (detalhes de uma reserva)
    getBookingById: async (id: string): Promise<IBooking> => {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
    },


    createBooking: async (bookingData: ICreateBookingDTO): Promise<IBooking> => {
        const response = await api.post('/booking', bookingData);
        return response.data;
    },

    // PATCH /bookings/:id/confirm (provedor confirma reserva)
    confirmBooking: async (id: string): Promise<IBooking> => {
        const response = await api.patch(`/bookings/${id}/confirm`);
        return response.data;
    },

    // PATCH /bookings/:id/cancel (cancelar reserva)
    cancelBooking: async (id: string, cancelData?: ICancelBookingDTO): Promise<IBooking> => {
        const response = await api.patch(`/bookings/${id}/cancel`, cancelData);
        return response.data;
    },

    // GET /bookings/service/:serviceId/availability (verificar disponibilidade)
    checkAvailability: async (serviceId: string, date: string): Promise<IAvailability> => {
        const response = await api.get(`/bookings/service/${serviceId}/availability`, {
            params: { date },
        });
        return response.data;
    },
};
