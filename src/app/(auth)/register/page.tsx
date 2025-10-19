'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Briefcase } from 'lucide-react';
import { EUserType } from '@/types/UserType';

/**
 * Exemplo de EUserType (caso não tenha no seu projeto):
 * export enum EUserType {
 *   CUSTOMER = 'CLIENTE',
 *   PROVIDER = 'PROVEDOR',
 * }
 */

interface IFormData {
    nome: string;
    email: string;
    telefone: string;
    password: string;
    confirmPassword: string;
}

export default function RegisterPage() {
    const [userType, setUserType] = useState<EUserType>(EUserType.CUSTOMER);
    const [formData, setFormData] = useState<IFormData>({
        nome: '',
        email: '',
        telefone: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validações
        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (formData.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        console.log("DATA: ", { userType, ...formData });

        // Exemplo de chamada a API futuramente:
        // setLoading(true);
        // try {
        //   const res = await fetch('/api/register', { ... });
        //   setSuccess('Conta criada com sucesso!');
        // } catch (err) {
        //   setError('Erro ao criar conta.');
        // } finally {
        //   setLoading(false);
        // }
    };

    const handleChange = (field: keyof IFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-3xl font-bold text-center">Criar Conta</CardTitle>
                    <CardDescription className="text-center">
                        Escolha o tipo de conta e preencha seus dados
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert className="mb-4 border-green-500 bg-green-50">
                            <AlertDescription className="text-green-700">{success}</AlertDescription>
                        </Alert>
                    )}

                    <Tabs
                        value={userType}
                        onValueChange={(val) => setUserType(val as EUserType)}
                        className="mb-6"
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value={EUserType.CUSTOMER} className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Cliente
                            </TabsTrigger>
                            <TabsTrigger value={EUserType.PROVIDER} className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4" />
                                Provedor
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value={EUserType.CUSTOMER} className="mt-4">
                            <p className="text-sm text-muted-foreground">
                                Como cliente, você poderá buscar e contratar serviços de profissionais qualificados.
                            </p>
                        </TabsContent>

                        <TabsContent value={EUserType.PROVIDER} className="mt-4">
                            <p className="text-sm text-muted-foreground">
                                Como provedor, você poderá cadastrar seus serviços e receber reservas de clientes.
                            </p>
                        </TabsContent>
                    </Tabs>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nome">Nome Completo</Label>
                            <Input
                                id="nome"
                                type="text"
                                placeholder="João Silva"
                                required
                                value={formData.nome}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleChange('nome', e.target.value)
                                }
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                required
                                value={formData.email}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleChange('email', e.target.value)
                                }
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="telefone">Telefone</Label>
                            <Input
                                id="telefone"
                                type="tel"
                                placeholder="(00) 00000-0000"
                                required
                                value={formData.telefone}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleChange('telefone', e.target.value)
                                }
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                required
                                value={formData.password}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleChange('password', e.target.value)
                                }
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Digite a senha novamente"
                                required
                                value={formData.confirmPassword}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleChange('confirmPassword', e.target.value)
                                }
                                disabled={loading}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Criando conta...
                                </>
                            ) : (
                                `Cadastrar como ${userType === EUserType.CUSTOMER ? 'Cliente' : 'Provedor'}`
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-sm text-center text-muted-foreground">
                        Já tem uma conta?{' '}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Faça login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
