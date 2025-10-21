'use client';

import { useRouter } from 'next/navigation';
import { useServiceDetail } from '@/hooks/useServiceDetail';
import { ServiceDetailHeader } from '@/components/custom/service/ServiceDetailHeader';
import { LoadingState } from '@/components/custom/service/LoadingState';
import { ErrorState } from '@/components/custom/service/ErrorState';
import BookingModal from '@/components/custom/bookings/BookingModal';
import { BackButton } from '@/components/custom/service/BackButton';
import { ServiceBookingCard } from '@/components/custom/service/ServiceBookingCard';

export default function ServiceDetailPage() {
    const router = useRouter();
    const {
        service,
        loading,
        showBookingModal,
        setShowBookingModal,
        loadService
    } = useServiceDetail();

    const handleBookingSuccess = (): void => {
        setShowBookingModal(false);
        router.push('/bookings');
    };

    if (loading) {
        return <LoadingState />;
    }

    if (!service) {
        return (
            <div className="space-y-6">
                <BackButton />
                <ErrorState
                    onRetry={() => service && loadService(service)}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <BackButton />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <ServiceDetailHeader service={service} />
                </div>

                <div className="lg:col-span-1">
                    <ServiceBookingCard
                        service={service}
                        onBook={() => setShowBookingModal(true)}
                    />
                </div>
            </div>

            {showBookingModal && (
                <BookingModal
                    service={service}
                    isOpen={showBookingModal}
                    onClose={() => setShowBookingModal(false)}
                    onSuccess={handleBookingSuccess}
                />
            )}
        </div>
    );
}