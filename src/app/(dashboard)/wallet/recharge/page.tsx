'use client';

import { useRecharge } from '@/hooks/useRecharge';
import { RechargeHeader } from '@/components/custom/wallet/RechargeHeader';
import { RechargeForm } from '@/components/custom/wallet/RechargeForm';
import { BackButton } from '@/components/custom/service/BackButton';

export default function RechargePage() {
    const {
        amount,
        description,
        loading,
        setAmount,
        setDescription,
        handleSubmit,
        quickAmounts,
    } = useRecharge();

    const handleAmountSelect = (selectedAmount: number): void => {
        setAmount(selectedAmount.toString());
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <BackButton />

            <RechargeHeader />

            <RechargeForm
                amount={amount}
                description={description}
                loading={loading}
                quickAmounts={quickAmounts}
                onAmountChange={setAmount}
                onDescriptionChange={setDescription}
                onAmountSelect={handleAmountSelect}
                onSubmit={handleSubmit}
            />
        </div>
    );
}