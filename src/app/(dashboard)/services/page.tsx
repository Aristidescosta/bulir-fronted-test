'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Search, Clock, DollarSign, User, Filter } from 'lucide-react';
import { serviceService } from '@/services/serviceService';
import { formatCurrency } from '@/utils/formatters';
import { IService } from '@/types/service';

export default function ServicesPage() {
    const [services, setServices] = useState<IService[]>([]);
    const [filteredServices, setFilteredServices] = useState<IService[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [priceFilter, setPriceFilter] = useState('all');

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

    useEffect(() => {
        loadServices();
    }, []);

    useEffect(() => {
        filterServices();
    }, [services, searchTerm, categoryFilter, priceFilter]);

    const loadServices = async () => {
        try {
            setLoading(true);
            const data = await serviceService.getAllServices();
            setServices(data.data);
            setFilteredServices(data.data);
        } catch (error) {
            console.error('Erro ao carregar serviços:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterServices = () => {
        let filtered = [...services];

        if (searchTerm) {
            filtered = filtered.filter(
                (service) =>
                    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    service.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(
                (service) => service.category === categoryFilter
            );
        }

        if (priceFilter !== 'all') {
            filtered = filtered.sort((a, b) =>
                priceFilter === 'asc' ? a.price - b.price : b.price - a.price
            );
        }

        setFilteredServices(filtered);
    };

    if (loading) {
        return <ServicesPageSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Explorar Serviços</h1>
                <p className="text-muted-foreground">Encontre o serviço perfeito para você</p>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filtros
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        {/* Search */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Pesquisar</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Nome ou descrição..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Categoria</label>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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

                        {/* Price Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Ordenar por Preço</label>
                            <Select value={priceFilter} onValueChange={setPriceFilter}>
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
                    </div>

                    {/* Active Filters Summary */}
                    {(searchTerm || categoryFilter !== 'all' || priceFilter !== 'all') && (
                        <div className="mt-4 flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-muted-foreground">Filtros ativos:</span>
                            {searchTerm && (
                                <Badge variant="secondary">
                                    Busca: {searchTerm}
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="ml-2 hover:text-destructive"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            )}
                            {categoryFilter !== 'all' && (
                                <Badge variant="secondary">
                                    {categoryFilter}
                                    <button
                                        onClick={() => setCategoryFilter('all')}
                                        className="ml-2 hover:text-destructive"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            )}
                            {priceFilter !== 'all' && (
                                <Badge variant="secondary">
                                    Preço: {priceFilter === 'asc' ? 'Menor' : 'Maior'}
                                    <button
                                        onClick={() => setPriceFilter('all')}
                                        className="ml-2 hover:text-destructive"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {filteredServices.length}{' '}
                    {filteredServices.length === 1 ? 'serviço encontrado' : 'serviços encontrados'}
                </p>
            </div>

            {/* Services Grid */}
            {filteredServices.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">Nenhum serviço encontrado</h3>
                        <p className="text-muted-foreground mb-4">
                            Tente ajustar os filtros ou fazer uma nova busca
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchTerm('');
                                setCategoryFilter('all');
                                setPriceFilter('all');
                            }}
                        >
                            Limpar Filtros
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredServices.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            )}
        </div>
    );
}


// ✅ Componente tipado
interface ServiceCardProps {
    service: IService;
}

function ServiceCard({ service }: ServiceCardProps) {
    return (
        <Card className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between mb-2">
                    <Badge>{service.category}</Badge>
                    <Badge variant="outline">{service.duration} min</Badge>
                </div>
                <CardTitle className="line-clamp-1">{service.name}</CardTitle>
                <CardDescription className="line-clamp-2">{service.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{service.provider_id ?? 'Provedor não disponível'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{service.duration} minutos</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-2xl font-bold text-blue-600">
                            {formatCurrency(service.price)}
                        </span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex gap-2">
                <Button asChild className="flex-1">
                    <Link href={`/services/${service.id}`}>Ver Detalhes</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}


// ✅ Skeleton
function ServicesPageSkeleton() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-10" />
                        ))}
                    </div>
                </CardContent>
            </Card>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-24 mb-2" />
                            <Skeleton className="h-6 w-full mb-2" />
                            <Skeleton className="h-4 w-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-20" />
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-10 w-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
