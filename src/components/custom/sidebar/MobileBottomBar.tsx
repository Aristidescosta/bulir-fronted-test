'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Calendar, Search, Wallet, User, LucideIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface MobileNavItem {
    href: string;
    label: string;
    icon: LucideIcon;
}

export function MobileBottomBar() {
    const pathname = usePathname();
    const { isProvider } = useAuth();

    const clientNavItems: MobileNavItem[] = [
        { href: '/dashboard', label: 'Início', icon: LayoutDashboard },
        { href: '/services', label: 'Serviços', icon: Search },
        { href: '/wallet', label: 'Carteira', icon: Wallet },
        { href: '/bookings', label: 'Reservas', icon: Calendar },
        { href: '/profile', label: 'Perfil', icon: User },
    ];

    const providerNavItems: MobileNavItem[] = [
        { href: '/dashboard', label: 'Início', icon: LayoutDashboard },
        { href: '/my-services', label: 'Serviços', icon: Search },
        { href: '/bookings', label: 'Agenda', icon: Calendar },
        { href: '/wallet', label: 'Carteira', icon: Wallet },
        { href: '/profile', label: 'Perfil', icon: User },
    ];

    const navItems = isProvider() ? providerNavItems : clientNavItems;

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-30">
            <div className="flex items-center justify-around">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'flex flex-col items-center py-2 px-3 flex-1 min-w-0',
                                'transition-colors duration-200'
                            )}
                        >
                            <div className={cn(
                                'p-2 rounded-lg transition-colors',
                                isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            )}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <span className={cn(
                                'text-xs mt-1 transition-colors',
                                isActive
                                    ? 'text-blue-600 font-medium'
                                    : 'text-gray-500'
                            )}>
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}