import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SidebarLinkProps {
    href: string;
    label: string;
    icon: LucideIcon;
    isActive: boolean;
    onClick?: () => void;
    variant?: 'desktop' | 'mobile';
}

export function SidebarLink({
    href,
    label,
    icon: Icon,
    isActive,
    onClick,
    variant = 'desktop'
}: SidebarLinkProps) {
    const baseClasses = 'flex items-center gap-3 rounded-lg transition-colors';
    const variantClasses = {
        desktop: 'px-4 py-3',
        mobile: 'px-4 py-4 text-lg'
    };
    const activeClasses = isActive
        ? 'bg-blue-50 text-blue-600 font-medium'
        : 'text-gray-700 hover:bg-gray-50';

    return (
        <Link
            href={href}
            className={cn(baseClasses, variantClasses[variant], activeClasses)}
            onClick={onClick}
        >
            <Icon className={cn(
                "h-5 w-5",
                variant === 'mobile' && "h-6 w-6"
            )} />
            {label}
        </Link>
    );
}