import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar, Shield } from 'lucide-react';
import { formatDateTime } from '@/utils/formatters';
import { IUser, EUserStatus } from '@/types/UserType';

interface AccountDetailsCardProps {
    profileData: IUser;
}

export function AccountDetailsCard({ profileData }: AccountDetailsCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Detalhes da Conta</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <DetailItem
                        icon={<Calendar className="h-4 w-4" />}
                        label="Membro desde"
                        value={formatDateTime(profileData.created_at)}
                    />
                    <Separator />
                    <DetailItem
                        icon={<Calendar className="h-4 w-4" />}
                        label="Última atualização"
                        value={profileData.updated_at ? formatDateTime(profileData.updated_at) : 'Nunca'}
                    />
                    <Separator />
                    <DetailItem
                        icon={<Shield className="h-4 w-4" />}
                        label="Status da Conta"
                        value={
                            <Badge variant={profileData.status === EUserStatus.ACTIVE ? 'default' : 'secondary'}>
                                {profileData.status}
                            </Badge>
                        }
                    />
                </div>
            </CardContent>
        </Card>
    );
}

function DetailItem({ icon, label, value }: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {icon}
                <span>{label}</span>
            </div>
            <div className="font-medium">{value}</div>
        </div>
    );
}