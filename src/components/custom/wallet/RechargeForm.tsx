import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { QuickAmounts } from './QuickAmounts';
import { AmountInput } from './AmountInput';
import { DescriptionInput } from './DescriptionInput';
import { SubmitButton } from './SubmitButton';

interface RechargeFormProps {
    amount: string;
    description: string;
    loading: boolean;
    quickAmounts: number[];
    onAmountChange: (amount: string) => void;
    onDescriptionChange: (description: string) => void;
    onAmountSelect: (amount: number) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function RechargeForm({
    amount,
    description,
    loading,
    quickAmounts,
    onAmountChange,
    onDescriptionChange,
    onAmountSelect,
    onSubmit
}: RechargeFormProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Detalhes da Recarga</CardTitle>
                <CardDescription>Escolha o valor e método de pagamento</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    <QuickAmounts
                        amounts={quickAmounts}
                        selectedAmount={amount}
                        onAmountSelect={onAmountSelect}
                    />

                    <AmountInput
                        value={amount}
                        onChange={onAmountChange}
                    />

                    <Separator />

                    <DescriptionInput
                        value={description}
                        onChange={onDescriptionChange}
                    />

                    <SubmitButton loading={loading} />
                </form>
            </CardContent>
        </Card>
    );
}