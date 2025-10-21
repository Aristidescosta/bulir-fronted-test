import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface DescriptionInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function DescriptionInput({ value, onChange, placeholder = "Descrição opcional..." }: DescriptionInputProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="description">Descrição (Opcional)</Label>
            <Textarea
                id="description"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={3}
            />
        </div>
    );
}