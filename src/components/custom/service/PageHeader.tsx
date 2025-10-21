import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageHeaderProps {
    backHref: string;
    backLabel?: string;
}

export function PageHeader({ backHref, backLabel = 'Voltar' }: PageHeaderProps) {
    return (
        <Button variant="ghost" asChild>
            <Link href={backHref}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {backLabel}
            </Link>
        </Button>
    );
}