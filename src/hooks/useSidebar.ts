// hooks/useSidebar.ts
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, Calendar, Search, Package, User, Wallet, LucideIcon } from 'lucide-react';

export interface SidebarLink {
    href: string;
    label: string;
    icon: LucideIcon;
}

export interface UseSidebarReturn {
    links: SidebarLink[];
    pathname: string;
    isMobileOpen: boolean;
    setIsMobileOpen: (open: boolean) => void;
}

export function useSidebar(): UseSidebarReturn {
    const { isProvider } = useAuth();
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const clientLinks: SidebarLink[] = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/services', label: 'Explorar Serviços', icon: Search },
        { href: '/wallet', label: 'Carteira', icon: Wallet },
        { href: '/bookings', label: 'Minhas Reservas', icon: Calendar },
        { href: '/profile', label: 'Perfil', icon: User },
    ];

    const providerLinks: SidebarLink[] = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/my-services', label: 'Meus Serviços', icon: Package },
        { href: '/bookings', label: 'Agenda', icon: Calendar },
        { href: '/wallet', label: 'Carteira', icon: Wallet },
        { href: '/services', label: 'Explorar Serviços', icon: Search },
        { href: '/profile', label: 'Perfil', icon: User },
    ];

    const links = isProvider() ? providerLinks : clientLinks;

    return {
        links,
        pathname,
        isMobileOpen,
        setIsMobileOpen,
    };
}