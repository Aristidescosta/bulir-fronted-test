import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
    loading: boolean;
    disabled?: boolean;
    label?: string;
    loadingLabel?: string;
}

export function SubmitButton({
    loading,
    disabled = false,
    label = "Recarregar",
    loadingLabel = "Processando..."
}: SubmitButtonProps) {
    return (
        <Button type="submit" disabled={loading || disabled} className="w-full">
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {loadingLabel}
                </>
            ) : (
                label
            )}
        </Button>
    );
}