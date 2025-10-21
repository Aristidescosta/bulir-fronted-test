import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ChangePasswordForm from './ChangePasswordForm';

export function SecurityTab() {
    return (
        <div className="space-y-4">
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

            <DangerZoneCard />
        </div>
    );
}

function DangerZoneCard() {
    return (
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
    );
}