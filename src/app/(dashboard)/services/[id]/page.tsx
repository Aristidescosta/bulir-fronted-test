'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Clock, DollarSign, ArrowLeft, Calendar } from 'lucide-react';

import { serviceService } from '@/services/serviceService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatCurrency } from '@/utils/formatters';
import { IService } from '@/types/service';
import BookingModal from '@/components/custom/bookings/BookingModal';

export default function ServiceDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();

    const [service, setService] = useState<IService | null>(null);
    const [loading, setLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);

    useEffect(() => {
        if (params?.id) {
            loadService(params.id);
        }
    }, [params.id]);

    const loadService = async (id: string) => {
        try {
            setLoading(true);
            const data = await serviceService.getServiceById(id);
            setService(data.data);
        } catch (error) {
            console.error('Erro ao carregar serviço:', error);
            router.push('/services');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!service) {
        return <div>Serviço não encontrado</div>;
    }

    const getInitials = (name?: string): string =>
        name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || '';

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Button variant="ghost" asChild>
                <Link href="/services">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Serviços
                </Link>
            </Button>

            {/* Service Details */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                                <Badge>{service.category}</Badge>
                                <Badge variant="outline">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {service.duration} min
                                </Badge>
                            </div>
                            <CardTitle className="text-3xl">{service.name}</CardTitle>
                            <CardDescription className="text-base">{service.description}</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-4">
                                <Separator />

                                <div>
                                    <h3 className="font-semibold mb-2">Detalhes do Serviço</h3>
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span>Duração: {service.duration} minutos</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4" />
                                            <span>Preço: {formatCurrency(service.price)}</span>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Provider Info */}
                                <div>
                                    <h3 className="font-semibold mb-3">Prestador do Serviço</h3>
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback>{getInitials(service.provider?.name)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{service.provider?.name}</p>
                                            <p className="text-sm text-muted-foreground">{service.provider?.email}</p>
                                            {service.provider?.phone && (
                                                <p className="text-sm text-muted-foreground">{service.provider?.phone}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Booking Card */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle>Reservar Serviço</CardTitle>
                            <CardDescription>Agende seu horário</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Preço</span>
                                    <span className="text-2xl font-bold text-blue-600">
                                        {formatCurrency(service.price)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Duração</span>
                                    <span>{service.duration} minutos</span>
                                </div>
                            </div>

                            <Separator />

                            <Button
                                className="w-full"
                                size="lg"
                                onClick={() => setShowBookingModal(true)}
                            >
                                <Calendar className="mr-2 h-4 w-4" />
                                Fazer Reserva
                            </Button>

                            <p className="text-xs text-center text-muted-foreground">
                                Ao reservar, você concorda com nossos termos de uso
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {showBookingModal && (
                <BookingModal
                    service={service}
                    isOpen={showBookingModal}
                    onClose={() => setShowBookingModal(false)}
                    onSuccess={() => {
                        setShowBookingModal(false);
                        router.push('/bookings');
                    }}
                />
            )}
        </div>
    );
}
