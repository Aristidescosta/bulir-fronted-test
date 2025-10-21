/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useEditService.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { serviceService } from '@/services/serviceService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { showApiErrors } from '@/utils/helpers';
import { IService } from '@/types/service';
import { ServiceFormData, serviceFormSchema } from '@/app/shared/schemas/serviceSchema';

interface UseEditServiceReturn {
    form: any;
    isSubmitting: boolean;
    isLoading: boolean;
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export function useEditService(): UseEditServiceReturn {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();

    const form = useForm<ServiceFormData>({
        resolver: zodResolver(serviceFormSchema),
        mode: 'onChange',
    });

    useEffect(() => {
        loadService();
    }, [params.id]);

    const loadService = async (): Promise<void> => {
        try {
            const data: IService = await serviceService.getServiceById(params.id);
            form.reset({
                name: data.name,
                description: data.description || '',
                category: data.category,
                duration: data.duration,
                price: data.price,
            });
        } catch (error) {
            console.error('Erro ao carregar serviço:', error);
            toast.error('Erro ao carregar serviço');
            router.push('/my-services');
        }
    };

    const onSubmit = async (data: ServiceFormData): Promise<void> => {
        try {
            await serviceService.updateService(params.id, {
                ...data,
                provider_id: user?.id || ""
            });
            toast.success('Serviço atualizado com sucesso!');
            router.push('/my-services');
        } catch (error: unknown) {
            const err = error as AxiosError<any>;
            const errors = err.response?.data?.errors;

            if (errors && (typeof errors === 'object')) {
                showApiErrors(errors);
            } else if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Houve um erro interno, tente novamente mais tarde!");
            }
        }
    };

    return {
        form,
        isSubmitting: form.formState.isSubmitting,
        isLoading: form.formState.isLoading,
        onSubmit: form.handleSubmit(onSubmit),
    };
}