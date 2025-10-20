/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

type PasswordField = 'current' | 'new' | 'confirm';

interface ShowPasswordsState {
    current: boolean;
    new: boolean;
    confirm: boolean;
}

interface FormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function ChangePasswordForm() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [showPasswords, setShowPasswords] = useState<ShowPasswordsState>({
        current: false,
        new: false,
        confirm: false,
    });
    const [formData, setFormData] = useState<FormData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const toggleShowPassword = (field: PasswordField): void => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');

        // Validações
        if (formData.newPassword.length < 6) {
            setError('A nova senha deve ter pelo menos 6 caracteres');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (formData.currentPassword === formData.newPassword) {
            setError('A nova senha deve ser diferente da senha atual');
            return;
        }

        try {
            setLoading(true);

            // Implementar endpoint de mudança de senha
            // await authService.changePassword({
            //   currentPassword: formData.currentPassword,
            //   newPassword: formData.newPassword,
            // });

            toast.success('Senha alterada com sucesso!');

            // Limpar formulário
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (err: any) {
            console.error('Erro ao alterar senha:', err);
            setError(err.response?.data?.message || 'Erro ao alterar senha');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof FormData, value: string): void => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Current Password */}
            <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <div className="relative">
                    <Input
                        id="currentPassword"
                        type={showPasswords.current ? 'text' : 'password'}
                        value={formData.currentPassword}
                        onChange={(e) => handleChange('currentPassword', e.target.value)}
                        disabled={loading}
                        required
                        className="pr-10"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => toggleShowPassword('current')}
                    >
                        {showPasswords.current ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <div className="relative">
                    <Input
                        id="newPassword"
                        type={showPasswords.new ? 'text' : 'password'}
                        value={formData.newPassword}
                        onChange={(e) => handleChange('newPassword', e.target.value)}
                        disabled={loading}
                        required
                        className="pr-10"
                        placeholder="Mínimo 6 caracteres"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => toggleShowPassword('new')}
                    >
                        {showPasswords.new ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <div className="relative">
                    <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        disabled={loading}
                        required
                        className="pr-10"
                        placeholder="Digite a senha novamente"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => toggleShowPassword('confirm')}
                    >
                        {showPasswords.confirm ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Password Requirements */}
            <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-medium mb-2">Requisitos da senha:</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Mínimo de 6 caracteres</li>
                    <li>Diferente da senha atual</li>
                    <li>Recomendado: mistura de letras, números e símbolos</li>
                </ul>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Alterando Senha...
                    </>
                ) : (
                    'Alterar Senha'
                )}
            </Button>
        </form>
    );
}