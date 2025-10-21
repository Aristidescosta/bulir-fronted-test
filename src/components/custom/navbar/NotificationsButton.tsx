import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

interface NotificationsButtonProps {
    hasNotifications?: boolean;
    onClick?: () => void;
}

export function NotificationsButton({
    hasNotifications = true,
    onClick
}: NotificationsButtonProps) {
    return (
        <Button variant="ghost" size="icon" className="relative" onClick={onClick}>
            <Bell className="h-5 w-5" />
            {hasNotifications && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            )}
        </Button>
    );
}