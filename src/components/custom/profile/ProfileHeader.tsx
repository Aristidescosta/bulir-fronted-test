import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Camera, User } from 'lucide-react';
import { IUser } from '@/types/UserType';
import { useAuth } from '@/context/AuthContext';

interface ProfileHeaderProps {
    profileData: IUser;
    editMode: boolean;
    onEdit: () => void;
}

export function ProfileHeader({ profileData, editMode, onEdit }: ProfileHeaderProps) {
    const { isProvider } = useAuth();

    const getInitials = (name?: string): string => {
        return name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || '';
    };

    return (
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
                                {profileData.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                            </Badge>
                        </div>
                    </div>

                    {!editMode && (
                        <Button onClick={onEdit}>
                            <User className="mr-2 h-4 w-4" />
                            Editar Perfil
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}