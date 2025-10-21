import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
    href?: string;
    label?: string;
}

export function BackButton({ 
    href = "/services", 
    label = "Voltar para Serviços" 
}: BackButtonProps) {
    return (
        <Button variant="ghost" asChild>
            <Link href={href}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {label}
            </Link>
        </Button>
    );
}