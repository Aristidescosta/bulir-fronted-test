import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const QuickAction = ({
    href,
    icon,
    label,
    outline,
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
    outline?: boolean;
}) => (
    <Button asChild variant={outline ? 'outline' : 'default'} className="h-20">
        <Link href={href} className="flex flex-col gap-2">
            {icon}
            {label}
        </Link>
    </Button>
);