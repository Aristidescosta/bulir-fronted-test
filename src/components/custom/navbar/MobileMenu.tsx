import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, User, Settings, LogOut, Bell } from 'lucide-react';
import Link from 'next/link';
import { UserAvatar } from './UserAvatar';

interface MobileMenuProps {
    user: {
        nome: string;
        tipo: 'PROVEDOR' | 'CLIENTE';
    };
    initials: string;
    onLogout: () => void;
}

export function MobileMenu({ user, initials, onLogout }: MobileMenuProps) {
    const userRole = user.tipo === 'PROVEDOR' ? 'Provedor' : 'Cliente';

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                    {/* User Info */}
                    <div className="flex items-center gap-3 p-4 border-b">
                        <UserAvatar
                            initials={initials}
                            name={user.nome}
                            role={userRole}
                            showInfo={true}
                        />
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/profile" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Perfil
                            </Link>
                        </Button>

                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/profile/settings" className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                Configurações
                            </Link>
                        </Button>

                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/notifications" className="flex items-center gap-2">
                                <Bell className="h-4 w-4" />
                                Notificações
                            </Link>
                        </Button>
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-600"
                            onClick={onLogout}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sair
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}