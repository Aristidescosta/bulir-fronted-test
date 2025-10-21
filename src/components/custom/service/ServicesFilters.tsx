import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';

interface ServicesFiltersProps {
    searchTerm: string;
    categoryFilter: string;
    priceFilter: string;
    categories: string[];
    onSearchChange: (term: string) => void;
    onCategoryChange: (category: string) => void;
    onPriceChange: (price: string) => void;
    onClearFilter: (type: 'search' | 'category' | 'price') => void;
}

export function ServicesFilters({
    searchTerm,
    categoryFilter,
    priceFilter,
    categories,
    onSearchChange,
    onCategoryChange,
    onPriceChange,
    onClearFilter
}: ServicesFiltersProps) {
    const hasActiveFilters = searchTerm || categoryFilter !== 'all' || priceFilter !== 'all';

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtros
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                    <SearchInput
                        value={searchTerm}
                        onChange={onSearchChange}
                    />

                    <CategorySelect
                        value={categoryFilter}
                        categories={categories}
                        onChange={onCategoryChange}
                    />

                    <PriceSelect
                        value={priceFilter}
                        onChange={onPriceChange}
                    />
                </div>

                {hasActiveFilters && (
                    <ActiveFilters
                        searchTerm={searchTerm}
                        categoryFilter={categoryFilter}
                        priceFilter={priceFilter}
                        onClearFilter={onClearFilter}
                    />
                )}
            </CardContent>
        </Card>
    );
}

function SearchInput({ value, onChange }: {
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">Pesquisar</label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Nome ou descrição..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="pl-10"
                />
            </div>
        </div>
    );
}

function CategorySelect({ value, categories, onChange }: {
    value: string;
    categories: string[];
    onChange: (value: string) => void;
}) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                            {cat}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

function PriceSelect({ value, onChange }: {
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">Ordenar por Preço</label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Padrão</SelectItem>
                    <SelectItem value="asc">Menor preço</SelectItem>
                    <SelectItem value="desc">Maior preço</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}

function ActiveFilters({ searchTerm, categoryFilter, priceFilter, onClearFilter }: {
    searchTerm: string;
    categoryFilter: string;
    priceFilter: string;
    onClearFilter: (type: 'search' | 'category' | 'price') => void;
}) {
    return (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Filtros ativos:</span>
            {searchTerm && (
                <FilterBadge
                    label={`Busca: ${searchTerm}`}
                    onClear={() => onClearFilter('search')}
                />
            )}
            {categoryFilter !== 'all' && (
                <FilterBadge
                    label={categoryFilter}
                    onClear={() => onClearFilter('category')}
                />
            )}
            {priceFilter !== 'all' && (
                <FilterBadge
                    label={`Preço: ${priceFilter === 'asc' ? 'Menor' : 'Maior'}`}
                    onClear={() => onClearFilter('price')}
                />
            )}
        </div>
    );
}

function FilterBadge({ label, onClear }: {
    label: string;
    onClear: () => void;
}) {
    return (
        <Badge variant="secondary">
            {label}
            <button
                onClick={onClear}
                className="ml-2 hover:text-destructive"
            >
                ×
            </button>
        </Badge>
    );
}