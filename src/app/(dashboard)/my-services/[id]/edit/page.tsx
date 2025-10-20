/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { serviceService } from '@/services/serviceService';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { IServiceForm } from '../../new/page';
import { EServiceCategory, IService } from '@/types/service';
import { AxiosError } from 'axios';
import { showApiErrors } from '@/utils/helpers';
import { useAuth } from '@/context/AuthContext';


export default function EditServicePage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [formData, setFormData] = useState<IServiceForm>({
        name: '',
        description: '',
        category: EServiceCategory.BEAUTY,
        duration: 0,
        price: 0,
    });

    const categories: string[] = [
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
        loadService();
    }, [params.id]);

    const loadService = async () => {
        try {
            setLoading(true);
            const data: IService = await serviceService.getServiceById(params.id);
            setFormData({
                name: data.name,
                description: data.description || '',
                category: data.category,
                duration: data.duration,
                price: data.price,
            });
        } catch (error) {
            console.error('Erro ao carregar serviço:', error);
            toast.error('Erro ao carregar serviço');
            router.push('/my-services');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            await serviceService.updateService(params.id, {
                ...formData,
                provider_id: user?.id || ""
            });
            toast.success('Serviço atualizado com sucesso!');
            router.push('/my-services');
        } catch (error: unknown) {
            const err = error as AxiosError<any>;

            const errors = err.response?.data?.errors;
            if (errors && (typeof errors === 'object')) {
                if (errors) showApiErrors(errors);
            }
            else if (err.response?.data?.message) {
                toast.error(err.response?.data?.message)
            }
            else {
                toast.error("Houve um erro interno, tente novamente mais tarde!")
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (field: keyof IServiceForm, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError('');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <Button variant="ghost" asChild>
                <Link href="/my-services">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Link>
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle>Editar Serviço</CardTitle>
                    <CardDescription>Atualize as informações do seu serviço</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription aria-live="assertive">
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4" aria-busy={submitting}>
                        <div className="space-y-2">
                            <Label htmlFor="nome">
                                Nome do Serviço <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="nome"
                                placeholder="Ex: Limpeza Residencial Completa"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                disabled={submitting}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descricao">Descrição</Label>
                            <Textarea
                                id="descricao"
                                placeholder="Descreva seu serviço em detalhes..."
                                rows={4}
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                disabled={submitting}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="categoria">
                                Categoria <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => handleChange('category', value)}
                                disabled={submitting}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(EServiceCategory).map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="duracao">
                                    Duração (minutos) <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="duracao"
                                    type="number"
                                    min="1"
                                    placeholder="60"
                                    value={formData.duration}
                                    onChange={(e) => handleChange('duration', e.target.value)}
                                    disabled={submitting}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="preco">
                                    Preço (AOA) <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="preco"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="5000.00"
                                    value={formData.price}
                                    onChange={(e) => handleChange('price', e.target.value)}
                                    disabled={submitting}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={submitting} className="flex-1">
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    'Salvar Alterações'
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/my-services')}
                                disabled={submitting}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
