'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { RegisterTabs } from './components/RegisterTabs';
import { RegisterForm } from './components/RegisterForm';
import { RegisterAlerts } from './components/RegisterAlerts';
import { EUserType, IFormData } from '@/types/UserType';

export default function RegisterPage() {
    const [userType, setUserType] = useState<EUserType>(EUserType.CUSTOMER);
    const [formData, setFormData] = useState<IFormData>({
        nome: '',
        email: '',
        telefone: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (field: keyof IFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError('');
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (formData.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        console.log('DATA:', { userType, ...formData });
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
                    <RegisterAlerts error={error} success={success} />
                    <RegisterTabs userType={userType} onChange={setUserType} />
                    <RegisterForm
                        formData={formData}
                        loading={loading}
                        userType={userType}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                    />
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
