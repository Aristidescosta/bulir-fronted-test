import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';

interface QuickAmountsProps {
    amounts: number[];
    selectedAmount: string;
    onAmountSelect: (amount: number) => void;
}

export function QuickAmounts({ amounts, selectedAmount, onAmountSelect }: QuickAmountsProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {amounts.map((amount) => (
                <Button
                    type="button"
                    key={amount}
                    variant={selectedAmount === amount.toString() ? "default" : "outline"}
                    size="sm"
                    onClick={() => onAmountSelect(amount)}
                >
                    {formatCurrency(amount)}
                </Button>
            ))}
        </div>
    );
}