'use client';

import { useRouter } from 'next/navigation';
import { useEditService } from '@/hooks/useEditService';
import { LoadingState } from '@/components/custom/service/LoadingState';
import { PageHeader } from '@/components/custom/service/PageHeader';
import { ServiceForm } from '@/components/custom/service/ServiceForm';

export default function EditServicePage() {
    const router = useRouter();
    const { form, isSubmitting, isLoading, onSubmit } = useEditService();

    if (isLoading) {
        return <LoadingState />;
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <PageHeader backHref="/my-services" backLabel="Voltar para Meus Serviços" />

            <ServiceForm
                onSubmit={onSubmit}
                form={form}
                isSubmitting={isSubmitting}
                onCancel={() => router.push('/my-services')}
                mode="edit"
            />
        </div>
    );
}