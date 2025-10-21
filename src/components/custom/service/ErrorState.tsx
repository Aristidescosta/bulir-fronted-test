import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export function ErrorState({
    message = "Serviço não encontrado",
    onRetry
}: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">{message}</h3>
            <p className="text-muted-foreground mb-4">
                O serviço que você está procurando não foi encontrado ou não está disponível.
            </p>
            {onRetry && (
                <Button onClick={onRetry}>
                    Tentar Novamente
                </Button>
            )}
        </div>
    );
}