/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
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
import { EServiceCategory, ICreateServiceDTO } from '@/types/service';
import { useAuth } from '@/context/AuthContext';
import { AxiosError } from 'axios';
import { showApiErrors } from '@/utils/helpers';

interface IServiceForm extends Omit<ICreateServiceDTO, 'provider_id'> { }

export default function NewServicePage() {
    const router = useRouter();
    const { user } = useAuth()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<IServiceForm>({
        name: '',
        description: '',
        category: EServiceCategory.BEAUTY,
        duration: 0,
        price: 0,
    });

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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        try {
            setLoading(true);
            await serviceService.createService({
                ...formData,
                provider_id: user?.id || ""
            });
            toast.success('Serviço criado com sucesso!');
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
            setLoading(false);
        }
    };

    const handleChange = (field: keyof IServiceForm, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError('');
    };

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
                    <CardTitle>Novo Serviço</CardTitle>
                    <CardDescription>
                        Cadastre um novo serviço na plataforma
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nome */}
                        <div>
                            <Label htmlFor="nome">Nome do Serviço *</Label>
                            <Input
                                id="nome"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Ex: Limpeza Residencial"
                            />
                        </div>

                        {/* Descrição */}
                        <div>
                            <Label htmlFor="descricao">Descrição</Label>
                            <Textarea
                                id="descricao"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Descreva brevemente o serviço"
                            />
                        </div>

                        {/* Categoria */}
                        <div>
                            <Label htmlFor="categoria">Categoria *</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => handleChange('category', value)}
                            >
                                <SelectTrigger id="categoria">
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

                        {/* Duração */}
                        <div>
                            <Label htmlFor="duracao">Duração (minutos) *</Label>
                            <Input
                                id="duracao"
                                type="number"
                                min="1"
                                value={formData.duration}
                                onChange={(e) => handleChange('duration', e.target.value)}
                                placeholder="Ex: 60"
                            />
                        </div>

                        {/* Preço */}
                        <div>
                            <Label htmlFor="preco">Preço (Kz) *</Label>
                            <Input
                                id="preco"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => handleChange('price', e.target.value)}
                                placeholder="Ex: 2500"
                            />
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="flex justify-end">
                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    'Salvar Serviço'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
