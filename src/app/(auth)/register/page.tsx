/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { RegisterTabs } from './components/RegisterTabs';
import { RegisterForm } from './components/RegisterForm';
import { EUserType } from '@/types/UserType';
import { RegisterFormData } from '@/app/shared/schemas';
import { useAuth } from '@/context/AuthContext';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { showApiErrors } from '@/utils/helpers';

export default function RegisterPage() {
    const [userType, setUserType] = useState<EUserType>(EUserType.CUSTOMER);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        try {
            await register({ type: userType, ...data });
            toast.success('Conta criada com sucesso! 👋');
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
                    <RegisterTabs userType={userType} onChange={setUserType} />
                    <RegisterForm loading={loading} userType={userType} onSubmit={handleSubmit} />
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
