// app/services/page.tsx
'use client';

import { useServices } from '@/hooks/useServices';
import { ServicesHeader } from '@/components/custom/service/ServicesHeader';
import { ServicesFilters } from '@/components/custom/service/ServicesFilters';
import { ServicesGrid } from '@/components/custom/service/ServicesGrid';
import { ServicesPageSkeleton } from '@/components/custom/service/ServicesPageSkeleton';

export default function ServicesPage() {
    const {
        filteredServices,
        loading,
        searchTerm,
        categoryFilter,
        priceFilter,
        setSearchTerm,
        setCategoryFilter,
        setPriceFilter,
        clearFilters,
    } = useServices();

    const categories = [
        'Limpeza',
        'Manutenção',
        'Beleza',
        'Educação',
        'Tecnologia',
        'Saúde',
        'Transporte',
        'Outros',
    ];

    const handleClearFilter = (type: 'search' | 'category' | 'price'): void => {
        switch (type) {
            case 'search':
                setSearchTerm('');
                break;
            case 'category':
                setCategoryFilter('all');
                break;
            case 'price':
                setPriceFilter('all');
                break;
        }
    };

    if (loading) {
        return <ServicesPageSkeleton />;
    }

    return (
        <div className="space-y-6">
            <ServicesHeader />

            <ServicesFilters
                searchTerm={searchTerm}
                categoryFilter={categoryFilter}
                priceFilter={priceFilter}
                categories={categories}
                onSearchChange={setSearchTerm}
                onCategoryChange={setCategoryFilter}
                onPriceChange={setPriceFilter}
                onClearFilter={handleClearFilter}
            />

            <ServicesGrid
                services={filteredServices}
                onClearFilters={clearFilters}
            />
        </div>
    );
}