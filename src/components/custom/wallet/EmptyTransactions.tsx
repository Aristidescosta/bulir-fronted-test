import { Wallet } from 'lucide-react';

export function EmptyTransactions() {
    return (
        <div className="text-center py-12">
            <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma transação encontrada</h3>
            <p className="text-muted-foreground">Suas transações aparecerão aqui</p>
        </div>
    );
}