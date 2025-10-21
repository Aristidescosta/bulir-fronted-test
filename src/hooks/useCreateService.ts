/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useCreateService.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { serviceService } from '@/services/serviceService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { showApiErrors } from '@/utils/helpers';
import { EServiceCategory } from '@/types/service';
import { ServiceFormData, serviceFormSchema } from '@/app/shared/schemas/serviceSchema';

interface UseCreateServiceReturn {
    form: ReturnType<typeof useForm<ServiceFormData>>;
    isSubmitting: boolean;
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export function useCreateService(): UseCreateServiceReturn {
    const router = useRouter();
    const { user } = useAuth();

    const form = useForm<ServiceFormData>({
        resolver: zodResolver(serviceFormSchema),
        defaultValues: {
            name: '',
            description: '',
            category: EServiceCategory.BEAUTY,
            duration: 0,
            price: 0,
        },
        mode: 'onChange',
    });

    const onSubmit = async (data: ServiceFormData): Promise<void> => {
        try {
            await serviceService.createService({
                ...data,
                description: data.description || "",
                provider_id: user?.id || ""
            });
            toast.success('Serviço criado com sucesso!');
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
        onSubmit: form.handleSubmit(onSubmit),
    };
}