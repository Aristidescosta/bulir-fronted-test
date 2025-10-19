'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { EUserType } from '@/types/UserType';
import { RegisterFormData, registerSchema } from '@/app/shared/schemas';

interface RegisterFormProps {
    loading: boolean;
    userType: EUserType;
    onSubmit: (data: RegisterFormData) => void;
}

export function RegisterForm({ loading, userType, onSubmit }: RegisterFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                    id="nome"
                    type="text"
                    placeholder="João Silva"
                    disabled={loading}
                    {...register('name')}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    disabled={loading}
                    {...register('email')}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="nif">NIF</Label>
                <Input
                    id="nif"
                    type="text"
                    placeholder="999999999"
                    disabled={loading}
                    {...register('nif')}
                />
                {errors.nif && <p className="text-sm text-red-500">{errors.nif.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                    id="telefone"
                    type="tel"
                    placeholder="999999999"
                    disabled={loading}
                    {...register('phone')}
                />
                {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    disabled={loading}
                    {...register('password')}
                />
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Digite a senha novamente"
                    disabled={loading}
                    {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
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
    );
}
