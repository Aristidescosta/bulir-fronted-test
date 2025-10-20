/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    User,
    Mail,
    Phone,
    Calendar,
    Shield,
    Loader2,
    Camera,
    Save,
    Lock,
} from 'lucide-react';
import { formatDateTime } from '@/utils/formatters';
import { toast } from 'sonner';
import ChangePasswordForm from '@/components/custom/profile/ChangePasswordForm';
import { EUserStatus, EUserType, IUser } from '@/types/UserType';

type UserStatus = 'ATIVO' | 'INATIVO';
type UserType = 'PROVEDOR' | 'CLIENTE';

interface ProfileData {
    id: string;
    nome: string;
    email: string;
    telefone?: string;
    tipo: UserType;
    status: UserStatus;
    data_criacao: string;
    data_atualizacao?: string;
}

interface FormData {
    nome: string;
    email: string;
    telefone: string;
}

interface ActivityStats {
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalServices: number;
}

interface ActivityTabProps {
    userId: string;
    isProvider: boolean;
}

interface ActivityItemProps {
    action: string;
    description: string;
    time: string;
}

export default function ProfilePage() {
    const { user, isProvider } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [profileData, setProfileData] = useState<IUser | null>(null);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({
        nome: '',
        email: '',
        telefone: '',
    });
    const [error, setError] = useState<string>('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async (): Promise<void> => {
        try {
            const data = await authService.getCurrentUser();
            setProfileData(data.data);
            setFormData({
                nome: data.data.name || '',
                email: data.data.email || '',
                telefone: data.data.phone || '',
            });
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            toast.error('Erro ao carregar perfil');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Aqui você deve criar o endpoint de atualização de perfil na API
            // await userService.updateProfile(formData);

            toast.success('Perfil atualizado com sucesso!');
            setEditMode(false);
            loadProfile();
        } catch (err: any) {
            console.error('Erro ao atualizar perfil:', err);
            setError(err.response?.data?.message || 'Erro ao atualizar perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = (): void => {
        setFormData({
            nome: profileData?.name || '',
            email: profileData?.email || '',
            telefone: profileData?.phone || '',
        });
        setEditMode(false);
        setError('');
    };

    const getInitials = (name?: string): string => {
        return name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || '';
    };

    if (!profileData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Meu Perfil</h1>
                <p className="text-muted-foreground">Gerencie suas informações pessoais e configurações</p>
            </div>

            {/* Profile Header Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Avatar className="h-24 w-24">
                                <AvatarFallback className="text-2xl">
                                    {getInitials(profileData.name)}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                size="icon"
                                variant="secondary"
                                className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                                disabled
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex-1">
                            <h2 className="text-2xl font-bold">{profileData.name}</h2>
                            <p className="text-muted-foreground">{profileData.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant={isProvider() ? 'default' : 'secondary'}>
                                    {isProvider() ? 'Provedor' : 'Cliente'}
                                </Badge>
                                <Badge variant="outline">
                                    {profileData.status === EUserStatus.ACTIVE ? 'Ativo' : 'Inativo'}
                                </Badge>
                            </div>
                        </div>

                        {!editMode && (
                            <Button onClick={() => setEditMode(true)}>
                                <User className="mr-2 h-4 w-4" />
                                Editar Perfil
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="info" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="info">Informações</TabsTrigger>
                    <TabsTrigger value="security">Segurança</TabsTrigger>
                    <TabsTrigger value="activity">Atividade</TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="info" className="space-y-4">
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
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nome">Nome Completo</Label>
                                        <Input
                                            id="nome"
                                            value={formData.nome}
                                            onChange={(e) =>
                                                setFormData({ ...formData, nome: e.target.value })
                                            }
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
                                            onChange={(e) =>
                                                setFormData({ ...formData, email: e.target.value })
                                            }
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
                                            onChange={(e) =>
                                                setFormData({ ...formData, telefone: e.target.value })
                                            }
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
                                            onClick={handleCancel}
                                            disabled={loading}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <User className="h-4 w-4" />
                                                <span>Nome</span>
                                            </div>
                                            <p className="font-medium">{profileData.name}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Mail className="h-4 w-4" />
                                                <span>Email</span>
                                            </div>
                                            <p className="font-medium">{profileData.email}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Phone className="h-4 w-4" />
                                                <span>Telefone</span>
                                            </div>
                                            <p className="font-medium">
                                                {profileData.phone || 'Não informado'}
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Shield className="h-4 w-4" />
                                                <span>Tipo de Conta</span>
                                            </div>
                                            <p className="font-medium">
                                                {profileData.type === EUserType.PROVIDER ? 'Provedor de Serviços' : 'Cliente'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Account Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalhes da Conta</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Membro desde</span>
                                    </div>
                                    <p className="font-medium">{formatDateTime(profileData.created_at)}</p>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Última atualização</span>
                                    </div>
                                    <p className="font-medium">
                                        {profileData.updated_at
                                            ? formatDateTime(profileData.updated_at)
                                            : 'Nunca'}
                                    </p>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Shield className="h-4 w-4" />
                                        <span>Status da Conta</span>
                                    </div>
                                    <Badge variant={profileData.status === EUserStatus.ACTIVE ? 'default' : 'secondary'}>
                                        {profileData.status}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Alterar Senha</CardTitle>
                            <CardDescription>
                                Mantenha sua conta segura com uma senha forte
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChangePasswordForm />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Autenticação em Duas Etapas</CardTitle>
                            <CardDescription>
                                Adicione uma camada extra de segurança à sua conta
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Autenticação em Duas Etapas</p>
                                    <p className="text-sm text-muted-foreground">
                                        Atualmente desabilitada
                                    </p>
                                </div>
                                <Button variant="outline" disabled>
                                    Ativar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-red-200">
                        <CardHeader>
                            <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
                            <CardDescription>
                                Ações irreversíveis na sua conta
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Desativar Conta</p>
                                    <p className="text-sm text-muted-foreground">
                                        Sua conta será desativada temporariamente
                                    </p>
                                </div>
                                <Button variant="outline" disabled>
                                    Desativar
                                </Button>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-red-600">Excluir Conta</p>
                                    <p className="text-sm text-muted-foreground">
                                        Permanentemente remover sua conta e dados
                                    </p>
                                </div>
                                <Button variant="destructive" disabled>
                                    Excluir
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity" className="space-y-4">
                    <ActivityTab userId={profileData.id} isProvider={isProvider()} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Activity Tab Component
function ActivityTab({ userId, isProvider }: ActivityTabProps) {
    const [stats, setStats] = useState<ActivityStats>({
        totalBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalServices: 0,
    });

    useEffect(() => {
        loadActivityStats();
    }, []);

    const loadActivityStats = async (): Promise<void> => {
        // Implementar lógica para buscar estatísticas
        // Por enquanto, dados mockados
        setStats({
            totalBookings: 15,
            completedBookings: 12,
            cancelledBookings: 2,
            totalServices: isProvider ? 5 : 0,
        });
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Estatísticas de Atividade</CardTitle>
                    <CardDescription>Resumo da sua atividade na plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Total de Reservas</p>
                            <p className="text-2xl font-bold">{stats.totalBookings}</p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Concluídas</p>
                            <p className="text-2xl font-bold text-green-600">{stats.completedBookings}</p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Canceladas</p>
                            <p className="text-2xl font-bold text-red-600">{stats.cancelledBookings}</p>
                        </div>

                        {isProvider && (
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Serviços Ativos</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.totalServices}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Atividades Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <ActivityItem
                            action="Reserva confirmada"
                            description="Limpeza Residencial Completa"
                            time="2 horas atrás"
                        />
                        <Separator />
                        <ActivityItem
                            action="Perfil atualizado"
                            description="Telefone alterado"
                            time="1 dia atrás"
                        />
                        <Separator />
                        <ActivityItem
                            action="Nova reserva criada"
                            description="Manutenção de Computadores"
                            time="3 dias atrás"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function ActivityItem({ action, description, time }: ActivityItemProps) {
    return (
        <div className="flex items-start gap-4">
            <div className="h-2 w-2 mt-2 rounded-full bg-blue-600" />
            <div className="flex-1">
                <p className="font-medium">{action}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <span className="text-xs text-muted-foreground">{time}</span>
        </div>
    );
}