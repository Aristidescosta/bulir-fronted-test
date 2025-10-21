import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { serviceService } from '@/services/serviceService';
import { IService } from '@/types/service';

interface UseServiceDetailReturn {
    service: IService | null;
    loading: boolean;
    showBookingModal: boolean;
    setShowBookingModal: (show: boolean) => void;
    loadService: (id: string) => Promise<void>;
}

export function useServiceDetail(): UseServiceDetailReturn {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    
    const [service, setService] = useState<IService | null>(null);
    const [loading, setLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);

    useEffect(() => {
        if (params?.id) {
            loadService(params.id);
        }
    }, [params.id]);

    const loadService = async (id: string): Promise<void> => {
        try {
            setLoading(true);
            const data = await serviceService.getServiceById(id);
            setService(data);
        } catch (error) {
            console.error('Erro ao carregar serviço:', error);
            router.push('/services');
        } finally {
            setLoading(false);
        }
    };

    return {
        service,
        loading,
        showBookingModal,
        setShowBookingModal,
        loadService,
    };
}