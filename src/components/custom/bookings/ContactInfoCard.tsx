import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ContactInfoCardProps {
    contactPerson: {
        name?: string;
    };
    isProvider: boolean;
}

export function ContactInfoCard({ contactPerson, isProvider }: ContactInfoCardProps) {
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
            <CardHeader>
                <CardTitle>
                    {isProvider ? 'Informações do Cliente' : 'Informações do Provedor'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-lg">
                            {getInitials(contactPerson?.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                        <div>
                            <h3 className="font-semibold text-lg">{contactPerson?.name}</h3>
                            <p className="text-sm text-muted-foreground">
                                {isProvider ? 'Cliente' : 'Prestador de Serviço'}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}