/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Loader2, User, Mail, Phone, Shield } from 'lucide-react';
import { IUser, EUserType } from '@/types/UserType';

interface PersonalInfoTabProps {
    profileData: IUser;
    formData: {
        nome: string;
        email: string;
        telefone: string;
    };
    editMode: boolean;
    loading: boolean;
    error: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    onCancel: () => void;
    onFormDataChange: (field: string, value: string) => void;
}

export function PersonalInfoTab({
    profileData,
    formData,
    editMode,
    loading,
    error,
    onSubmit,
    onCancel,
    onFormDataChange
}: PersonalInfoTabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                    Atualize suas informações pessoais
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {editMode ? (
                    <EditForm
                        formData={formData}
                        loading={loading}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                        onFormDataChange={onFormDataChange}
                    />
                ) : (
                    <ReadOnlyInfo profileData={profileData} />
                )}
            </CardContent>
        </Card>
    );
}

function EditForm({ formData, loading, onSubmit, onCancel, onFormDataChange }: any) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => onFormDataChange('nome', e.target.value)}
                    disabled={loading}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => onFormDataChange('email', e.target.value)}
                    disabled={loading}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                    id="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => onFormDataChange('telefone', e.target.value)}
                    disabled={loading}
                />
            </div>

            <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar Alterações
                        </>
                    )}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancelar
                </Button>
            </div>
        </form>
    );
}

function ReadOnlyInfo({ profileData }: { profileData: IUser }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <InfoItem
                    icon={<User className="h-4 w-4" />}
                    label="Nome"
                    value={profileData.name}
                />
                <InfoItem
                    icon={<Mail className="h-4 w-4" />}
                    label="Email"
                    value={profileData.email}
                />
                <InfoItem
                    icon={<Phone className="h-4 w-4" />}
                    label="Telefone"
                    value={profileData.phone || 'Não informado'}
                />
                <InfoItem
                    icon={<Shield className="h-4 w-4" />}
                    label="Tipo de Conta"
                    value={profileData.type === EUserType.PROVIDER ? 'Provedor de Serviços' : 'Cliente'}
                />
            </div>
        </div>
    );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {icon}
                <span>{label}</span>
            </div>
            <p className="font-medium">{value}</p>
        </div>
    );
}