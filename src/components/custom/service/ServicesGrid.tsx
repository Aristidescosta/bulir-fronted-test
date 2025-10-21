// components/custom/services/ServicesGrid.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { IService } from '@/types/service';
import { ServiceCard } from './ServiceCard';

interface ServicesGridProps {
    services: IService[];
    onClearFilters: () => void;
}

export function ServicesGrid({ services, onClearFilters }: ServicesGridProps) {
    if (services.length === 0) {
        return <EmptyState onClearFilters={onClearFilters} />;
    }

    return (
        <>
            <ResultsSummary count={services.length} />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                ))}
            </div>
        </>
    );
}

function ResultsSummary({ count }: { count: number }) {
    return (
        <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
                {count} {count === 1 ? 'serviço encontrado' : 'serviços encontrados'}
            </p>
        </div>
    );
}

function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
    return (
        <Card>
            <CardContent className="py-12 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Nenhum serviço encontrado</h3>
                <p className="text-muted-foreground mb-4">
                    Tente ajustar os filtros ou fazer uma nova busca
                </p>
                <Button
                    variant="outline"
                    onClick={onClearFilters}
                >
                    Limpar Filtros
                </Button>
            </CardContent>
        </Card>
    );
}