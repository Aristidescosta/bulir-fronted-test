'use client';

import { useRouter } from 'next/navigation';
import { useCreateService } from '@/hooks/useCreateService';
import { PageHeader } from '@/components/custom/service/PageHeader';
import { ServiceForm } from '@/components/custom/service/ServiceForm';

export default function NewServicePage() {
    const router = useRouter();
    const { form, isSubmitting, onSubmit } = useCreateService();

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <PageHeader backHref="/my-services" backLabel="Voltar para Meus Serviços" />

            <ServiceForm
                form={form}
                isSubmitting={isSubmitting}
                onCancel={() => router.push('/my-services')}
                mode="create"
                onSubmit={onSubmit}
            />
        </div>
    );
}