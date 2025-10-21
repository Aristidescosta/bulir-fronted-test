import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface UserAvatarProps {
    initials: string;
    name?: string;
    role?: string;
    showInfo?: boolean;
}

export function UserAvatar({
    initials,
    name,
    role,
    showInfo = true
}: UserAvatarProps) {
    return (
        <div className="flex items-center gap-2">
            <Avatar>
                <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            {showInfo && (
                <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                </div>
            )}
        </div>
    );
}