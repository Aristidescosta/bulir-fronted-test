/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/api";
import { IApiResponse } from "./bookingService";
import { ICreateServiceDTO, IService } from "@/types/service";


export interface IServiceFilters {
    category?: string;
    search?: string;
    isActive?: boolean;
    [key: string]: any;
}

export const serviceService = {
    getAllServices: async (filters: IServiceFilters = {}): Promise<IApiResponse<IService[]>> => {
        const params = new URLSearchParams(filters as Record<string, string>);
        const response = await api.get(`/services?${params.toString()}`);
        return response.data;
    },

    getServiceById: async (id: string): Promise<IApiResponse<IService>> => {
        const response = await api.get(`/services/${id}`);
        return response.data;
    },

    getMyServices: async (): Promise<IApiResponse<IService[]>> => {
        const response = await api.get('/services/my');
        return response.data;
    },

    createService: async (serviceData: ICreateServiceDTO): Promise<IService> => {
        const response = await api.post('/services', serviceData);
        return response.data;
    },

    // PUT /services/:id (editar serviço)
    updateService: async (id: string, serviceData: Partial<ICreateServiceDTO>): Promise<IService> => {
        const response = await api.put(`/services/${id}`, serviceData);
        return response.data;
    },

    // PATCH /services/:id/status (ativar/desativar)
    toggleServiceStatus: async (id: string): Promise<IService> => {
        const response = await api.patch(`/services/${id}/status`);
        return response.data;
    },

    // DELETE /services/:id (excluir serviço)
    deleteService: async (id: string): Promise<{ message: string }> => {
        const response = await api.delete(`/services/${id}`);
        return response.data;
    },
};
