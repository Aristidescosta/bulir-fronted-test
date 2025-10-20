'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Calendar,
    Search,
    Package,
    User,
    LucideIcon,
    Wallet,
} from 'lucide-react';
import React from 'react';

interface ILink {
    href: string;
    label: string;
    icon: LucideIcon;
}

export default function Sidebar() {
    const { user, isProvider } = useAuth()

    const pathname = usePathname();

    const clientLinks: ILink[] = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/services', label: 'Explorar Serviços', icon: Search },
        { href: '/wallet', label: 'Carteira', icon: Wallet },
        { href: '/bookings', label: 'Minhas Reservas', icon: Calendar },
        { href: '/profile', label: 'Perfil', icon: User },
    ];

    const providerLinks: ILink[] = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/my-services', label: 'Meus Serviços', icon: Package },
        { href: '/bookings', label: 'Agenda', icon: Calendar },
        { href: '/wallet', label: 'Carteira', icon: Wallet },
        { href: '/services', label: 'Explorar Serviços', icon: Search },
        { href: '/profile', label: 'Perfil', icon: User },
    ];

    const links = isProvider() ? providerLinks : clientLinks;

    return (
        <aside className="hidden lg:block w-64 bg-white border-r min-h-[calc(100vh-73px)]">
            <nav className="p-4 space-y-2">
                {links.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                                isActive
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
