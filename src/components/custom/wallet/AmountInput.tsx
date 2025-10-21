import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AmountInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function AmountInput({ value, onChange, placeholder = "Digite o valor" }: AmountInputProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="amount">Valor da Recarga</Label>
            <Input
                id="amount"
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}