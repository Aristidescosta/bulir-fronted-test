import { useState, useEffect, useMemo } from 'react';
import { serviceService } from '@/services/serviceService';
import { IService } from '@/types/service';

interface UseServicesReturn {
    services: IService[];
    filteredServices: IService[];
    loading: boolean;
    searchTerm: string;
    categoryFilter: string;
    priceFilter: string;
    setSearchTerm: (term: string) => void;
    setCategoryFilter: (category: string) => void;
    setPriceFilter: (price: string) => void;
    clearFilters: () => void;
    loadServices: () => Promise<void>;
}

export function useServices(): UseServicesReturn {
    const [services, setServices] = useState<IService[]>([]);
    const [filteredServices, setFilteredServices] = useState<IService[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [priceFilter, setPriceFilter] = useState('all');

    const categories = useMemo(() => [
        'Limpeza',
        'Manutenção',
        'Beleza',
        'Educação',
        'Tecnologia',
        'Saúde',
        'Transporte',
        'Outros',
    ], []);

    const loadServices = async (): Promise<void> => {
        try {
            setLoading(true);
            const data = await serviceService.getAllServices();
            setServices(data.data);
            setFilteredServices(data.data);
        } catch (error) {
            console.error('Erro ao carregar serviços:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadServices();
    }, []);

    useEffect(() => {
        filterServices();
    }, [services, searchTerm, categoryFilter, priceFilter]);

    const filterServices = (): void => {
        let filtered = [...services];

        if (searchTerm) {
            filtered = filtered.filter(
                (service) =>
                    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    service.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(
                (service) => service.category === categoryFilter
            );
        }

        if (priceFilter !== 'all') {
            filtered = filtered.sort((a, b) =>
                priceFilter === 'asc' ? a.price - b.price : b.price - a.price
            );
        }

        setFilteredServices(filtered);
    };

    const clearFilters = (): void => {
        setSearchTerm('');
        setCategoryFilter('all');
        setPriceFilter('all');
    };

    return {
        services,
        filteredServices,
        loading,
        searchTerm,
        categoryFilter,
        priceFilter,
        setSearchTerm,
        setCategoryFilter,
        setPriceFilter,
        clearFilters,
        loadServices,
    };
}